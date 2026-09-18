import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getProducts } from '../lib/api.js';

const PROMO_CODE = 'CHEESE10', PROMO_PERCENT = 10;
const fmt = (v) => `${Math.round(v).toLocaleString('ru-RU')} ₽`;

function extractUserPhoneDigits(phone) {
  if (!phone) return '';
  const raw = String(phone).trim();
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    digits = digits.slice(1);
  } else if (digits.startsWith('7') && raw.includes('+7')) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
}

function extractUserAddress(user) {
  if (!user || !user.addresses) return '';
  const first = Array.isArray(user.addresses) ? user.addresses[0] : user.addresses[0];
  if (!first) return '';
  if (typeof first === 'string') return first.trim();
  if (typeof first === 'object' && first.address) return String(first.address).trim();
  return '';
}

function useProducts() {
  const [p, setP] = useState([]);
  useEffect(() => {
    let c = false;
    getProducts()
      .then((l) => !c && setP((l || []).map((x) => ({ ...x, name: (x.name || '').trim(), image: (x.image || '').trim() }))))
      .catch(() => !c && setP([]));
    return () => {
      c = true;
    };
  }, []);
  return p;
}

export default function Checkout() {
  const { user } = useAuth();
  const { items, totalQty, clear, appliedPromo, applyPromo } = useCart();
  const products = useProducts();
  const navigate = useNavigate();

  const [name, setName] = useState(() => (user?.name ? String(user.name).trim() : ''));
  const [phoneDigits, setPhoneDigits] = useState(() => (user?.phone ? extractUserPhoneDigits(user.phone) : ''));
  const [email, setEmail] = useState(() => (user?.email ? String(user.email).trim() : ''));
  const [delivery, setDelivery] = useState('Доставка курьером');
  const [address, setAddress] = useState(() => extractUserAddress(user));
  const [payment, setPayment] = useState('Картой онлайн');

  useEffect(() => {
    if (user) {
      setName(user.name ? String(user.name).trim() : '');
      setPhoneDigits(user.phone ? extractUserPhoneDigits(user.phone) : '');
      setEmail(user.email ? String(user.email).trim() : '');
      setAddress(extractUserAddress(user));
    }
  }, [user]);

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [errors, setErrors] = useState({});

  const byId = useMemo(() => {
    const m = new Map();
    products.forEach((x) => m.set(String(x.id), x));
    return m;
  }, [products]);

  const rows = useMemo(
    () =>
      items.map((it) => {
        const p = byId.get(String(it.id));
        const bp = Number(p?.price) || 0;
        const lp = (bp * it.pack) / 100;
        return { id: it.id, pack: it.pack, qty: it.qty, lineTotal: lp * it.qty };
      }),
    [items, byId]
  );

  const it = useMemo(() => rows.reduce((s, r) => s + r.lineTotal, 0), [rows]);
  const disc = appliedPromo === PROMO_CODE ? Math.round((it * PROMO_PERCENT) / 100) : 0;
  const gt = Math.max(0, it - disc);

  const phoneDisplay = useMemo(() => {
    if (!phoneDigits) return '';
    let res = '+7 (';
    for (let i = 0; i < 10; i++) {
      if (i < phoneDigits.length) {
        res += phoneDigits[i];
      } else {
        res += '_';
      }
      if (i === 2) res += ') ';
      if (i === 5) res += '-';
      if (i === 7) res += '-';
    }
    return res;
  }, [phoneDigits]);

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    let digits = val.replace(/\D/g, '');
    if (digits.startsWith('7') || digits.startsWith('8')) {
      digits = digits.slice(1);
    }
    setPhoneDigits(digits.slice(0, 10));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
  };

  const handlePhoneKeyDown = (e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      if (selectionStart !== null && selectionEnd !== null && selectionEnd - selectionStart > 1) {
        setPhoneDigits('');
      } else {
        setPhoneDigits((prev) => prev.slice(0, -1));
      }
      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
    } else if (e.key === 'Delete') {
      e.preventDefault();
      setPhoneDigits('');
      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const handlePromoApply = (e) => {
    e.preventDefault();
    const res = applyPromo(promoInput);
    if (res.success) {
      setPromoError('');
    } else {
      setPromoError(res.error || 'Промокод не распознан');
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Введите ваше имя';
    }
    if (phoneDigits.length < 10) {
      newErrors.phone = 'Заполните номер телефона полностью';
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Введите корректный email';
    }
    if (delivery === 'Доставка курьером' && !address.trim()) {
      newErrors.address = 'Введите адрес доставки';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const order = {
      id: Date.now(),
      items,
      total: gt,
      discount: disc,
      delivery,
      payment,
      date: new Date().toISOString(),
    };

    try {
      localStorage.setItem('syrnaya-palitra:orders:v1', JSON.stringify(order));
    } catch (err) {
      console.error('Failed to save order to localStorage:', err);
    }

    clear();
    navigate('/success');
  };

  if (items.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] py-10 font-montserrat">
        <nav className="text-[13px] text-neutral-350 mb-5">
          <Link to="/" className="text-neutral-700 no-underline hover:text-brand-900">Главная</Link>
          <span className="mx-2">/</span>
          <Link to="/cart" className="text-neutral-700 no-underline hover:text-brand-900">Корзина</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-700">Оформление</span>
        </nav>
        <h1 className="font-lora text-[32px] font-bold text-neutral-900-alt mb-10">Оформление заказа</h1>
        <div className="bg-surface-cream border border-neutral-250-a80 rounded-radius-xl py-16 px-6 text-center">
          <p className="text-[18px] text-neutral-500 mb-6">Ваша корзина пуста</p>
          <Link to="/catalog" className="inline-flex px-8 py-4 rounded-radius-lg bg-brand-900 text-surface-white font-medium no-underline hover:bg-brand-700">В каталог</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] py-10 font-montserrat">
      <nav className="text-[13px] text-neutral-350 mb-5">
        <Link to="/" className="text-neutral-700 no-underline hover:text-brand-900">Главная</Link>
        <span className="mx-2">/</span>
        <Link to="/cart" className="text-neutral-700 no-underline hover:text-brand-900">Корзина</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-700">Оформление</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px] gap-10 xl:gap-16 items-start">
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
            <h1 className="font-lora text-[32px] font-bold text-neutral-900-alt">Оформление заказа</h1>
            {!user && (
              <span className="text-[14px] text-neutral-black">
                Уже есть аккаунт? <Link to="/auth" className="font-bold underline text-neutral-black hover:text-brand-900">Войти</Link>
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[14px] text-neutral-black mb-2">Ваше имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="Иван"
                  className={`w-full h-[48px] px-4 bg-surface-white border ${errors.name ? 'border-danger-700' : 'border-neutral-250-a80'} rounded-radius-md text-[14px] text-neutral-black placeholder:text-neutral-400 outline-none focus:border-brand-900`}
                />
                {errors.name && <p className="text-[13px] text-danger-700 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-[14px] text-neutral-black mb-2">Номер телефона</label>
                <input
                  type="tel"
                  value={phoneDisplay}
                  onChange={handlePhoneChange}
                  onKeyDown={handlePhoneKeyDown}
                  placeholder="+7 (___) ___-__-__"
                  className={`w-full h-[48px] px-4 bg-surface-white border ${errors.phone ? 'border-danger-700' : 'border-neutral-250-a80'} rounded-radius-md text-[14px] text-neutral-black placeholder:text-neutral-400 outline-none focus:border-brand-900`}
                />
                {errors.phone && <p className="text-[13px] text-danger-700 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[14px] text-neutral-black mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                placeholder="example@mail.ru"
                className={`w-full h-[48px] px-4 bg-surface-white border ${errors.email ? 'border-danger-700' : 'border-neutral-250-a80'} rounded-radius-md text-[14px] text-neutral-black placeholder:text-neutral-400 outline-none focus:border-brand-900`}
              />
              {errors.email && <p className="text-[13px] text-danger-700 mt-1">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <h2 className="font-montserrat text-[18px] font-bold text-neutral-black mb-3">Способ получения</h2>
              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setDelivery('Доставка курьером')}
                  className={`h-[48px] px-8 rounded-radius-lg font-medium text-[14px] cursor-pointer transition-colors ${
                    delivery === 'Доставка курьером'
                      ? 'bg-brand-900 text-surface-white border border-brand-900'
                      : 'bg-surface-white text-brand-outline border border-brand-outline hover:border-brand-900'
                  }`}
                >
                  Доставка курьером
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDelivery('Самовывоз');
                    if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                  }}
                  className={`h-[48px] px-8 rounded-radius-lg font-medium text-[14px] cursor-pointer transition-colors ${
                    delivery === 'Самовывоз'
                      ? 'bg-brand-900 text-surface-white border border-brand-900'
                      : 'bg-surface-white text-brand-outline border border-brand-outline hover:border-brand-900'
                  }`}
                >
                  Самовывоз
                </button>
              </div>

              {delivery === 'Доставка курьером' ? (
                <div>
                  <label className="block text-[14px] text-neutral-black mb-2">Адрес доставки</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                    }}
                    placeholder="г. Томск, ул. Сырная, д. 7, кв. 7"
                    className={`w-full h-[48px] px-4 bg-surface-white border ${
                      errors.address ? 'border-danger-700' : 'border-neutral-250-a80'
                    } rounded-radius-md text-[14px] text-neutral-black placeholder:text-neutral-400 outline-none focus:border-brand-900`}
                  />
                  {errors.address && <p className="text-[13px] text-danger-700 mt-1">{errors.address}</p>}
                </div>
              ) : (
                <p className="text-[14px] text-neutral-700 py-2">
                  Заберите из нашей лавки: г. Томск, ул. Сырная, д. 7
                </p>
              )}
            </div>

            <div className="mb-8">
              <h2 className="font-montserrat text-[18px] font-bold text-neutral-black mb-3">Способ оплаты</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      payment === 'Картой онлайн' ? 'border-neutral-black' : 'border-neutral-400'
                    }`}
                  >
                    {payment === 'Картой онлайн' && <span className="w-2.5 h-2.5 rounded-full bg-neutral-black" />}
                  </span>
                  <input
                    type="radio"
                    name="payment"
                    value="Картой онлайн"
                    checked={payment === 'Картой онлайн'}
                    onChange={(e) => setPayment(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-[15px] text-neutral-black">Картой онлайн</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      payment === 'При получении' ? 'border-neutral-black' : 'border-neutral-400'
                    }`}
                  >
                    {payment === 'При получении' && <span className="w-2.5 h-2.5 rounded-full bg-neutral-black" />}
                  </span>
                  <input
                    type="radio"
                    name="payment"
                    value="При получении"
                    checked={payment === 'При получении'}
                    onChange={(e) => setPayment(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-[15px] text-neutral-black">При получении</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        <aside className="bg-surface-white border border-neutral-250-a80 rounded-radius-xl p-6 lg:mt-[68px]">
          <div className="flex items-center justify-between text-[15px] text-neutral-black mb-4">
            <span>Товары ({totalQty})</span>
            <span className="font-inter font-bold">{fmt(it)}</span>
          </div>
          <div className="flex items-center justify-between text-[15px] text-neutral-black mb-5">
            <span>Скидка</span>
            <span className="font-inter font-bold">-{disc} ₽</span>
          </div>
          <div className="border-t border-neutral-250 pt-5 mb-5 flex items-center justify-between">
            <span className="text-[24px] font-bold text-neutral-black">Итого</span>
            <span className="text-[24px] font-bold text-neutral-black">{fmt(gt)}</span>
          </div>
          <form onSubmit={handlePromoApply} className="flex items-center gap-3 mb-4">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="Введите промокод..."
              className="flex-1 min-w-0 h-[44px] px-4 bg-surface-white border border-neutral-250-a80 rounded-radius-md text-[14px] text-neutral-black placeholder:text-neutral-400 outline-none focus:border-brand-900"
            />
            <button
              type="submit"
              className="w-[44px] h-[44px] shrink-0 rounded-radius-md bg-brand-900 text-surface-white cursor-pointer hover:bg-brand-700 flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 mx-auto">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
          {promoError && <p className="text-[13px] text-danger-700 mb-4">{promoError}</p>}
          {appliedPromo && !promoError && (
            <p className="text-[13px] text-brand-700 mb-4">Промокод {appliedPromo} применён</p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center justify-center w-full h-[52px] rounded-radius-md bg-brand-900 text-surface-white text-[16px] font-medium cursor-pointer hover:bg-brand-700 transition-colors"
          >
            Оплатить заказ
          </button>
        </aside>
      </div>
    </div>
  );
}

