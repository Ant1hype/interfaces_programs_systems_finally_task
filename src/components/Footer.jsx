import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-footer-bg font-montserrat">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] 2xl:px-[120px] max-w-[1920px] mx-auto pt-10 md:pt-[60px] pb-6 md:pb-[30px]">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr] gap-8 md:gap-10 mb-8 md:mb-10">
          <div className="flex flex-col">
            <div className="font-lora text-[24px] font-bold leading-none text-surface-white mb-5">Сырная палитра</div>
            <p className="text-[14px] leading-[1.6] text-neutral-350 mb-6">
              Крафтовая сыроварня. Делаем<br />
              настоящий сыр из фермерского<br />
              молока без компромиссов в качестве
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-350 no-underline font-semibold text-[14px] transition-colors duration-200 hover:text-surface-white">VK</a>
              <a href="#" className="text-neutral-350 no-underline font-semibold text-[14px] transition-colors duration-200 hover:text-surface-white">OK</a>
              <a href="#" className="text-neutral-350 no-underline font-semibold text-[14px] transition-colors duration-200 hover:text-surface-white">YT</a>
              <a href="#" className="text-neutral-350 no-underline font-semibold text-[14px] transition-colors duration-200 hover:text-surface-white">TG</a>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="font-lora text-[18px] font-semibold text-surface-white mb-5">Связь с нами</div>
            <a href="mailto:hello@cheesecraft.ru" className="block text-[14px] text-neutral-350 no-underline mb-3 transition-colors duration-200 hover:text-surface-white">hello@cheesecraft.ru</a>
            <a href="tel:+74952551533" className="block text-[14px] text-neutral-350 no-underline mb-3 transition-colors duration-200 hover:text-surface-white">+7 495 255 15 33</a>
          </div>
          <div className="flex flex-col">
            <div className="font-lora text-[18px] font-semibold text-surface-white mb-5">В интернет-магазине</div>
            <Link to="/delivery" className="block text-[14px] text-neutral-350 no-underline mb-3 transition-colors duration-200 hover:text-surface-white">Условия доставки</Link>
            <Link to="/returns" className="block text-[14px] text-neutral-350 no-underline mb-3 transition-colors duration-200 hover:text-surface-white">Оплата и возврат</Link>
            <Link to="/faq" className="block text-[14px] text-neutral-350 no-underline mb-3 transition-colors duration-200 hover:text-surface-white">Частые вопросы</Link>
            <Link to="/about" className="block text-[14px] text-neutral-350 no-underline mb-3 transition-colors duration-200 hover:text-surface-white">О нас</Link>
          </div>
        </div>
        <div className="h-px bg-footer-divider mb-6 md:mb-[30px]"></div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <span className="text-[12px] text-neutral-350 text-center sm:text-left">© 2026 Сырная палитра. Все права защищены.</span>
          <Link to="/terms" className="text-[12px] text-neutral-350 no-underline transition-colors duration-200 hover:text-surface-white text-center sm:text-right">
            Пользовательское соглашение
          </Link>
        </div>
      </div>
    </footer>
  );
}
