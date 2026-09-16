import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/catalog';
import './Product.css';

export default function Product() {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  
  const [activeTab, setActiveTab] = useState('desc');
  const [selectedWeight, setSelectedWeight] = useState(100);

  if (!product) return <div>Сыр не найден</div>;

  // Рассчитываем цену исходя из выбранного веса (100г - база)
  const currentPrice = (product.price * (selectedWeight / 100));

  return (
    <div className="product-page">
      <div className="product-container">
        {/* Хлебные крошки */}
        <div className="breadcrumb">Главная / Каталог / {product.name}</div>

        <div className="product-main">
          {/* ГАЛЕРЕЯ */}
          <div className="product-gallery">
            <img src={product.image} alt={product.name} className="main-img" />
            <div className="thumbnails">
              {product.images?.map((img, i) => <img key={i} src={img} alt="thumb" />)}
            </div>
          </div>

          {/* ИНФО-БЛОК */}
          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="price">{currentPrice} ₽ / {selectedWeight} г</p>
            
            {/* Визуальная шкала вкуса */}
            <div className="taste-scale">
              <span>Интенсивность вкуса</span>
              <div className="dots">
                {[1, 2, 3, 4, 5].map(d => (
                  <div key={d} className={`dot ${d <= product.taste ? 'active' : ''}`} />
                ))}
              </div>
            </div>

            <div className="specs">
              <p>Тип молока: <b>{product.milk}</b></p>
              <p>Выдержка: <b>{product.age}</b></p>
              <p>Добавки: <b>{product.additives}</b></p>
            </div>

            <div className="weight-selector">
              {[100, 200, 300].map(w => (
                <button 
                  key={w} 
                  className={selectedWeight === w ? 'active' : ''}
                  onClick={() => setSelectedWeight(w)}
                >
                  {w} г
                </button>
              ))}
            </div>

            <button className="add-to-cart">В корзину</button>
            <p className="delivery-info">Ближайшая доставка: завтра, 7 мая</p>
          </div>
        </div>

        {/* ТАБЫ */}
        <div className="product-tabs">
          <div className="tab-headers">
            <button onClick={() => setActiveTab('desc')}>О продукте</button>
            <button onClick={() => setActiveTab('info')}>Состав и ценность</button>
            <button onClick={() => setActiveTab('reviews')}>Отзывы ({product.reviews?.length || 0})</button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'desc' && (
              <div className="desc-grid">
                <p>{product.description.text1}</p>
                <p>{product.description.text2}</p>
              </div>
            )}
            {activeTab === 'info' && (
              <div className="nutrition-grid">
                <p>{product.ingredients}</p>
                <div className="kbfu">
                  {Object.entries(product.nutrition).map(([k, v]) => (
                    <div key={k}><b>{v}</b><br/>{k}</div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="reviews-list">
                {product.reviews?.map(r => (
                  <div key={r.id} className="review-item">
                    <h4>{r.author}</h4>
                    <p>{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}