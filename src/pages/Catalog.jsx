import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/catalog';
import './Catalog.css';

// Связываем разделы сайдбара с реальными ключами объектов в нашей БД
const filterSections = [
  { id: "milk", title: "Тип молока", options: ["Коровье", "Козье", "Овечье", "Растительное", "Соевое", "Миндальное", "Кокосовое"] },
  { id: "additives", title: "Добавки", options: ["Без добавок", "Трюфель", "Орехи", "Плесень"] },
  { id: "age", title: "Выдержка", options: ["Молодой (> 1 мес.)", "Средний (1-6 мес.)", "Выдержанный (> 6 мес)"] },
  { id: "features", title: "Особенности", options: ["Без лактозы", "Для запекания", "Низкокалорийный", "Веганский"] },
  { id: "wine", title: "Совместимость с вином", options: ["Красное", "Розовое", "Белое", "Игристое"] }
];

const sortOptions = ["По популярности", "Рекомендованные", "Сначала дешевле", "Сначала дороже", "Новинки"];

const categoryMap = {
  'lactose-free': 'Без лактозы',
  'wine': 'К красному сухому вину',
  'breakfast': 'Легкий завтрак',
  'exquisite': 'Изысканное',
  'vegan': '100% Vegan'
};

// Нормализация строки для сравнений: обрезаем пробелы и приводим к нижнему регистру
const norm = (value) => String(value == null ? '' : value).trim().toLowerCase();

// Текстовые поля товара, по которым идёт подстрочный поиск
const searchableFields = (product) => [
  product.name,
  product.description?.text1,
  product.description?.text2,
  product.description?.pairing1,
  product.description?.pairing2,
  product.ingredients,
  product.category
];

// Пресеты «Часто ищут»: ключ — label из панели поиска, значение — свой предикат
const searchPresets = {
  'Пармезан': (product) => norm(product.name).includes('пармезан'),
  'Твердые сорта': (product) => norm(product.age).startsWith('выдержанный'),
  'Сырная тарелка': (product) =>
    norm(product.category) === norm('Изысканное') ||
    [product.description?.text1, product.description?.text2, product.description?.pairing1, product.description?.pairing2]
      .some((field) => norm(field).includes('тарелк')),
  'К красному сухому': (product) => norm(product.category) === norm('К красному сухому вину')
};

