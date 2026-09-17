import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/catalog', filter: null, label: 'Каталог' },
  { path: '/catalog', filter: 'lactose-free', label: 'Без лактозы' },
  { path: '/catalog', filter: 'wine', label: 'К красному вину' },
  { path: '/catalog', filter: 'breakfast', label: 'Легкий завтрак' },
  { path: '/catalog', filter: 'exquisite', label: 'Изысканное' },
  { path: '/catalog', filter: 'vegan', label: '100% Vegan' }
];

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentFilter = queryParams.get('filter');
  const activeIndex = navItems.findIndex(item => {
    if (currentFilter) return item.filter === currentFilter;
    if (location.pathname === item.path && !currentFilter) return item.filter === null;
    return false;
  });
  const [lineStyle, setLineStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRefs = useRef([]);
  const moveLine = (index) => {
    const el = navRefs.current[index];
    if (el) setLineStyle({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
  };
  useEffect(() => {
    if (activeIndex !== -1) moveLine(activeIndex);
    else setLineStyle(prev => ({ ...prev, opacity: 0 }));
  }, [activeIndex, location]);
  useEffect(() => {
    const onResize = () => { if (activeIndex !== -1) moveLine(activeIndex); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeIndex]);
  return (
    <header className="w-full bg-surface-white border-b border-[#F0F0F0] font-montserrat relative shadow-shadow-header">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] 2xl:px-[120px] max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-h-[56px] md:h-[70px] py-2 md:py-0 border-b border-[#F0F0F0] relative flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 shrink-0 order-1">
            <Link to="#" className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] font-medium text-neutral-900-alt no-underline transition-colors duration-200 hover:text-brand-900 whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/></svg>
              <span className="hidden sm:inline">Россия</span>
            </Link>
            <a href="tel:+74952551533" className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] font-medium text-neutral-900-alt no-underline transition-colors duration-200 hover:text-brand-900 whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span className="hidden min-[360px]:inline">+7 495 255 15 33</span>
              <span className="inline min-[360px]:hidden">+7 495…</span>
            </a>
            <Link to="#" className="hidden md:flex items-center gap-2 text-[13px] font-medium text-neutral-900-alt no-underline transition-colors duration-200 hover:text-brand-900 whitespace-nowrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Магазины
            </Link>
          </div>
          <Link to="/" className="font-lora text-[18px] sm:text-[20px] lg:text-[24px] font-bold leading-[21px] text-neutral-900-alt no-underline md:absolute md:left-1/2 md:-translate-x-1/2 whitespace-nowrap shrink-0 order-2 md:order-none">
            Сырная палитра
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 shrink-0 order-3">
            <button className="bg-transparent border-0 cursor-pointer text-neutral-900-alt flex items-center justify-center transition-colors duration-200 hover:text-brand-900 p-1" onClick={() => setIsSearchOpen(!isSearchOpen)} title="Поиск" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <Link to="/favorites" className="text-neutral-900-alt flex items-center justify-center transition-colors duration-200 hover:text-brand-900 p-1" title="Избранное">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </Link>
            <Link to="/cart" className="text-neutral-900-alt flex items-center justify-center transition-colors duration-200 hover:text-brand-900 p-1" title="Корзина">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </Link>
            <Link to="/profile" className="text-neutral-900-alt flex items-center justify-center transition-colors duration-200 hover:text-brand-900 p-1" title="Профиль">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          </div>
        </div>
        <nav className="relative flex items-center h-[44px] sm:h-[48px] md:h-[60px] gap-4 sm:gap-6 lg:gap-0 lg:justify-between overflow-x-auto overflow-y-hidden -mx-4 sm:mx-0 px-4 sm:px-0" style={{scrollbarWidth:'none',msOverflowStyle:'none'}} onMouseLeave={() => activeIndex !== -1 ? moveLine(activeIndex) : setLineStyle(prev => ({ ...prev, opacity: 0 }))}>
          {navItems.map((item, index) => (
            <Link key={index} to={item.filter ? `${item.path}?filter=${item.filter}` : item.path} ref={el => navRefs.current[index] = el} onMouseEnter={() => moveLine(index)} className={`shrink-0 whitespace-nowrap text-[11px] min-[360px]:text-[12px] sm:text-[13px] lg:text-[14px] font-semibold no-underline uppercase tracking-[0.3px] lg:tracking-[0.5px] transition-colors duration-200 hover:text-brand-900 ${activeIndex === index ? 'text-brand-900' : 'text-neutral-900-alt'}`}>
              {item.label}
            </Link>
          ))}
          <div className="absolute bottom-2 md:bottom-4 h-0.5 bg-brand-900 pointer-events-none transition-[left,width,opacity] duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hidden sm:block" style={lineStyle}></div>
        </nav>
      </div>
    </header>
  );
}
