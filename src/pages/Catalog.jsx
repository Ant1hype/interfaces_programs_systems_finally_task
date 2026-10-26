import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Dropdown from '../components/Dropdown';
import Breadcrumbs from '../components/Breadcrumbs';
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

// Ключи сортировки + человекочитаемые подписи для кастомного Dropdown
const sortOptions = [
  { value: "popular", label: "По популярности" },
  { value: "recommended", label: "Рекомендованные" },
  { value: "cheap", label: "Сначала дешевые" },
  { value: "expensive", label: "Сначала дорогие" },
  { value: "new", label: "Новинки" }
];

// Метрики плитки: минимальная ширина колонки и зазор (совпадают с CSS .catalog-grid)
const GRID_COL_MIN = 250;
const GRID_GAP = 26;

const categoryMap = {
  'lactose-free': 'Без лактозы',
  'wine': 'К красному сухому вину',
  'breakfast': 'Легкий завтрак',
  'exquisite': 'Изысканное',
  'vegan': '100% Vegan'
};

// Нормализация строки для сравнений: нижний регистр, «ё» приводим к «е», любая пунктуация
// (в том числе кавычки-«ёлочки» и скобки) заменяется пробелом, повторные пробелы схлопываются
const norm = (value) =>
  String(value == null ? '' : value)
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');

// Разбиваем нормализованную строку на значимые слова-токены
const tokenize = (value) => norm(value).split(' ').filter(Boolean);

// Поля «ядра» карточки — название и структурированные атрибуты товара.
// Поиск начинается с них и не смотрит в маркетинговые тексты: именно поэтому
// запрос «пармезан» выдавал «Пекорино» (в pairing1 лежит «Оригинальная замена пармезану…»).
const coreSearchFields = (product) => [
  product.name,
  product.category,
  product.milk,
  product.additives,
  product.age,
  product.features,
  product.wine
];

// Запасные поля — описание и состав. Подключаются только когда по ядру ничего не нашлось,
// чтобы не терять выдачу на редких запросах («плесень», «трюфель», названия из текста).
const extendedSearchFields = (product) => [
  ...coreSearchFields(product),
  product.description?.text1,
  product.description?.text2,
  product.description?.pairing1,
  product.description?.pairing2,
  product.ingredients
];

// Совпадение запроса товару: каждый токен запроса должен встретиться хотя бы в одном из полей
const matchesQuery = (product, tokens, fields) => {
  const values = fields(product).map(norm);
  return tokens.every((token) => values.some((field) => field.includes(token)));
};

