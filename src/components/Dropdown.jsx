import React, { useCallback, useEffect, useRef, useState } from 'react';

// Кастомный выпадающий список (без нативного <select>) с плавным раскрытием 200ms
export default function Dropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Выберите вариант',
  ariaLabel,
}) {
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const headerLabel = selectedOption ? selectedOption.label : placeholder;

  const close = useCallback(() => setIsOpen(false), []);

  const handleOptionClick = (optionValue) => {
    if (onChange) onChange(optionValue);
    close();
  };

  // Закрытие по клику вне компонента и по ESC
  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) close();
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  // При каждом открытии прокручиваем список в начало: первая опция видна целиком
  useEffect(() => {
    if (isOpen && listRef.current) listRef.current.scrollTop = 0;
  }, [isOpen]);

  return (
    <div className="relative w-full font-montserrat" ref={rootRef}>
      <div
        className={`bg-[#ECEEF0] border border-neutral-900 overflow-hidden ${
          isOpen ? 'rounded-t-[12px] rounded-b-none' : 'rounded-[12px]'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          className="w-full h-[52px] px-6 flex items-center justify-between gap-3 text-[16px] text-neutral-900 bg-transparent border-0 cursor-pointer focus:outline-none focus-visible:outline-none"
        >
          <span className="truncate">{headerLabel}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            focusable="false"
            className={`shrink-0 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path
              d="M3.5 5.75L8 10.25L12.5 5.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Панель опций выведена из потока: absolute-оверлей, единая рамка с шапкой (-mt-px) */}
      <div
        className={`absolute left-0 right-0 top-full -mt-px z-20 bg-[#ECEEF0] border rounded-b-[12px] overflow-hidden ${
          isOpen ? 'border-neutral-900' : 'border-transparent pointer-events-none'
        }`}
      >
        <ul
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel}
          className={`m-0 p-0 list-none overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-[max-height,opacity] duration-200 ease-out ${
            isOpen ? 'max-h-[288px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} className="m-0 p-0">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={() => handleOptionClick(option.value)}
                  className={`w-full text-left px-6 py-3 text-[16px] bg-transparent border-0 cursor-pointer hover:text-brand-900 transition-colors ${
                    isSelected ? 'font-semibold' : 'font-normal'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
