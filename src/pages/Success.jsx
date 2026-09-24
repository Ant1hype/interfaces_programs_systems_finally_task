import React, { useState, useMemo } from 'react';
import { useSearchParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function formatOrderNumber(id) {
  const digits = String(id ?? '').replace(/\D/g, '');
  const last6 = (digits || '000000').slice(-6).padStart(6, '0');
  return `${last6.slice(0, 4)}-${last6.slice(4)}`;
}

function formatDeliveryDate(val) {
  if (!val) return '';
  if (typeof val === 'string') {
    const match = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const year = parseInt(match[1], 10);
      const monthIndex = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      const d = new Date(year, monthIndex, day);
      return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }
  }
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

export default function Success() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [imgFailed, setImgFailed] = useState(false);
  const { user } = useAuth();

  const order = useMemo(() => {
    if (!id) return null;
    try {
      const raw = localStorage.getItem('syrnaya-palitra:orders:v1');
      if (!raw) return null;
      const orders = JSON.parse(raw);
      if (!Array.isArray(orders)) return null;
      return orders.find((o) => String(o.id) === String(id)) || null;
    } catch {
      return null;
    }
  }, [id]);

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const orderNumber = formatOrderNumber(order.id);
  const email = order.email || order.userEmail || user?.email || '';

  const formattedDate = formatDeliveryDate(order.deliveryDate);
  let secondLine = null;
  if (order.deliveryDate && formattedDate) {
    const isPickup =
      typeof order.delivery === 'string' &&
      order.delivery.toLowerCase().includes('самовывоз');
    if (isPickup) {
      secondLine = `Заказ будет готов к выдаче в нашей лавке ${formattedDate}.`;
    } else {
      secondLine = `Курьер свяжется с вами ${formattedDate} за час до доставки.`;
    }
  }

  const historyLink = user
    ? '/profile?tab=orders'
    : '/auth?next=/profile?tab=orders';

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 text-center">
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-6 sm:mb-8 flex items-center justify-center">
        {imgFailed ? (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#4F3422] to-[#25150C]" />
        ) : (
          <img
            src="/images/success.jpg"
            alt="Заказ оформлен"
            className="w-full h-full object-cover"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-[38px] font-bold text-neutral-900 tracking-tight leading-tight mb-2.5">
        Заказ успешно оформлен!
      </h1>

      <p className="text-base sm:text-[17px] font-semibold text-neutral-800 mb-6">
        Ваш заказ № {orderNumber}
      </p>

      <div className="text-[14px] sm:text-[15px] text-neutral-500 leading-relaxed mb-8 sm:mb-9 max-w-lg">
        <div>Мы отправили чек и детали заказа на {email}.</div>
        {secondLine && <div>{secondLine}</div>}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xs sm:max-w-none">
        <Link
          to="/catalog"
          className="w-full sm:w-[210px] h-[50px] rounded-lg bg-brand-900 hover:bg-brand-700 text-white font-medium text-[15px] sm:text-[16px] inline-flex items-center justify-center transition-colors no-underline cursor-pointer"
        >
          Вернуться в каталог
        </Link>
        <Link
          to={historyLink}
          className="w-full sm:w-[210px] h-[50px] rounded-lg bg-white border border-neutral-700 hover:bg-neutral-50 text-neutral-900 font-medium text-[15px] sm:text-[16px] inline-flex items-center justify-center transition-colors no-underline cursor-pointer"
        >
          История заказов
        </Link>
      </div>
    </div>
  );
}

