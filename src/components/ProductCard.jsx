import React from 'react';
import { Link } from 'react-router-dom'; // ЭТО ДОЛЖНО БЫТЬ ТУТ!
import './ProductCard.css';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { add } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    add(product.id, 100);
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

        <button type="button" className="product-card__btn" onClick={handleAddToCart}>
          В корзину
        </button>
      </div>
    </Link>
  );
}