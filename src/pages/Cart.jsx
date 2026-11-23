import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart, itemKey } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getProducts } from '../lib/api.js';
import ProductCard from '../components/ProductCard.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';

const PROMO_CODE = 'CHEESE10', PROMO_PERCENT = 10;
const FREE_SHIPPING_THRESHOLD = 3000;
const DEFAULT_SHIPPING_COST = 300;
const fmt = (v) => `${Math.round(v).toLocaleString('ru-RU')} ₽`;

function useProducts() {
  const [p, setP] = useState([]);
  useEffect(() => {
    let c = false;
    getProducts()
      .then(l => !c && setP((l || []).map(x => ({...x, name: (x.name || '').trim(), image: (x.image || '').trim()}))))
      .catch(() => !c && setP([]));
    return () => { c = true; };
  }, []);
  return p;
}

export default function Cart() {
  const { items, totalQty, inc, dec, remove, qtyForId, appliedPromo, applyPromo } = useCart();
  const { push } = useToast();
  const products = useProducts();
  const [pi, setPi] = useState(''), [pe, setPe] = useState('');

  const byId = useMemo(() => { const m = new Map(); products.forEach(x => m.set(String(x.id), x)); return m; }, [products]);
  const rows = useMemo(() => items.map(it => { const p = byId.get(String(it.id)); const bp = Number(p?.price) || 0; const lp = (bp * it.pack) / 100; return { key: itemKey(it.id, it.pack), id: it.id, pack: it.pack, qty: it.qty, name: p?.name || '...', image: p?.image || '', stock: p?.stock, lineTotal: lp * it.qty }; }), [items, byId]);
  const it = useMemo(() => rows.reduce((s, r) => s + r.lineTotal, 0), [rows]);
  const disc = appliedPromo === PROMO_CODE ? Math.round((it * PROMO_PERCENT) / 100) : 0;
  const shippingCost = it >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_COST;
  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - it);
  const shippingProgress = Math.min(100, (it / FREE_SHIPPING_THRESHOLD) * 100);
  const shippingReached = it >= FREE_SHIPPING_THRESHOLD;
  const gt = Math.max(0, it + shippingCost - disc);
  const pair = useMemo(() => { const ic = new Set(items.map(x => String(x.id))); return products.filter(x => x.inStock).filter(x => !ic.has(String(x.id))).sort((a, b) => (Number(b.taste) || 0) - (Number(a.taste) || 0)).slice(0, 4); }, [products, items]);
  const ap = (e) => {
    e.preventDefault();
    const res = applyPromo(pi);
    if (res.success) {
      setPe('');
    } else {
      setPe(res.error || 'Промокод не распознан');
    }
  };

  if (items.length === 0) return (<div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] 2xl:px-[120px] max-w-[1920px] mx-auto pt-[40px] pb-10 font-montserrat"><Breadcrumbs items={[{ to: '/', label: 'Главная' }]} current="Корзина" /><h1 className="font-lora text-[32px] sm:text-[36px] font-bold text-neutral-900-alt mb-10">Корзина</h1><div className="bg-surface-cream border border-neutral-250-a80 rounded-radius-xl py-16 px-6 text-center"><p className="text-[18px] text-neutral-500 mb-6">Ваша корзина пуста</p><Link to="/catalog" className="inline-flex px-8 py-4 rounded-radius-lg bg-brand-900 text-surface-white font-medium no-underline hover:bg-brand-700">В каталог</Link></div></div>);

  return (<div className="cart-readability w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] 2xl:px-[120px] max-w-[1920px] mx-auto pt-[40px] pb-10 font-montserrat"><style>{`
    .cart-readability a[href="/catalog"].inline-block { font-size: 17px; }
    .cart-readability a[href="/catalog"].inline-block:not(:hover) { color: #404040; }
    .cart-readability aside > div:nth-child(-n+2) > span:first-child { font-size: 17px; }
    .cart-readability aside input::placeholder { font-size: 15px; color: #737373; opacity: 1; }
    .cart-readability aside a[href="/checkout"] + p { font-size: 15px; color: #525252; }
  `}</style><Breadcrumbs items={[{ to: '/', label: 'Главная' }]} current="Корзина" /><h1 className="font-lora text-[32px] sm:text-[36px] font-bold text-neutral-900-alt mb-10">Корзина</h1><div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_420px] gap-10 xl:gap-16 items-start"><div>{rows.map(r => {
  const p = byId.get(String(r.id));
  const stock = (r.stock !== undefined ? r.stock : p?.stock) !== undefined ? Number(r.stock !== undefined ? r.stock : p?.stock) : undefined;
  const isMax = stock !== undefined && qtyForId(r.id) >= stock;

  return (
    <div key={r.key} className="flex items-center gap-5 py-6 border-b border-neutral-250">
      <Link
        to={`/product/${r.id}`}
        className="flex items-center gap-5 flex-1 min-w-0 no-underline hover:text-brand-900 text-inherit group"
      >
        <img src={r.image} alt={r.name} className="w-[80px] h-[80px] rounded-radius-md object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-lora text-[20px] font-semibold text-[#171717] group-hover:text-brand-900 hover:text-brand-900 transition-colors mb-2">{r.name}</h3>
          <p className="font-inter text-[17px] text-[#525252]">Фасовка: {r.pack} г</p>
        </div>
      </Link>
      <div className="flex items-center gap-6 shrink-0">
        <div className="flex items-center gap-8 bg-brand-900 rounded-radius-lg px-6 py-3 text-surface-white">
          <button type="button" onClick={() => dec(r.id, r.pack)} disabled={r.qty <= 1} className="bg-transparent border-0 p-0 text-[#ffffff] text-[18px] cursor-pointer disabled:opacity-40">−</button>
          <span className="font-bold text-[18px] min-w-[12px] text-center">{r.qty}</span>
          <button
            type="button"
            onClick={() => {
              if (isMax) {
                push(`Максимум ${stock} шт в наличии`);
                return;
              }
              inc(r.id, r.pack);
            }}
            className={`bg-transparent border-0 p-0 text-[#ffffff] text-[18px] ${
              isMax ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            +
          </button>
        </div>
        <span className="font-inter text-[20px] font-bold text-[#171717] w-[90px] text-right">{fmt(r.lineTotal)}</span>
        <button type="button" onClick={() => remove(r.id, r.pack)} className="bg-transparent border-0 p-0 text-neutral-black cursor-pointer hover:text-danger-700">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
})}<Link to="/catalog" className="inline-block mt-6 text-[14px] text-neutral-700 no-underline hover:text-brand-900">← Продолжить покупки</Link></div><aside className="bg-surface-white border border-neutral-250-a80 rounded-radius-xl p-6 lg:sticky lg:top-24 lg:self-start"><div className="flex items-center justify-between text-[15px] text-neutral-black mb-4"><span>Товары ({totalQty})</span><span className="font-inter font-bold">{fmt(it)}</span></div>{it > 0 && (
  <div className="flex items-center justify-between text-[15px] text-neutral-black mb-4">
    <span>Доставка</span>
    {shippingReached ? (
      <span className="font-inter flex items-center gap-1.5">
        <span className="line-through text-neutral-400">{fmt(DEFAULT_SHIPPING_COST)}</span>
        <span className="font-bold text-brand-900">{fmt(0)}</span>
      </span>
    ) : (
      <span className="font-inter font-bold">{fmt(shippingCost)}</span>
    )}
  </div>
)}{it > 0 && (
  <div className="mb-5">
    <div className="flex items-center justify-between text-[14px] mb-2">
      {shippingReached ? (
        <span className="font-semibold text-brand-900 flex items-center gap-1.5">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Бесплатная доставка достигнута!
        </span>
      ) : (
        <span className="text-neutral-700">
          До бесплатной доставки{' '}
          <span className="font-semibold text-neutral-900">{Math.round(shippingRemaining).toLocaleString('ru-RU')} ₽</span>
        </span>
      )}
      <span className="text-neutral-500 tabular-nums">{Math.round(shippingProgress)}%</span>
    </div>
    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-[width] duration-500 ${shippingReached ? 'bg-brand-700' : 'bg-brand-900'}`} style={{ width: `${shippingProgress}%` }} />
    </div>
  </div>
)}<div className="flex items-center justify-between text-[15px] text-neutral-black mb-5"><span>Скидка</span><span className="font-inter font-bold">-{disc} ₽</span></div><div className="border-t border-neutral-250 pt-5 mb-5 flex items-center justify-between"><span className="text-[24px] font-bold text-neutral-black">Итого</span><span className="text-[24px] font-bold text-neutral-black">{fmt(gt)}</span></div><form onSubmit={ap} className="flex items-center gap-3 mb-4"><input type="text" value={pi} onChange={e => setPi(e.target.value)} placeholder="Введите промокод..." className="flex-1 min-w-0 h-[44px] px-4 bg-surface-white border border-neutral-250-a80 rounded-radius-md text-[14px] text-neutral-black placeholder:text-neutral-400 outline-none focus:border-brand-900" /><button type="submit" className="w-[44px] h-[44px] shrink-0 rounded-radius-md bg-brand-900 text-surface-white cursor-pointer hover:bg-brand-700"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 mx-auto"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></button></form>{pe && <p className="text-[13px] text-danger-700 mb-4">{pe}</p>}{appliedPromo && !pe && <p className="text-[13px] text-brand-700 mb-4">Промокод {appliedPromo} применён</p>}<Link to="/checkout" className="flex items-center justify-center w-full h-[52px] rounded-radius-md bg-brand-900 text-surface-white text-[16px] font-medium no-underline hover:bg-brand-700">Перейти к оформлению</Link><p className="mt-4 text-[11px] leading-4 text-overlay-dark-40">Нажимая на кнопку, вы соглашаетесь с условиями возврата</p></aside></div>{pair.length > 0 && (<section className="mt-16"><h2 className="font-lora text-[26px] font-bold text-neutral-900-alt mb-8">Идеальная пара</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{pair.map(p => (<ProductCard key={p.id} product={p} />))}</div></section>)}</div>);
}
