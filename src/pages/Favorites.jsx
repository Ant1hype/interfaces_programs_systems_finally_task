import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getProducts } from '../lib/api.js';
import ProductCard from '../components/ProductCard.jsx';

function BrokenHeartIcon() {
  return (
    <svg
      className="w-20 h-20 text-neutral-350 mx-auto"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="m12 13-1-1 2-2-3-3 2-2" />
    </svg>
  );
}

export default function Favorites() {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    let mounted = true;
    getProducts()
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(() => {
        if (mounted) setProducts([]);
      })
      .finally(() => {
        if (mounted) setLoadingProducts(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const favoriteProducts = useMemo(() => {
    if (!user || !Array.isArray(user.favorites) || user.favorites.length === 0) {
      return [];
    }
    const map = new Map(products.map((p) => [String(p.id), p]));
    return user.favorites
      .map((id) => map.get(String(id)))
      .filter(Boolean);
  }, [user?.favorites, products]);

  if (loading || (user && Array.isArray(user.favorites) && user.favorites.length > 0 && loadingProducts)) {
    return null;
  }

  const isGuest = user === null;
  const isEmpty = !isGuest && favoriteProducts.length === 0;

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] 2xl:px-[120px] max-w-[1920px] mx-auto py-10 font-montserrat">
      {/* Хлебные крошки */}
      <nav className="text-[13px] text-neutral-350 mb-5">
        <Link to="/" className="text-neutral-700 no-underline hover:text-brand-900 transition-colors">
          Главная
        </Link>
        <span className="mx-2 text-neutral-350">/</span>
        <span className="text-neutral-700">Избранное</span>
      </nav>

      {/* Заголовок страницы */}
      <h1 className="font-lora text-[32px] font-bold text-neutral-900-alt mb-8">
        Избранное
      </h1>

      {/* Состояние 1: Гость */}
      {isGuest && (
        <div className="flex flex-col items-center justify-center text-center py-12 sm:py-16">
          <BrokenHeartIcon />
          <h2 className="text-[22px] sm:text-[24px] font-bold text-neutral-900-alt mt-6 sm:mt-8 mb-3">
            Тут пока ничего нет :(
          </h2>
          <p className="text-[15px] sm:text-[16px] text-neutral-500 font-normal leading-relaxed max-w-[460px] mx-auto mb-8">
            Войдите в аккаунт, чтобы мы могли сохранить ваши любимые сыры, и они никуда не пропали.
          </p>
          <div className="flex flex-col gap-4 w-full max-w-[320px] mx-auto">
            <Link
              to="/auth?next=/favorites"
              className="w-full h-[52px] inline-flex items-center justify-center px-4 bg-brand-900 text-surface-white text-[15px] font-medium rounded-radius-md hover:bg-brand-700 transition-colors no-underline"
            >
              Войти в профиль
            </Link>
            <Link
              to="/catalog"
              className="w-full h-[52px] inline-flex items-center justify-center px-4 bg-surface-white border border-brand-outline text-brand-outline text-[15px] font-medium rounded-radius-md hover:bg-surface-cream transition-colors no-underline"
            >
              Или просто посмотреть каталог
            </Link>
          </div>
        </div>
      )}

      {/* Состояние 2: Авторизован, favorites пуст */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center text-center py-12 sm:py-16">
          <BrokenHeartIcon />
          <h2 className="text-[22px] sm:text-[24px] font-bold text-neutral-900-alt mt-6 sm:mt-8 mb-3">
            Тут пока ничего нету :(
          </h2>
          <p className="text-[15px] sm:text-[16px] text-neutral-500 font-normal leading-relaxed max-w-[460px] mx-auto mb-8">
            Самое время заглянуть в каталог . . .
          </p>
          <div className="flex justify-center w-full sm:w-auto">
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-900 text-surface-white text-[15px] font-medium rounded-radius-md hover:bg-brand-700 transition-colors no-underline"
            >
              Перейти в каталог
            </Link>
          </div>
        </div>
      )}

      {/* Состояние 3: Авторизован, favorites не пуст */}
      {!isGuest && !isEmpty && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

