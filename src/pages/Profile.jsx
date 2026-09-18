import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

function formatPhone(val) {
  if (!val) return '';
  const d = val.replace(/\D/g, '');
  if (!d) return '';
  const body = (d.startsWith('7') || d.startsWith('8') ? d.slice(1) : d).slice(0, 10);
  let res = '+7';
  if (body.length > 0) res += ' (' + body.slice(0, 3);
  if (body.length >= 3) res += ') ' + body.slice(3, 6);
  if (body.length >= 6) res += '-' + body.slice(6, 8);
  if (body.length >= 8) res += '-' + body.slice(8, 10);
  return res;
}

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { push } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const tab = new URLSearchParams(location.search).get('tab');

  const notify = (msg, type = 'error') => {
    if (typeof push === 'function') push(msg, type);
  };

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subscribeEmail, setSubscribeEmail] = useState(false);
  const [subscribeSms, setSubscribeSms] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedRecently, setSavedRecently] = useState(false);
  const saveTimerRef = React.useRef(null);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setName((user.name || '').trim());
      setPhone(formatPhone((user.phone || '').trim()));
      setEmail((user.email || '').trim());
      setSubscribeEmail(Boolean(user.subscribeEmail));
      setSubscribeSms(Boolean(user.subscribeSms));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        subscribeEmail,
        subscribeSms,
      });
      notify('Изменения сохранены', 'success');
      setSavedRecently(true);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        setSavedRecently(false);
      }, 10000);
    } catch (err) {
      if (err?.message === 'EMAIL_TAKEN') {
        setEmailError('Этот email уже занят');
        notify('Email уже занят', 'error');
      } else {
        setEmailError(err?.message || 'Ошибка сохранения');
      }
    } finally {
      setSaving(false);
    }
  };

  const balance = useMemo(() => {
    if (!user) return 0;
    try {
      const raw = localStorage.getItem('syrnaya-palitra:orders:v1');
      const orders = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(orders)) return 0;
      const userOrders = orders.filter(
        (o) => (o.userId !== undefined && String(o.userId) === String(user.id)) ||
               (o.userEmail && String(o.userEmail).toLowerCase() === String(user.email).toLowerCase())
      );
      return Math.round(userOrders.reduce((s, o) => s + Number(o.total ?? o.totalPrice ?? o.finalTotal ?? 0), 0));
    } catch {
      return 0;
    }
  }, [user]);

  return (
    <div className="w-full bg-surface-white font-montserrat min-h-[70vh] pb-[96px]">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] 2xl:px-[120px] max-w-[1920px] mx-auto py-6 sm:py-8">
        {/* Хлебные крошки */}
        <nav className="flex items-center gap-2 text-[13px] text-neutral-500 mb-6 sm:mb-8" aria-label="Хлебные крошки">
          <Link to="/" className="text-neutral-500 hover:text-neutral-800 transition-colors">
            Главная
          </Link>
          <span className="text-neutral-400">/</span>
          <Link to="/profile" className="text-neutral-500 hover:text-neutral-800 transition-colors">
            Личный кабинет
          </Link>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-700 font-medium">
            {tab === 'orders' ? 'История заказов' : 'Мой профиль'}
          </span>
        </nav>

        {/* H1 Заголовок */}
        <h1 className="font-lora text-[32px] sm:text-[36px] font-bold text-neutral-900-alt mb-8 sm:mb-10">
          Личный кабинет
        </h1>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* Сайдбар слева */}
          <aside className="w-full lg:w-48 shrink-0 flex flex-col">
            <div className="flex lg:flex-col gap-6 lg:gap-4 text-[15px]">
              <Link
                to="/profile"
                className={`transition-colors ${
                  tab !== 'orders'
                    ? 'font-bold text-neutral-900-alt'
                    : 'text-neutral-700 hover:text-neutral-900-alt'
                }`}
              >
                Мой профиль
              </Link>
              <Link
                to="/profile?tab=orders"
                className={`transition-colors ${
                  tab === 'orders'
                    ? 'font-bold text-neutral-900-alt'
                    : 'text-neutral-700 hover:text-neutral-900-alt'
                }`}
              >
                История заказов
              </Link>
            </div>

            <div className="mt-8 lg:mt-12">
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-[15px] text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer bg-transparent border-none p-0 text-left"
              >
                Выйти
              </button>
            </div>
          </aside>

          {/* Контент вкладки */}
          {tab === 'orders' ? (
            <div className="flex-1 w-full pt-1 text-[15px] text-neutral-600">
              История заказов — следующая задача
            </div>
          ) : (
            <div className="flex-1 w-full flex flex-col xl:flex-row gap-10 xl:gap-16 items-start justify-between">
              {/* Блок Личные данные */}
              <div className="w-full max-w-[480px]">
                <h2 className="text-[22px] font-bold text-neutral-900-alt mb-6 font-montserrat">
                  Личные данные
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[13px] text-neutral-500 mb-1">
                      Имя
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-[46px] px-4 rounded-lg border border-neutral-300 focus:outline-none focus:border-brand-900 text-neutral-900-alt text-[14px] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] text-neutral-500 mb-1">
                      Номер телефона
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      placeholder="+7 (___) ___-__-__"
                      className="w-full h-[46px] px-4 rounded-lg border border-neutral-300 focus:outline-none focus:border-brand-900 text-neutral-900-alt text-[14px] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] text-neutral-500 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
                      }}
                      className={`w-full h-[46px] px-4 rounded-lg border focus:outline-none focus:border-brand-900 text-neutral-900-alt text-[14px] transition-colors ${
                        emailError ? 'border-danger-700' : 'border-neutral-300'
                      }`}
                    />
                    {emailError && (
                      <p className="text-danger-700 text-[13px] mt-1.5 font-montserrat">
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div
                        className={`w-[18px] h-[18px] rounded-[4px] flex items-center justify-center transition-colors border ${
                          subscribeEmail
                            ? 'bg-[#3A2E2B] border-[#3A2E2B] text-white'
                            : 'border-neutral-400 bg-white hover:border-neutral-600'
                        }`}
                      >
                        {subscribeEmail && (
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={subscribeEmail}
                        onChange={(e) => setSubscribeEmail(e.target.checked)}
                      />
                      <span className="text-[14px] text-neutral-800">
                        Получать акции и скидки на почту
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div
                        className={`w-[18px] h-[18px] rounded-[4px] flex items-center justify-center transition-colors border ${
                          subscribeSms
                            ? 'bg-[#3A2E2B] border-[#3A2E2B] text-white'
                            : 'border-neutral-400 bg-white hover:border-neutral-600'
                        }`}
                      >
                        {subscribeSms && (
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={subscribeSms}
                        onChange={(e) => setSubscribeSms(e.target.checked)}
                      />
                      <span className="text-[14px] text-neutral-800">
                        SMS-уведомления о заказах
                      </span>
                    </label>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-brand-900 text-white hover:bg-brand-700 transition-colors font-medium text-[15px] px-8 py-3.5 rounded-lg disabled:opacity-60 cursor-pointer"
                    >
                      {saving ? 'Сохранение...' : savedRecently ? 'Изменения сохранены' : 'Сохранить изменения'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Правая колонка: Карта баланса */}
              <div className="w-full xl:w-auto shrink-0 mt-6 xl:mt-0">
                <div
                  className="relative rounded-2xl overflow-hidden p-6 text-white shadow-md flex flex-col justify-between w-full sm:w-[360px] min-h-[160px]"
                  style={{
                    backgroundColor: '#1E1B18',
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url('/images/balance.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <div>
                    <div className="text-[13px] text-white/80 mb-1">
                      Ваш баланс
                    </div>
                    <div className="text-[28px] sm:text-[32px] font-bold tracking-tight text-white">
                      {balance} баллов
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[13px] pt-4 mt-2">
                    <span className="text-white/80">1 балл = 1 ₽</span>
                    <button
                      type="button"
                      onClick={() => notify('1 балл за каждый 1 ₽ заказа')}
                      className="text-white underline hover:text-white/80 transition-colors bg-transparent border-none p-0 cursor-pointer text-[13px]"
                    >
                      Как копить?
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