export default function Catalog() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get('filter');
  const searchParam = queryParams.get('search');
  const currentCategory = categoryMap[filterParam];
  const searchTerm = (searchParam || '').trim();

  // --- СОСТОЯНИЯ ФИЛЬТРОВ ---
  const [inStockOnly, setInStockOnly] = useState(false);
  const [price, setPrice] = useState([0, 5000]);
  const [taste, setTaste] = useState([1, 5]);
  
  // Состояние для чекбоксов (хранит массивы выбранных строк для каждого ключа)
  const [selectedFilters, setSelectedFilters] = useState({
    milk: [],
    additives: [],
    age: [],
    features: [],
    wine: []
  });

  // Состояния для выпадашки и пагинации
  const [visibleCount, setVisibleCount] = useState(9);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

  // Сбрасываем кнопку "Показать еще" и фильтры при переходе между подборками и новом поиске
  useEffect(() => {
    setVisibleCount(9);
  }, [filterParam, searchParam]);

  // Функция переключения чекбоксов
  const handleCheckboxChange = (key, option) => {
    setSelectedFilters(prev => {
      const currentValues = prev[key];
      const updatedValues = currentValues.includes(option)
        ? currentValues.filter(val => val !== option) // убираем галочку
        : [...currentValues, option];                // ставим галочку
      return { ...prev, [key]: updatedValues };
    });
    setVisibleCount(9); // Сбрасываем пагинацию при изменении фильтров
  };

  // --- СИСТЕМА ФИЛЬТРАЦИИ ---
  const filteredProducts = products.filter(product => {
    // 1. Глобальная подборка (из Шапки/Баннера)
    if (currentCategory && norm(product.category) !== norm(currentCategory)) return false;

    // 2. Поиск по запросу: пресет «Часто ищут» либо подстрочный поиск по текстовым полям
    if (searchTerm) {
      const preset = searchPresets[searchTerm];
      if (preset) {
        if (!preset(product)) return false;
      } else {
        const needle = norm(searchTerm);
        if (!searchableFields(product).some(field => norm(field).includes(needle))) return false;
      }
    }

    // 3. Тумблер "В наличии"
    if (inStockOnly && !product.inStock) return false;

    // 4. Ползунок Цены
    if (product.price < price[0] || product.price > price[1]) return false;

    // 5. Ползунок Интенсивности вкуса
    if (product.taste < taste[0] || product.taste > taste[1]) return false;

    // 6. Боковые Чекбоксы (Динамический перебор групп)
    for (const key in selectedFilters) {
      const activeOptions = selectedFilters[key];
      if (activeOptions.length > 0) {
        // Если значение сыра не совпадает ни с одной выбранной галочкой в группе — отсекаем
        if (!activeOptions.includes(product[key])) return false;
      }
    }

    return true;
  });

  // --- СИСТЕМА СОРТИРОВКИ ---
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === "По популярности") return (b.taste ?? 0) - (a.taste ?? 0) || a.id - b.id;
    if (selectedSort === "Сначала дешевле") return a.price - b.price;
    if (selectedSort === "Сначала дороже") return b.price - a.price;
    if (selectedSort === "Новинки") return b.id - a.id; // Сортируем по ID в обратном порядке
    return 0; // "Рекомендованные" оставляем исходный порядок БД
  });

  // Срез для пагинации кнопки "Показать еще"
  const displayProducts = sortedProducts.slice(0, visibleCount);

  // Активен ли поисковый запрос или глобальная подборка (для счётчика и пустого состояния)
  const hasActiveQuery = Boolean(searchTerm || currentCategory);

  // Сброс: очищаем URL-параметры и локальные фильтры, возвращаем пагинацию к началу
  const resetFilters = () => {
    setSelectedFilters({ milk: [], additives: [], age: [], features: [], wine: [] });
    setInStockOnly(false);
    setPrice([0, 5000]);
    setTaste([1, 5]);
    setVisibleCount(9);
    navigate('/catalog');
  };

  const pageTitle = currentCategory ? currentCategory : 'Каталог сыров';

  return (
    <div className="catalog-page">
      <div className="catalog-container">
        
        <div className="catalog-header">
          <div className="catalog-breadcrumb">
            <Link to="/">Главная</Link> / <span>{pageTitle}</span>
          </div>
          
          <h1 className="catalog-title">{pageTitle}</h1>
          
          {/* СОРТИРОВКА (Dropdown) */}
          <div className="catalog-sort-wrapper">
            <div className={`custom-dropdown ${isSortOpen ? 'open' : ''}`} onClick={() => setIsSortOpen(!isSortOpen)}>
              <span>{selectedSort}</span>
              <span className="dropdown-arrow">v</span>
            </div>
            {isSortOpen && (
              <ul className="dropdown-menu">
                {sortOptions.map(option => (
                  <li 
                    key={option} 
                    onClick={() => { setSelectedSort(option); setIsSortOpen(false); }}
                    className={selectedSort === option ? 'active' : ''}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="catalog-content">
          
          {/* САЙДБАР С ФИЛЬТРАМИ */}
          <aside className="catalog-sidebar">
            
            {/* Тумблер */}
            <div className="filter-group filter-group--inline toggle-box">
              <span className="filter-title">В наличии</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={inStockOnly} 
                  onChange={(e) => { setInStockOnly(e.target.checked); setVisibleCount(9); }} 
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {/* Двойной ползунок Цены */}
            <div className="filter-group slider-box">
              <span className="filter-title">Цена, ₽</span>
              <div className="dual-slider">
                <input type="range" min="0" max="5000" value={price[0]} onChange={e => { setPrice([parseInt(e.target.value), price[1]]); setVisibleCount(9); }} />
                <input type="range" min="0" max="5000" value={price[1]} onChange={e => { setPrice([price[0], parseInt(e.target.value)]); setVisibleCount(9); }} />
                <div className="slider-track" style={{ left: `${(price[0]/5000)*100}%`, right: `${100 - (price[1]/5000)*100}%` }}></div>
              </div>
              <div className="range-labels">
                <span>{price[0]}</span>
                <span>{price[1]}</span>
              </div>
            </div>

            {/* Двойной ползунок Интенсивности вкуса */}
            <div className="filter-group slider-box">
              <span className="filter-title">Интенсивность вкуса</span>
              <div className="dual-slider">
                <input type="range" min="1" max="5" value={taste[0]} onChange={e => { setTaste([parseInt(e.target.value), taste[1]]); setVisibleCount(9); }} />
                <input type="range" min="1" max="5" value={taste[1]} onChange={e => { setTaste([taste[0], parseInt(e.target.value)]); setVisibleCount(9); }} />
                <div className="slider-track" style={{ left: `${((taste[0]-1)/4)*100}%`, right: `${100 - ((taste[1]-1)/4)*100}%` }}></div>
              </div>
              <div className="range-labels">
                <span>{taste[0]}</span>
                <span>{taste[1]}</span>
              </div>
            </div>

            {/* Рендеринг групп чекбоксов */}
            {filterSections.map((section) => (
              <div key={section.id} className="filter-group checkbox-box">
                <span className="filter-title">{section.title}</span>
                <div className="checkbox-list">
                  {section.options.map((option, i) => (
                    <label key={i} className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedFilters[section.id].includes(option)}
                        onChange={() => handleCheckboxChange(section.id, option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          {/* СЕТКА ТОВАРОВ С ПАГИНАЦИЕЙ */}
          <div className="catalog-grid-wrapper">
            {hasActiveQuery && (
              <div className="catalog-counter">
                <span>Найдено: {sortedProducts.length}</span>
                <button type="button" className="catalog-counter__reset" onClick={resetFilters}>
                  сбросить
                </button>
              </div>
            )}
            {sortedProducts.length > 0 ? (
              <>
                <div className="catalog-grid">
                  {displayProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {visibleCount < sortedProducts.length && (
                  <button className="catalog-show-more" onClick={() => setVisibleCount(prev => prev + 9)}>
                    Показать еще
                  </button>
                )}
              </>
            ) : (
              <div className="catalog-empty">
                <p className="catalog-empty__text">По вашему запросу ничего не найдено</p>
                <button type="button" className="catalog-empty__reset" onClick={resetFilters}>
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}