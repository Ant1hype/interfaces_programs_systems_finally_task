import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { faq } from '../data/faq';

function FaqAccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-neutral-200">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left font-montserrat font-semibold text-[20px] leading-[1.4] text-neutral-900-alt hover:text-neutral-700 transition-colors cursor-pointer"
      >
        <span>{item.q}</span>
        <span
          className={`shrink-0 transition-transform duration-300 ease-in-out text-neutral-500 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          aria-hidden="true"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          {isOpen && (
            <div className="pb-5 pt-1 font-montserrat text-[16px] leading-[1.6] text-neutral-600">
              {item.a}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (id) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] 2xl:px-[120px] max-w-[1920px] mx-auto pt-16 md:pt-24 pb-[154px] text-neutral-900-alt">
      {/* Крошки */}
      <nav aria-label="Хлебные крошки" className="flex items-center space-x-2 font-montserrat text-[16px] text-neutral-400 mb-8 md:mb-12">
        <Link to="/" className="text-neutral-400 hover:text-neutral-600 transition-colors">
          Главная
        </Link>
        <span>/</span>
        <span className="text-neutral-600">Частые вопросы</span>
      </nav>

      {/* H1 */}
      <h1 className="font-lora font-medium text-[48px] leading-[1.2] mb-4 text-neutral-900-alt">
        Частые вопросы
      </h1>

      {/* Подзаголовок */}
      <p className="font-montserrat text-[18px] leading-[1.5] text-neutral-600 max-w-[640px] mb-12 md:mb-16">
        Собрали всё, что спрашивают до, во время и после первого заказа. Не нашли свой вопрос — напишите на care@cheesecraft.ru, ответит живой человек.
      </p>

      {/* Аккордеон по секциям */}
      <div className="space-y-12 md:space-y-16">
        {faq.map((section, idx) => (
          <section key={idx} aria-labelledby={`faq-sec-${idx}`}>
            <h2
              id={`faq-sec-${idx}`}
              className="font-lora font-semibold text-[32px] leading-[1.25] text-neutral-900-alt mb-6"
            >
              {section.title}
            </h2>
            <div className="border-t border-neutral-200">
              {section.items.map((item, itemIdx) => {
                const itemId = `${idx}-${itemIdx}`;
                return (
                  <FaqAccordionItem
                    key={itemIdx}
                    item={item}
                    isOpen={openItem === itemId}
                    onToggle={() => toggleItem(itemId)}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
