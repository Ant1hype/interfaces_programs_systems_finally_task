import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom'; // ЭТО ДОЛЖНО БЫТЬ ТУТ!
import './ProductCard.css';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProductCard({ product }) {
  const { add, inc, dec, remove, items = [], qtyForId } = useCart() || {};
  let toastContext;
  try {
    toastContext = useToast();
  } catch {
    toastContext = null;
  }
  const push = toastContext?.push || (() => {});

  const { user, isFavorite, toggleFavorite } = useAuth() || {};
  const isFav = isFavorite ? isFavorite(product.id) : false;

  const [btnText, setBtnText] = useState(null);
  const timerRef = useRef(null);

  const handleFavClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      push('Войдите, чтобы сохранять избранное', 'error');
      return;
    }

    if (toggleFavorite) {
      toggleFavorite(product.id);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const stock = Number(product.stock ?? (product.inStock === false ? 0 : 5));
  const isOutOfStock = stock <= 0 || product.inStock === false;
  const qty = qtyForId ? qtyForId(product.id) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (timerRef.current) clearTimeout(timerRef.current);

    if (qty >= stock || isOutOfStock) {
      setBtnText(stock <= 0 || product.inStock === false ? 'Нет в наличии' : `Максимум ${stock} шт`);
      push(stock <= 0 || product.inStock === false ? 'Нет в наличии' : `Максимум ${stock} шт в наличии`);
      timerRef.current = setTimeout(() => {
        setBtnText(null);
      }, 1200);
      return;
    }

    add(product.id, 100, stock);
    setBtnText('✓ Добавлено');
    timerRef.current = setTimeout(() => {
      setBtnText(null);
    }, 1200);
  };

  const handleInc = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (qty >= stock || isOutOfStock) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setBtnText(stock <= 0 || product.inStock === false ? 'Нет в наличии' : `Максимум ${stock} шт`);
      push(stock <= 0 || product.inStock === false ? 'Нет в наличии' : `Максимум ${stock} шт в наличии`);
      timerRef.current = setTimeout(() => {
        setBtnText(null);
      }, 1200);
      return;
    }

    const matching = (items || []).filter((it) => String(it.id) === String(product.id));
    const target = [...matching].sort((a, b) => (Number(b.pack) || 0) - (Number(a.pack) || 0))[0];

    if (target) {
      inc(target.id, target.pack, stock);
    } else {
      add(product.id, 100, stock);
    }
  };

  const handleDec = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const matching = (items || []).filter((it) => String(it.id) === String(product.id));
    const target = [...matching].sort((a, b) => (Number(b.pack) || 0) - (Number(a.pack) || 0))[0];

    if (!target) return;

    if (target.qty === 1) {
      remove(target.id, target.pack);
    } else {
      dec(target.id, target.pack);
    }
  };

  const showLimit = Boolean(btnText && (btnText.startsWith('Максимум') || btnText === 'Нет в наличии'));

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <div className="product-card">
        <div className="product-card__image-wrap">
          <img src={product.image} alt={product.name} className="product-card__img" />
          <button
            type="button"
            className={`product-card__fav ${isFav ? 'product-card__fav--active active text-danger-700' : ''}`}
            onClick={handleFavClick}
            aria-label={isFav ? 'Удалить из избранного' : 'В избранное'}
            style={isFav ? { color: 'var(--danger-700, #A61A1A)' } : undefined}
          >
            <svg
              viewBox="0 0 24 24"
              fill={isFav ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isFav ? '1' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
        
        <div className="product-card__info">
          <h3 className="product-card__title">{product.name}</h3>
          <p className="product-card__weight">Вес: {product.weight}</p>
          <p className="product-card__price">{product.price} ₽</p>
        </div>

        {qty > 0 ? (
          showLimit ? (
            <div
              className="product-card__btn bg-brand-900 text-surface-white flex items-center justify-center text-center font-medium text-[14px] cursor-default select-none"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {btnText}
            </div>
          ) : (
            <div
              className="product-card__btn bg-brand-900 text-surface-white flex items-center justify-between px-4 select-none cursor-default"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <button
                type="button"
                onClick={handleDec}
                className="bg-transparent border-0 p-0 text-surface-white text-[18px] cursor-pointer hover:opacity-75 leading-none flex items-center justify-center w-6 h-6"
                aria-label="Уменьшить"
              >
                −
              </button>
              <span className="font-bold text-[15px] min-w-[20px] text-center select-none">
                {qty}
              </span>
              <button
                type="button"
                onClick={handleInc}
                className="bg-transparent border-0 p-0 text-surface-white text-[18px] cursor-pointer hover:opacity-75 leading-none flex items-center justify-center w-6 h-6"
                aria-label="Увеличить"
              >
                +
              </button>
            </div>
          )
        ) : (
          <button
            type="button"
            className="product-card__btn bg-brand-800 hover:bg-brand-700 transition-colors"
            onClick={handleAddToCart}
          >
            {btnText || 'В корзину'}
          </button>
        )}
      </div>
    </Link>
  );
}
