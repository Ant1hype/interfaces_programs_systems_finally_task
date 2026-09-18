import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getProducts } from '../lib/api.js';

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

function formatOrderNumber(id) {
  const digits = String(id ?? '').replace(/\D/g, '');
  const last6 = (digits || '000000').slice(-6).padStart(6, '0');
  return `${last6.slice(0, 4)}-${last6.slice(4)}`;
}

function formatOrderDate(rawDate) {
  if (!rawDate) return '';
  const d = new Date(rawDate);
  if (isNaN(d.getTime())) return String(rawDate);
  return d
    .toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .replace(/\s*г\.?$/, '');
}

function getOrderStatus(order) {
  const rawDate = order.date || order.createdAt || order.id;
  const d = new Date(rawDate);
  if (isNaN(d.getTime())) {
    return 'В пути';
  }
  const isOlderThanDay = Date.now() - d.getTime() > 24 * 60 * 60 * 1000;
  return isOlderThanDay ? 'Доставлен' : 'В пути';
}

function formatOrderTotal(order) {
  const total = Number(order.total ?? order.totalPrice ?? order.finalTotal ?? 0);
  return `${Math.round(total).toLocaleString('ru-RU')} ₽`;
}

export default function Profile() {
  const { user, updateProfile, logout, changePassword } = useAuth();
  const { push } = useToast();
  const { add } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const tab = new URLSearchParams(location.search).get('tab');

  const [products, setProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    getProducts()
      .then((data) => {
        if (mounted && Array.isArray(data)) setProducts(data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const productsMap = useMemo(() => {
    const map = new Map();
    products.forEach((p) => map.set(String(p.id), p));
    return map;
  }, [products]);

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

  // Смена пароля
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Мои адреса
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [addressLabel, setAddressLabel] = useState('');
  const [addressValue, setAddressValue] = useState('');
  const [addressSaving, setAddressSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
  }, [tab]);

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

  const handlePasswordSubmit = async (e) => {
    if (e) e.preventDefault();
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    if (!newPassword || newPassword.length < 6) {
      setNewPasswordError('Пароль должен быть не менее 6 символов');
      hasError = true;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Пароли не совпадают');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res === 'WRONG_CURRENT') {
        setCurrentPasswordError('Неверный текущий пароль');
        return;
      }
      notify('Пароль изменён', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPasswordError('');
      setNewPasswordError('');
      setConfirmPasswordError('');
    } catch (err) {
      if (err?.message === 'WRONG_CURRENT' || err === 'WRONG_CURRENT') {
        setCurrentPasswordError('Неверный текущий пароль');
      } else {
        setCurrentPasswordError(err?.message || 'Неверный текущий пароль');
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    if (e) e.preventDefault();
    const label = addressLabel.trim() || 'Дом';
    const addr = addressValue.trim();
    if (!addr) {
      notify('Введите адрес', 'error');
      return;
    }

    setAddressSaving(true);
    try {
      const currentAddresses = Array.isArray(user?.addresses) ? user.addresses : [];
      const newAddressItem = {
        id: Date.now().toString(),
        label,
        address: addr,
      };
      const updatedAddresses = [...currentAddresses, newAddressItem];
      await updateProfile({
        addresses: updatedAddresses,
      });
      notify('Адрес добавлен', 'success');
      setShowAddAddress(false);
      setAddressLabel('');
      setAddressValue('');
    } catch (err) {
      notify(err?.message || 'Ошибка добавления адреса', 'error');
    } finally {
      setAddressSaving(false);
    }
  };

  const handleStartEdit = (item, idx) => {
    setShowAddAddress(false);
    setEditingIndex(idx);
    setEditingId(item?.id ?? null);
    setAddressLabel(typeof item === 'string' ? item : item.label || item.title || '');
    setAddressValue(typeof item === 'string' ? item : item.address || item.text || '');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingId(null);
    setAddressLabel('');
    setAddressValue('');
  };

  const handleSaveEdit = async (e) => {
    if (e) e.preventDefault();
    const label = addressLabel.trim() || 'Дом';
    const addr = addressValue.trim();
    if (!addr) {
      notify('Введите адрес', 'error');
      return;
    }

    setAddressSaving(true);
    try {
      const currentAddresses = Array.isArray(user?.addresses) ? user.addresses : [];
      const updatedAddresses = currentAddresses.map((item, idx) => {
        const isMatch = (editingId !== null && item?.id !== undefined && item.id === editingId) || idx === editingIndex;
        if (isMatch) {
          const id = item?.id ?? editingId ?? Date.now().toString();
          return { ...(typeof item === 'object' ? item : {}), id, label, address: addr };
        }
        return item;
      });
      await updateProfile({
        addresses: updatedAddresses,
      });
      notify('Адрес обновлён', 'success');
      setEditingIndex(null);
      setEditingId(null);
      setAddressLabel('');
      setAddressValue('');
    } catch (err) {
      notify(err?.message || 'Ошибка сохранения адреса', 'error');
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (targetItem, targetIndex) => {
    try {
      const currentAddresses = Array.isArray(user?.addresses) ? user.addresses : [];
      const updatedAddresses = currentAddresses.filter((item, idx) => {
        if (targetItem?.id !== undefined && item?.id !== undefined) {
          return item.id !== targetItem.id;
        }
        return idx !== targetIndex;
      });
      await updateProfile({
        addresses: updatedAddresses,
      });
      notify('Адрес удалён', 'success');
      if (editingIndex === targetIndex) {
        handleCancelEdit();
      }
    } catch (err) {
      notify(err?.message || 'Ошибка удаления адреса', 'error');
    }
  };

  const balance = useMemo(() => {
    if (!user) return 0;
    try {
      const raw = localStorage.getItem('syrnaya-palitra:orders:v1');
      let orders = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(orders)) {
        orders = orders && typeof orders === 'object' ? [orders] : [];
      }
      const hasDemoOrder = orders.some(
        (o) => (o && o.userId !== undefined && String(o.userId) === '1') ||
               (o && o.userEmail && String(o.userEmail).toLowerCase() === 'demo@cheesecraft.ru')
      );
      if (!hasDemoOrder) {
        const demoOrder = {
          id: 1789750000000,
          userId: 1,
          userEmail: 'demo@cheesecraft.ru',
          total: 300,
          pointsSpent: 0,
          date: '2026-09-18T12:00:00.000Z',
          items: [],
        };
        orders = [demoOrder, ...orders];
        localStorage.setItem('syrnaya-palitra:orders:v1', JSON.stringify(orders));
      }
      const userOrders = orders.filter(
        (o) => (o && o.userId !== undefined && String(o.userId) === String(user.id)) ||
               (o && o.userEmail && user.email && String(o.userEmail).toLowerCase() === String(user.email).toLowerCase())
      );
      const earned = userOrders.reduce((s, o) => s + Number(o.total ?? o.totalPrice ?? o.finalTotal ?? 0), 0);
      const spent = userOrders.reduce((s, o) => s + Number(o.pointsSpent ?? 0), 0);
      return Math.max(0, Math.round(earned - spent));
    } catch {
      return 0;
    }
  }, [user]);

  const userAddresses = Array.isArray(user?.addresses) ? user.addresses : [];

  const userOrders = useMemo(() => {
    if (!user) return [];
    try {
      const raw = localStorage.getItem('syrnaya-palitra:orders:v1');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === 'object'
        ? [parsed]
        : [];
      return list
        .filter((o) => {
          if (!o) return false;
          if (o.userId !== undefined) {
            return o.userId === user.id || String(o.userId) === String(user.id);
          }
          if (user.email && o.userEmail) {
            return String(o.userEmail).toLowerCase() === String(user.email).toLowerCase();
          }
          return false;
        })
        .sort((a, b) => {
          const timeA = new Date(a.date || a.createdAt || a.id).getTime() || 0;
          const timeB = new Date(b.date || b.createdAt || b.id).getTime() || 0;
          return timeB - timeA;
        });
    } catch {
      return [];
    }
  }, [user, tab]);

  const handleRepeatOrder = (order) => {
    if (!order?.items || !Array.isArray(order.items)) return;

    order.items.forEach((item) => {
      const p = productsMap.get(String(item.id));
      const stock = item.stock !== undefined
        ? Number(item.stock)
        : (p?.stock !== undefined
            ? Number(p.stock)
            : (p?.inStock === false ? 0 : Infinity));

      const qty = Math.max(0, Number(item.qty) || 1);
      for (let i = 0; i < qty; i++) {
        add(item.id, item.pack, stock);
      }
    });

    notify('Заказ добавлен в корзину', 'success');
    navigate('/cart');
  };

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
                  tab !== 'orders' && tab !== 'security'
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
            <div className="flex-1 w-full max-w-[860px]">
              <h2 className="text-[22px] font-bold text-neutral-900-alt mb-6 font-montserrat">
                Ваши заказы
              </h2>

              {userOrders.length === 0 ? (
                <div className="bg-white border border-neutral-200 rounded-2xl p-8 sm:p-12 text-center">
                  <p className="text-[16px] sm:text-[18px] text-neutral-500 mb-6">
                    У вас пока нет заказов
                  </p>
                  <Link
                    to="/catalog"
                    className="inline-flex items-center justify-center bg-brand-800 hover:bg-brand-700 text-white font-medium text-[15px] px-8 py-3.5 rounded-lg transition-colors no-underline cursor-pointer"
                  >
                    В каталог
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order) => {
                    const rawDate = order.date || order.createdAt || order.id;
                    const dateFormatted = formatOrderDate(rawDate);
                    const orderNum = formatOrderNumber(order.id);
                    const status = getOrderStatus(order);
                    const totalFormatted = formatOrderTotal(order);

                    return (
                      <div
                        key={order.id}
                        className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="sm:w-1/3">
                          <div className="font-bold text-[16px] text-neutral-900-alt">
                            Заказ № {orderNum}
                          </div>
                          <div className="text-[14px] text-neutral-400 mt-1">
                            {dateFormatted}
                          </div>
                        </div>

                        <div className="text-[14px] text-neutral-400 font-medium sm:text-center sm:w-1/3">
                          {status}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 sm:w-1/3">
                          <span className="font-bold text-[17px] sm:text-[18px] text-neutral-900-alt whitespace-nowrap">
                            {totalFormatted}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRepeatOrder(order)}
                            className="bg-brand-800 hover:bg-brand-700 text-white text-[14px] sm:text-[15px] font-medium px-6 py-2.5 sm:px-7 sm:py-3 rounded-lg transition-colors cursor-pointer border-none"
                          >
                            Повторить
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : tab === 'security' ? (
            <div className="flex-1 w-full max-w-[480px]">
              <h2 className="text-[22px] font-bold text-neutral-900-alt mb-2 font-montserrat">
                Смена пароля
              </h2>
              <div className="mb-6">
                <Link
                  to="/profile"
                  className="text-[14px] text-neutral-500 hover:text-neutral-900 transition-colors inline-flex items-center gap-1.5 font-normal no-underline"
                >
                  <span>←</span>
                  <span>Назад к профилю</span>
                </Link>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] text-neutral-500 mb-1">
                    Текущий пароль
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setCurrentPasswordError('');
                    }}
                    className={`w-full h-[46px] px-4 rounded-lg border bg-white focus:outline-none focus:border-brand-900 text-neutral-900-alt text-[14px] transition-colors ${
                      currentPasswordError ? 'border-danger-700' : 'border-neutral-300'
                    }`}
                  />
                  {currentPasswordError && (
                    <p className="text-danger-700 text-[13px] mt-1.5 font-montserrat" data-error="WRONG_CURRENT">
                      {currentPasswordError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] text-neutral-500 mb-1">
                    Новый (≥6)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setNewPasswordError('');
                    }}
                    className={`w-full h-[46px] px-4 rounded-lg border bg-white focus:outline-none focus:border-brand-900 text-neutral-900-alt text-[14px] transition-colors ${
                      newPasswordError ? 'border-danger-700' : 'border-neutral-300'
                    }`}
                  />
                  {newPasswordError && (
                    <p className="text-danger-700 text-[13px] mt-1.5 font-montserrat">
                      {newPasswordError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] text-neutral-500 mb-1">
                    Повторите новый
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordError('');
                    }}
                    className={`w-full h-[46px] px-4 rounded-lg border bg-white focus:outline-none focus:border-brand-900 text-neutral-900-alt text-[14px] transition-colors ${
                      confirmPasswordError ? 'border-danger-700' : 'border-neutral-300'
                    }`}
                  />
                  {confirmPasswordError && (
                    <p className="text-danger-700 text-[13px] mt-1.5 font-montserrat">
                      {confirmPasswordError}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="bg-brand-900 text-white hover:bg-brand-700 transition-colors font-medium text-[15px] px-6 py-3 rounded-lg disabled:opacity-60 cursor-pointer"
                  >
                    {passwordSaving ? 'Сохранение...' : 'Сохранить пароль'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setCurrentPasswordError('');
                      setNewPasswordError('');
                      setConfirmPasswordError('');
                      navigate('/profile');
                    }}
                    className="text-neutral-500 hover:text-neutral-800 text-[14px] transition-colors cursor-pointer bg-transparent border-none p-0"
                  >
                    Отмена
                  </button>
                </div>
              </form>
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

                  <div className="pt-1">
                    <Link
                      to="/profile?tab=security"
                      className="text-[14px] text-neutral-700 hover:text-neutral-900 transition-colors inline-flex items-center gap-1.5 font-normal no-underline"
                    >
                      <span>&rarr;</span>
                      <span>Изменить пароль</span>
                    </Link>
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

                {/* Блок Мои адреса */}
                <div className="mt-10 sm:mt-12">
                  <h2 className="text-[22px] font-bold text-neutral-900-alt mb-6 font-montserrat">
                    Мои адреса
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userAddresses.map((item, idx) => {
                      const label = typeof item === 'string' ? item : item.label || item.title || 'Дом';
                      const addr = typeof item === 'string' ? item : item.address || item.text || '';
                      
                      if (editingIndex === idx) {
                        return (
                          <form
                            key={item?.id ?? idx}
                            onSubmit={handleSaveEdit}
                            className="border border-neutral-300 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between w-full min-h-[105px] bg-white shadow-sm gap-2"
                          >
                            <input
                              type="text"
                              placeholder="Офис"
                              value={addressLabel}
                              onChange={(e) => setAddressLabel(e.target.value)}
                              className="w-full h-7 px-2.5 text-[13px] border border-neutral-300 rounded-lg focus:outline-none focus:border-brand-900 text-neutral-900-alt"
                              autoFocus
                            />
                            <input
                              type="text"
                              placeholder="г. Томск, ул. Сырная, д. 7, кв. 7"
                              value={addressValue}
                              onChange={(e) => setAddressValue(e.target.value)}
                              className="w-full h-7 px-2.5 text-[13px] border border-neutral-300 rounded-lg focus:outline-none focus:border-brand-900 text-neutral-900-alt"
                            />
                            <div className="flex items-center gap-2 pt-0.5">
                              <button
                                type="submit"
                                disabled={addressSaving}
                                className="px-3 py-1 bg-brand-900 hover:bg-brand-700 text-white rounded-md text-[12px] font-medium transition-colors cursor-pointer disabled:opacity-60"
                              >
                                {addressSaving ? '...' : 'Сохранить'}
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-2 py-1 text-neutral-500 hover:text-neutral-800 text-[12px] transition-colors cursor-pointer bg-transparent border-none"
                              >
                                Отмена
                              </button>
                            </div>
                          </form>
                        );
                      }

                      return (
                        <div
                          key={item?.id ?? idx}
                          className="relative rounded-2xl overflow-hidden p-4 sm:p-5 text-white flex flex-col justify-between w-full h-[105px] shadow-sm"
                          style={{
                            backgroundColor: '#26211E',
                            backgroundImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.75)), url('/images/address.jpg'), linear-gradient(135deg, #3A2E2B 0%, #1E1B18 100%)",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-[16px] font-bold text-white leading-tight">
                              {label}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                title="Редактировать"
                                aria-label="Редактировать"
                                onClick={() => handleStartEdit(item, idx)}
                                className="text-surface-white/70 hover:text-surface-white transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
                              >
                                <svg className="w-4 h-4 text-surface-white/70 hover:text-surface-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                title="Удалить"
                                aria-label="Удалить"
                                onClick={() => handleDeleteAddress(item, idx)}
                                className="text-surface-white/70 hover:text-surface-white transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
                              >
                                <svg className="w-4 h-4 text-surface-white/70 hover:text-surface-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="text-[12px] text-white/90 leading-tight">
                            {addr}
                          </div>
                        </div>
                      );
                    })}

                    {editingIndex === null && (
                      showAddAddress ? (
                        <form
                          onSubmit={handleAddAddress}
                          className="border border-neutral-300 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between w-full min-h-[105px] bg-white shadow-sm gap-2"
                        >
                          <input
                            type="text"
                            placeholder="Офис"
                            value={addressLabel}
                            onChange={(e) => setAddressLabel(e.target.value)}
                            className="w-full h-7 px-2.5 text-[13px] border border-neutral-300 rounded-lg focus:outline-none focus:border-brand-900 text-neutral-900-alt"
                            autoFocus
                          />
                          <input
                            type="text"
                            placeholder="г. Томск, ул. Сырная, д. 7, кв. 7"
                            value={addressValue}
                            onChange={(e) => setAddressValue(e.target.value)}
                            className="w-full h-7 px-2.5 text-[13px] border border-neutral-300 rounded-lg focus:outline-none focus:border-brand-900 text-neutral-900-alt"
                          />
                          <div className="flex items-center gap-2 pt-0.5">
                            <button
                              type="submit"
                              disabled={addressSaving}
                              className="px-3 py-1 bg-brand-900 hover:bg-brand-700 text-white rounded-md text-[12px] font-medium transition-colors cursor-pointer disabled:opacity-60"
                            >
                              {addressSaving ? '...' : 'Добавить'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddAddress(false);
                                setAddressLabel('');
                                setAddressValue('');
                              }}
                              className="px-2 py-1 text-neutral-500 hover:text-neutral-800 text-[12px] transition-colors cursor-pointer bg-transparent border-none"
                            >
                              Отмена
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddAddress(true);
                            setEditingIndex(null);
                            setEditingId(null);
                            setAddressLabel('');
                            setAddressValue('');
                          }}
                          className="border border-neutral-300 hover:border-neutral-400 transition-colors rounded-2xl p-4 sm:p-5 flex flex-col justify-between w-full h-[105px] text-left bg-white cursor-pointer group"
                        >
                          <span className="text-[20px] font-bold text-neutral-900-alt leading-none">+</span>
                          <span className="text-[14px] font-semibold text-neutral-900-alt">Добавить адрес</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
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

