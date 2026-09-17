# Product page — спецификация по PNG + токенам

## Общие блоки
- Хлебные крошки: `text-body-sm`, `neutral-350` / `neutral-600`, линки `neutral-700` hover `brand-900`. Отступ `gap-xs`.
- Галерея: фото `radius-lg` (`12px`), превью `radius-md` (`8px`), border `border-card` / `neutral-300`, active — `brand-900` 2px. Сетка 4/8px (ASSUMPTION: gap 16, thumbnails 80px).
- Правая колонка: заголовок `text-h1`/`lora` `neutral-900-alt`, цена `text-price` `brand-900` + вес `text-weight-tag` `neutral-500`, наличие `neutral-350`. Характеристики `text-body` `neutral-black`, лейблы `neutral-500` значения `neutral-black` Bold. `Интенсивность` — 5 dots: filled `brand-900` empty `surface-gray-fill`. Фасовка: кнопка `radius-md` `text-button-sm`; active `brand-900`/`surface-white`, disabled `surface-gray-fill`/`neutral-400` border `border-toggle-off`. Кнопка «В корзину» `brand-900` `surface-white` `radius-lg`, disabled `neutral-300` `neutral-disabled`, плашка «нет в наличии» `danger-700` `surface-white`. Доставка: `neutral-600` `text-caption`.
- Блок «С этим сыром покупают»: заголовок `text-h2` `lora`, сетка 4 `ProductCard` `radius-xl` `border-card`.

## Таб 1 — О продукте
Слева `description.text1`/`text2` `text-body` `neutral-black` line 1.6. Справа «Гастрономические сочетания» `pairing1`/`pairing2` `surface-cream` карточка `radius-lg` border `neutral-250-a80`. Хедер табов: active `brand-900` underline `accent-gold`, inactive `neutral-500`.

## Таб 2 — Состав и ценность
Слева: «Состав продукта» `ingredients`, «Срок годности и хранение» `shelfLife` `text-body`. Справа карточка «Пищевая ценность (на 100 г)» `surface-white` `radius-xl` border `neutral-250-a80`: `nutrition.calories/proteins/fats/carbs` `text-h3` `brand-900` лейбл `neutral-500`. Grid 2col (ASSUMPTION: gap 32).

## Таб 3 — Отзывы (N)
Заголовок таба `Отзывы (N)` N=`reviews.length`. Карточка отзыва: `surface-white` `radius-lg` border `neutral-300` pad `20px` (ASSUMPTION gap 16): author `text-label` bold, date `neutral-350` `text-caption`, pairing `neutral-600` italic, rating stars/dots `brand-900` / `accent-gold`, text `text-body`. Пустое состояние: «отзывов пока нет» `neutral-500` `text-body` center + иконка, фон `surface-cream` `radius-lg`.