// Пресеты «Часто ищут»: ключ — нормализованный label из панели поиска, значение — свой предикат.
// Ключи нормализованы намеренно: запрос, набранный руками («пармезан», «  ТВЕРДЫЕ  сорта »,
// «твёрдые сорта»), должен получать тот же сценарий, что и клик по готовой подсказке.
const searchPresets = {
  [norm('Пармезан')]: (product) => norm(product.name).includes('пармезан'),
  [norm('Твердые сорта')]: (product) => norm(product.age).startsWith('выдержанный'),
  [norm('Сырная тарелка')]: (product) =>
    norm(product.category) === norm('Изысканное') ||
    [product.description?.text1, product.description?.text2, product.description?.pairing1, product.description?.pairing2]
      .some((field) => norm(field).includes('тарелк')),
  [norm('К красному сухому')]: (product) => norm(product.category) === norm('К красному сухому вину')
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

  // Состояния для выпадашки и пагинации (пагинация считается целыми рядами)
  const gridWrapperRef = useRef(null);
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0].value);

  // Сбрасываем количество рядов при переходе между подборками и новом поиске
  useEffect(() => {
    setRows(3);
  }, [filterParam, searchParam]);

  // Считаем число колонок плитки по реальной ширине обёртки сетки и пересчитываем при resize окна
  useEffect(() => {
    const measureCols = () => {
      const w = gridWrapperRef.current ? gridWrapperRef.current.clientWidth : 0;
      setCols(Math.max(1, Math.floor((w + GRID_GAP) / (GRID_COL_MIN + GRID_GAP))));
    };
    measureCols();
    window.addEventListener('resize', measureCols);
    return () => window.removeEventListener('resize', measureCols);
  }, []);

  // Функция переключения чекбоксов
  const handleCheckboxChange = (key, option) => {
    setSelectedFilters(prev => {
      const currentValues = prev[key];
      const updatedValues = currentValues.includes(option)
        ? currentValues.filter(val => val !== option) // убираем галочку
        : [...currentValues, option];                // ставим галочку
      return { ...prev, [key]: updatedValues };
    });
    setRows(3); // Сбрасываем пагинацию (ряды) при изменении фильтров
  };

  // --- ПОИСКОВЫЙ КОНТЕКСТ ЗАПРОСА ---
  // Пресет «Часто ищут» подбираем по нормализованному запросу: регистр, лишние пробелы и «ё»
  // больше не ломают подмену готовой подсказки на слепой подстрочный поиск.
  const searchPreset = searchTerm ? searchPresets[norm(searchTerm)] : undefined;

  // Множество id товаров, подходящих под свободный запрос. Двухуровневое совпадение:
  // сначала название и атрибуты товара, и лишь если прямых совпадений нет — описания и состав.
  const searchMatchIds = useMemo(() => {
    if (!searchTerm || searchPreset) return null;
    const tokens = tokenize(searchTerm);
    if (tokens.length === 0) return null;
    const strict = products.filter((product) => matchesQuery(product, tokens, coreSearchFields));
    const pool = strict.length > 0
      ? strict
      : products.filter((product) => matchesQuery(product, tokens, extendedSearchFields));
    return new Set(pool.map((product) => product.id));
  }, [searchTerm, searchPreset]);

  // --- СИСТЕМА ФИЛЬТРАЦИИ ---
  const filteredProducts = products.filter(product => {
    // 1. Глобальная подборка (из Шапки/Баннера)
    if (currentCategory && norm(product.category) !== norm(currentCategory)) return false;

    // 2. Поиск по запросу: пресет «Часто ищут» либо подстрочный поиск по полям товара
    if (searchTerm) {
      if (searchPreset) {
        if (!searchPreset(product)) return false;
      } else if (!searchMatchIds || !searchMatchIds.has(product.id)) {
        return false;
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
    if (selectedSort === "cheap") return a.price - b.price;
    if (selectedSort === "expensive") return b.price - a.price;
    if (selectedSort === "new") return b.id - a.id; // Сортируем по ID в обратном порядке
    if (selectedSort === "popular") return (b.taste ?? 0) - (a.taste ?? 0) || a.id - b.id;
    return 0; // "recommended" оставляем исходный порядок БД
  });

  // Срез для пагинации кнопки "Показать еще": показываем целые ряды (rows × cols карточек)
  const visibleCount = rows * cols;
  const displayProducts = sortedProducts.slice(0, visibleCount);

  // Активен ли поисковый запрос или глобальная подборка (для счётчика и пустого состояния)
  const hasActiveQuery = Boolean(searchTerm || currentCategory);

  // Сброс: очищаем URL-параметры и локальные фильтры, возвращаем пагинацию к началу
  const resetFilters = () => {
    setSelectedFilters({ milk: [], additives: [], age: [], features: [], wine: [] });
    setInStockOnly(false);
    setPrice([0, 5000]);
    setTaste([1, 5]);
    setRows(3);
    navigate('/catalog');
  };

  const pageTitle = currentCategory ? currentCategory : 'Каталог сыров';

  return (
    <div className="catalog-page">
      <div className="catalog-container">
        
        <div className="catalog-header">
          <Breadcrumbs items={[{ to: '/', label: 'Главная' }]} current={pageTitle} />
          
          <h1 className="catalog-title">{pageTitle}</h1>
        </div>

        <div className="catalog-content">
          
          {/* САЙДБАР С ФИЛЬТРАМИ */}
          <aside className="catalog-sidebar">

            {/* СОРТИРОВКА (Dropdown) — переехал из шапки в панель фильтров:
                стоит слева и наследует ширину сайдбара (280px - 2*20px = 240px) */}
            <div className="filter-group" style={{ marginBottom: 32 }}>
              <span className="filter-title">Сортировка</span>
              <Dropdown
                value={selectedSort}
                onChange={setSelectedSort}
                options={sortOptions}
                placeholder="По популярности"
                ariaLabel="Сортировка товаров"
              />
            </div>

            {/* Тумблер */}
            <div className="filter-group filter-group--inline toggle-box">
              <span className="filter-title">В наличии</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={inStockOnly} 
                  onChange={(e) => { setInStockOnly(e.target.checked); setRows(3); }} 
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {/* Двойной ползунок Цены */}
            <div className="filter-group slider-box">
              <span className="filter-title">Цена, ₽</span>
              <div className="dual-slider">
                <input type="range" min="0" max="5000" value={price[0]} onChange={e => { setPrice([parseInt(e.target.value), price[1]]); setRows(3); }} />
                <input type="range" min="0" max="5000" value={price[1]} onChange={e => { setPrice([price[0], parseInt(e.target.value)]); setRows(3); }} />
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
                <input type="range" min="1" max="5" value={taste[0]} onChange={e => { setTaste([parseInt(e.target.value), taste[1]]); setRows(3); }} />
                <input type="range" min="1" max="5" value={taste[1]} onChange={e => { setTaste([taste[0], parseInt(e.target.value)]); setRows(3); }} />
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
          <div className="catalog-grid-wrapper" ref={gridWrapperRef}>
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
                  <button className="catalog-show-more" onClick={() => setRows(prev => prev + 1)}>
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