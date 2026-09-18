import React from 'react';
import { Link } from 'react-router-dom';

export default function Profile() {
  return (
    <div className="w-full bg-surface-white font-montserrat min-h-[60vh]">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] 2xl:px-[120px] max-w-[1920px] mx-auto py-6 sm:py-8">
        <nav className="flex items-center gap-2 text-[13px] text-neutral-600 mb-6 sm:mb-8" aria-label="Хлебные крошки">
          <Link to="/" className="text-neutral-600 hover:text-brand-900 transition-colors duration-200">
            Главная
          </Link>
          <span>/</span>
          <span className="text-neutral-900-alt font-medium">Профиль</span>
        </nav>

        <h1 className="font-lora text-[28px] sm:text-[32px] md:text-[36px] font-bold text-neutral-900-alt mb-4">
          Личный кабинет
        </h1>

        <p className="text-[14px] sm:text-[15px] text-neutral-600">
          Форма профиля приедет в следующей задаче
        </p>
      </div>
    </div>
  );
}

