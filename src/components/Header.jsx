import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

// Конфиг для навигации, чтобы точечно отслеживать активный элемент по query-параметрам
const navItems = [
  { path: '/catalog', filter: null, label: 'Каталог' },
  { path: '/catalog', filter: 'lactose-free', label: 'Без лактозы' },
  { path: '/catalog', filter: 'wine', label: 'К красному вину' },
  { path: '/catalog', filter: 'breakfast', label: 'Легкий завтрак' },
  { path: '/catalog', filter: 'exquisite', label: 'Изысканное' },
  { path: '/catalog', filter: 'vegan', label: '100% Vegan' }
];

export default function Header() {
  // Задел на будущее: состояние для открытия мега-меню поиска
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Логика бегающей полоски
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentFilter = queryParams.get('filter');

  // Находим текущий активный индекс
  const activeIndex = navItems.findIndex(item => {
    if (currentFilter) return item.filter === currentFilter;
    if (location.pathname === item.path && !currentFilter) return item.filter === null;
    return false;
  });

  const [lineStyle, setLineStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRefs = useRef([]);

  // Функция расчета координат для полоски
  const moveLine = (index) => {
    const el = navRefs.current[index];
    if (el) {
      setLineStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
        opacity: 1
      });
    }
  };

  // Пересчитываем положение при смене страницы или изменении размера окна
  useEffect(() => {
    if (activeIndex !== -1) {
      moveLine(activeIndex);
    } else {
      setLineStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [activeIndex, location]);

  return (
    <header className="header">
      <div className="header__inner">
        
        {/* ВЕРХНЯЯ ЧАСТЬ (Контакты, Лого, Иконки) */}
        <div className="header__top">
          
          {/* Левый блок: Гео, Телефон, Магазины */}
          <div className="header__left">
            <Link to="#" className="header__info-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/></svg>
              Россия
            </Link>
            <a href="tel:+74952551533" className="header__info-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +7 495 255 15 33
            </a>
            <Link to="#" className="header__info-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Магазины
            </Link>
          </div>

          {/* Центр: Логотип */}
          <Link to="/" className="header__logo">Сырная палитра</Link>

          {/* Правый блок: Иконки действий */}
          <div className="header__right">
            <button 
              className="header__icon-btn" 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              title="Поиск"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <Link to="/favorites" className="header__icon-btn" title="Избранное">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </Link>
            <Link to="/cart" className="header__icon-btn" title="Корзина">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </Link>
            <Link to="/profile" className="header__icon-btn" title="Профиль">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          </div>

        </div>

        {/* НИЖНЯЯ ЧАСТЬ (Навигация с эффектом Magic Line) */}
        <nav 
          className="header__nav"
          onMouseLeave={() => activeIndex !== -1 ? moveLine(activeIndex) : setLineStyle(prev => ({ ...prev, opacity: 0 }))}
        >
          {navItems.map((item, index) => (
            <Link 
              key={index}
              to={item.filter ? `${item.path}?filter=${item.filter}` : item.path}
              ref={el => navRefs.current[index] = el}
              onMouseEnter={() => moveLine(index)}
              className={`header__nav-link ${activeIndex === index ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Наша кастомная бегающая полоса */}
          <div className="header__magic-line" style={lineStyle}></div>
        </nav>

      </div>
    </header>
  );
}