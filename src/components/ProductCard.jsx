import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom'; // ЭТО ДОЛЖНО БЫТЬ ТУТ!
import './ProductCard.css';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { add, items } = useCart();
  const [btnText, setBtnText] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    const stock = product.stock ?? (product.inStock === false ? 0 : 5);
    const already = (items || [])
      .filter((it) => String(it.id) === String(product.id))
      .reduce((sum, it) => sum + it.qty, 0);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (already >= stock) {
      setBtnText(`Максимум ${stock} шт`);
      timerRef.current = setTimeout(() => {
        setBtnText(null);
      }, 1200);
      return;
    }

    add(product.id, 100);
    setBtnText('✓ Добавлено');
    timerRef.current = setTimeout(() => {
      setBtnText(null);
    }, 1200);
  };

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <div className="product-card">
        <div className="product-card__image-wrap">
          <img src={product.image} alt={product.name} className="product-card__img" />
          <button type="button" className="product-card__fav" aria-label="В избранное">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
        </div>
        
        <div className="product-card__info">
          <h3 className="product-card__title">{product.name}</h3>
          <p className="product-card__weight">Вес: {product.weight}</p>
          <p className="product-card__price">{product.price} ₽</p>
        </div>

        <button type="button" className="product-card__btn bg-brand-800 hover:bg-brand-700 transition-colors" onClick={handleAddToCart}>
          {btnText || 'В корзину'}
        </button>
      </div>
    </Link>
  );
}