import React from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link для навигации
import ProductCard from '../components/ProductCard';
import { products } from '../data/catalog';
import './Home.css';

export default function Home() {
  // Связываем отображаемое имя категории со слагами для URL-параметров каталога
  const sections = [
    { id: 'lactose-free', title: "Без лактозы" },
    { id: 'wine', title: "К красному сухому вину" },
    { id: 'breakfast', title: "Легкий завтрак" },
    { id: 'vegan', title: "100% Vegan" }
  ];

  return (
    <div className="home-page">
      <div className="home-container">
        
        {/* Хлебная крошка */}
        <div className="breadcrumb">Главная</div>

        {/* БАННЕР: ведет прямо на новую подборку «Изысканное» */}
        <Link to="/catalog?filter=exquisite" className="home-banner-link">
          <div className="banner"></div>
        </Link>

        {/* Генерация рядов с товарами */}
        {sections.map((section, index) => {
          const isLastRow = index === sections.length - 1;
          
          // Фильтруем товары строго по категории
          const categoryProducts = products.filter(product => product.category === section.title); 

          return (
            <div key={index} className="product-section">
              {/* ЗАГОЛОВОК-ССЫЛКА: ведет на каталог с фильтром конкретной подборки */}
              <Link to={`/catalog?filter=${section.id}`} className="home-section-link">
                <h2 className="section-title">{section.title} →</h2>
              </Link>
              
              <div className={`product-row ${isLastRow ? 'last-row' : ''}`}>
                {categoryProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}

        {/* GHOST-BUTTON: ведет на полный, неотфильтрованный каталог */}
        <div className="ghost-btn-wrapper">
          <Link to="/catalog" className="home-ghost-link">
            <button className="ghost-btn">
              Перейти в каталог →
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}