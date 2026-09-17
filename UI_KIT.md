# UI KIT — «Сырная палитра»

Каталог всех компонентов и component set'ов со страницы «Элементы» Figma-файла
«Лабораторная ИПС - Сырная Лавка». Токены — см. `DESIGN_TOKENS.md`.

---

## 1. Кнопка в корзину
**Figma component set:** `Кнопка в корзину` (#18:15)

Основная кнопка добавления товара в корзину, используется в карточках товара. Имеет варианты по состоянию (обычная / со счётчиком) и по цвету (активная/hover).

| Вариант | Состояние | Содержимое | Fill | Padding | Radius | Текст-стиль |
|---|---|---|---|---|---|---|
| Property 1 = Frame 7 | default (светлый вариант обёртки) | «В корзину» | `surface-white`→кнопка `brand-700` | 20px 32px | `radius-lg` (12px) | `text-button-lg` (Montserrat Medium 18) |
| Property 1 = Frame 6 | default | «В корзину» | `brand-900` | 20px 32px | `radius-lg` | `text-button-lg`, цвет `surface-white` |
| Property 1 = Variant3 | со счётчиком (1 шт.) | «-» «1» «+» | `brand-900` | 20px, gap 45px | `radius-lg` | `text-button-bold` (Bold 16) |
| Property 1 = Variant4 | со счётчиком (1 шт., hover) | «-» «1» «+» | `brand-700` | 20px, gap 45px | `radius-lg` | `text-button-bold` |
| Property 1 = Variant5 | со счётчиком (2 шт.) | «-» «2» «+» | `brand-900` | 20px, gap 45px | `radius-lg` | `text-button-bold` |
| Property 1 = Variant6 | со счётчиком (2 шт., hover) | «-» «2» «+» | `brand-700` | 20px, gap 45px | `radius-lg` | `text-button-bold` |

**Токены:** `brand-900`, `brand-700`, `surface-white`, `radius-lg`, `text-button-lg`, `text-button-bold`.

---

## 2. Карточка товара
**Figma component:** `Карточка товара` (#6:44)

Карточка для сетки каталога (desktop). Состав: изображение (fill), кнопка «в избранное» (heart), блок названия/веса/цены, кнопка «в корзину».

| Слой | Описание | Токены |
|---|---|---|
| Контейнер | 280×420, fill `surface-white`, stroke `neutral-300` 1px | `border-card`, `radius-xl` (16px) |
| Фото товара | Frame 240×180, image fill, radius 12px | `radius-lg` |
| Иконка heart | IMAGE-SVG 24×24, компонент из набора `heart` | см. §8 |
| Название | Cormorant Garamond Bold 20 | `text-h2-product` |
| Вес | Inter SemiBold 14, цвет `neutral-500` | `text-weight-tag` |
| Цена | Lora Medium 18 | `text-price` |
| Кнопка в корзину | Instance компонента «Кнопка в корзину» | см. §1 |

**Адаптивная версия:** `Карточка товара адаптив` (#702:7211) / `Карточка товара адаптив для избранного` (#758:6836) — 180×280, radius 12px, текст названия Lora SemiBold 15 (`text-h3-product-sm`), цена Lora Medium 14 (`text-price-sm`), вес Montserrat Regular 10 (`text-weight-tag-sm`).

---

## 3. Кнопка в корзину адаптив
**Figma component set:** `Кнопка в корзину адаптив` (#702:7220)

| Вариант | Содержимое | Padding | Fill | Radius |
|---|---|---|---|---|
| Property 1 = Default | «В корзину» | 10px 34px | `brand-900` | `radius-lg` |
| Property 1 = Variant2 | «+ 1 -» (счётчик, gap 37px) | 10px 34px | `brand-900` | `radius-lg` |
| Property 1 = Variant3 | «+ 2 -» (счётчик) | 10px 34px | `brand-900` | `radius-lg` |

Текст: `text-button-sm` (Montserrat Medium 14) для «В корзину»; значение счётчика — `text-value-badge` (Bold 20, center).

---

## 4. Кнопка в корзину для карточки товара (страница товара)
**Figma component set:** `Кнопка в корзину для карточки товара` (#475:5155)

Крупная кнопка (320×48) для карточки/страницы одного товара, с состояниями активная/неактивная (default = `brand-900`, alt = `brand-700`) и со счётчиком (`-`, кол-во, `+`).

| Вариант | Содержимое | Fill |
|---|---|---|
| Default | «В корзину» | `brand-900` |
| Variant2 | «В корзину» | `brand-700` |
| Variant3 | «-» «1» «+» | `brand-900` |
| Variant4 | «-» «2» «+» | `brand-900` |
| Variant5 | «-» «1» «+» | `brand-700` |
| Variant6 | «-» «2» «+» | `brand-700` |

Текст-стиль: `text-button-lg` для лейбла, `text-button` (Medium 16) для символов счётчика.

---

## 5. Выбор фасовки для карточки товара
**Figma component set:** `Выбор фасовки для карточки товара` (#475:5184)

Группа из трёх кнопок-тегов «100 г / 200 г / 300 г», где ровно одна активна (`brand-900` fill, белый текст) а остальные — outline (`surface-white` fill, stroke `brand-outline` 2px, текст `neutral-700`). 7 вариантов покрывают все комбинации активного тега.

**Токены:** `radius-md` (8px), `text-button-sm` (Montserrat Medium 14), `border-toggle-off` (#C6C6C8 2px).

---

## 6. Ползунок цены (Range slider — цена)
**Figma component set:** `Ползунок цены` (#254:2454)

Фильтр диапазона цены для каталога. Заголовок «Цена, ₽» (`text-label-sm`-подобный, Lora Bold 16 right-align), SVG-трек слайдера, под ним пара значений (мин/макс), окрашенных в `accent-gold`.

| Вариант | Мин | Макс |
|---|---|---|
| Default | 0 | 5000 |
| Variant2 | 2500 | 5000 |
| Variant3 | 0 | 2500 (промежуточное положение) |

**Токены:** `accent-gold`, `text-caption` (12px), заголовок Lora Bold 16.

---

## 7. Ползунок интенсивности вкуса
**Figma component set:** `Ползунок интенсивности вкуса` (#254:2555)

Аналогичен ползунку цены, но диапазон 1–5, заголовок «Интенсивность вкуса». 4 варианта промежуточных положений (1/5, 2/5, 3/5, 4/5).

**Токены:** идентичны §6.

---

## 8. Heart (иконка «в избранное»)
**Figma component set:** `heart` (#296:10348)

| Вариант | Состояние | Fill/Stroke |
|---|---|---|
| Property 1 = Default | не в избранном (контур) | stroke `surface-white`/наследуемый |
| Property 1 = Variant2 | не в избранном, залит | stroke/fill наследуемый |
| Property 1 = Variant3 | **в избранном** (заполнено) | fill/stroke `danger-700` (#A61A1A) |
| Property 1 = Variant4 | hover/alt | наследуемый |
| Property 1 = Variant5 | в избранном, alt цвет | fill/stroke `danger-500` (#CC6666) |

Размер: 24×24 (в карточке товара), 20×20 (в мини-карточке избранного).

---

## 9. Тумблер (Toggle switch)
**Figma component set:** `Тумблер` (#52:155)

| Вариант | Состояние | Трек | Ползунок |
|---|---|---|---|
| Property 1 = Group 3 | Off | `neutral-300` (#BDBDBD) | белый круг слева |
| Property 1 = Group 4 | On | `brand-900` | белая галочка/иконка справа |
| Property 1 = Variant3 | On (alt/hover) | `brand-700` | иконка справа |
| Property 1 = Variant4 | Disabled | `#9D9D9D` | круг слева |

Размер трека: 40×24, `radius-pill` (20px).

---

## 10. Чекбоксы
**Figma component set:** `Чекбоксы` (#192:2597)

| Вариант | Состояние | Текст-пример |
|---|---|---|
| Property 1 = Default | не отмечен | «Коровье» |
| Property 1 = Variant2 | отмечен | «Коровье» |

Иконка-квадрат 20×20, `radius-sm` (4px), текст `text-button` (Montserrat Medium 16), gap 12px.

---

## 11. Выпадающий список (Dropdown / сортировка)
**Figma component set:** `Выпадающий список` (#296:13774)

| Вариант | Состояние | Содержимое |
|---|---|---|
| Property 1 = Default | закрыт | «По популярности» + стрелка «v» |
| Property 1 = Variant2 | открыт | список опций: «Рекомендованные», «Сначала дешевые», «Сначала дорогие», «Новинки» |

Контейнер: fill `surface-cream`, stroke `neutral-black` 1px, `radius-md` (8px), padding 12px 16px 14px 30px.
Текст пунктов: `text-sort` (Montserrat Regular 18).

---

## 12. Кнопка сбросить пароль
**Figma component set:** `Кнопка сбросить пароль` (#507:4536)

| Вариант | Fill | Radius |
|---|---|---|
| Default | `brand-900` | `radius-md` (8px) |
| Variant2 | `brand-700` (hover) | `radius-md` |

Padding 16px 128px, текст `text-button` белый.

---

## 13. Кнопка войти
**Figma component set:** `Кнопка войти` (#507:4571)

| Вариант | Fill | Radius |
|---|---|---|
| Default | `brand-900` | `radius-lg` (12px) |
| Variant2 | `brand-700` (hover) | `radius-md` (8px) |

Padding ~17px 177px, текст `text-button`.

---

## 14. Кнопка зарегистрироваться
**Figma component set:** `Кнопка зарегистироваться` (#593:4712)

Аналогична «Кнопке войти»: Default `brand-900` radius-lg, Variant2 `brand-700` radius-lg. Текст «Зарегистрироваться», `text-button`.

**Адаптив:** `Кнопка зарегистрироваться адаптив` (#747:5503) — RECTANGLE 301×48, radius `radius-lg`, fill `brand-900`.

---

## 15. Кнопка Вернуться ко входу
**Figma component set:** `Кнопка Вернуться ко входу` (#593:4723)

Default `brand-900` radius-md (8px), padding 17px 112–132px; Variant2 `brand-700` radius-md. Текст «Вернуться ко входу», Inter Regular 16.

**Адаптив:** `Кнопка вернуться ко входу адапптив` (#747:5782) — текст «Вернутся ко входу», `text-button`.

---

## 16. Гоустбаттон назад ко входу (адаптив)
**Figma component:** `Гоустбаттон назад ко входу адаптив` (#747:5625)

Outline-кнопка: fill `surface-white`, stroke `brand-outline` 1px, `radius-lg`, текст цвет `brand-outline`, «Назад ко входу», `text-button`.

---

## 17. Кнопка Сохранить изменения
**Figma component set:** `Кнопка Сохранить изменения` (#609:4685)

Default `brand-900` radius-md (8px) padding 16px 92–94px; Variant2 `brand-700` radius-md. Текст «Сохранить изменения», Montserrat SemiBold 16.

**Адаптив:** `Кнопка сохранить изменения адаптив` (#747:5932) — RECTANGLE 301×48 `radius-lg`, fill `brand-900`.

---

## 18. Кнопка повторить
**Figma component set:** `Кнопка повторить` (#616:4761)

Default `brand-900` radius-md (8px) padding 11px 21–22px; Variant2 `brand-700` (hover) radius-md. Текст «Повторить», `text-link-underline` (Medium 14, underline).

**Адаптив:** `Кнопка повторить адаптив` (#747:6055) — fill-контейнер `radius-lg`, текст 91×20 `text-button`.

---

## 19. Кнопка Перейти к оформлению
**Figma component set:** `Кнопка Перейти к оформлению` (#526:4641)

| Вариант | Fill | Radius |
|---|---|---|
| Default | `brand-900` | `radius-md` (8px) |
| Variant2 | `brand-700` (hover) | `radius-md` |

Padding 16px 54–58px, размер 301.86×52. Текст «Перейти к оформлению», `text-button` (Medium 16).

---

## 20. Кнопка для промокода в чекауте
**Figma component set:** `Кнопка для промокода в чекауте` (#526:4701)

Квадратная кнопка 44×44, `radius-md` (8px), символ «→» (`text-arrow`, Inter Medium 24, right-align, цвет белый).

| Вариант | Fill |
|---|---|
| Default | `brand-900` |
| Variant2 | `brand-700` (hover) |

---

## 21. Кнопка «Оплатить заказ» для чекаута
**Figma component set:** `Кнопкка Оплатить заказ для чекаута` (#526:4749)

Default `brand-900` radius-md (8px) padding 16px 88–89px, размер 312×52; Variant2 `brand-700` (hover). Текст «Оплатить заказ», `text-button`.

---

## 22. Выбор способа получения
**Figma component set:** `Выбор способа получения` (#526:4787)

Пара кнопок-переключателей «Доставка курьером» / «Самовывоз» (508×46 общий блок, каждая 244×46, `radius-lg` 12px).

| Вариант | Активна | Fill активной | Fill неактивной |
|---|---|---|---|
| Default | Доставка курьером | `brand-900` | `surface-white` + stroke `brand-outline` |
| Variant2 | Самовывоз | `brand-900` | `surface-white` + stroke `brand-outline` |
| Variant3 | Самовывоз (alt) | `brand-900` | outline |
| Variant4 | Доставка курьером (hover) | `brand-700` | outline |

Текст `text-button-sm` (Medium 14).

**Адаптив:** `Кнопки выора доставки адаптив` (#753:6548) — компактные кнопки 177×40, `Кнопка самовывоз адаптив` (#753:6464) и `Кнопка курьером адаптив` (#753:6466), radius-md (8px).

---

## 23. Радиобаттон
**Figma component set:** `Радиобаттон` (#526:4838)

Базовый радиобаттон: иконка (24×24, обводка `neutral-black` 2px) + текст (Inter Bold 16, `text-label`) + кружок-индикатор (Ellipse 10×10, справа сверху).

---

## 24. Радиобаттон выбора способа оплаты
**Figma component set:** `Радиобаттон выора способа оплаты` (#526:4852)

Composite из двух радиобаттонов («Картой онлайн» / «При получении»), где выбранный имеет заполненный индикатор-кружок цвета `brand-900` (Default) или `brand-700` (hover/alt варианты Variant2–4).

---

## 25. Кнопка «Истроия заказов» / Кнопка перейти в каталог 1 / Кнопка тили просто посмотреть каталог / Кнопка войти в профиль / Кнопка вернуться в каталог

Единое семейство CTA-кнопок 280×52, `radius-lg` (12px), различаются только текстом и контекстом:

| Component Set | Default fill | Variant2 fill | Текст |
|---|---|---|---|
| `Кнопка Истроия заказов` (#581:4693) | `surface-white` + stroke `brand-outline` | `surface-white` + stroke `neutral-600` | «История заказов» |
| `Кнопка перейти в каталог 1` (#526:5083) | `brand-900` | `brand-700` | «Перейти в каталог» |
| `Кнопка тили просто посмотреть каталог` (#526:5134) | `surface-white` + stroke `brand-outline` | `surface-white` + stroke `neutral-600` | «Или просто посмотреть каталог» |
| `Кнопка войти в профиль` (#526:5149) | `brand-900` | `brand-700` | «Войти в профиль» |
| `Кнопка вернуться в каталог` (#526:5168) | `brand-900` | `brand-700` | «Вернуться в каталог» |

Текст `text-lead` (Medium 16, line-height 1.5em, center) либо `text-body-sm` в outline-варианте.

**Компонент-одиночка:** `Кнопка перейти в каталог` (#708:7499) — 273×40, padding 11px 88px, fill `brand-900`, текст «Перейти в каталог →» Montserrat SemiBold 14.

---

## 26. Кнопка в корзину для адаптива (compound с доставкой)
**Figma component set:** `Кнопка в корзину для адаптива` (#738:5355)

Комбинированная кнопка 365×50, `radius-lg` (12px), fill `brand-900`, содержит основной лейбл «В корзину» (Bold 16, белый) + подпись «Ближайшая доставка: Завтра» (Bold 8, `neutral-350`). Второй/третий вариант — со счётчиком количества (`text-value-badge`, Bold 20, center).

---

## 27. Товар в корзине (строка позиции)
**Figma component:** `Товар в корзине адаптив` (#753:6227), десктоп-версия — фрейм `cart_item` (#507:4618)

Состав: фото 80×80 (`radius-md`), блок название/фасовка (`text-h2-product-alt` + `text-packaging`), инстанс «Кнопка в корзину» (счётчик), цена (`text-label`, Inter Bold 16), иконка «x» (удалить) 24×24.

---

## 28. Заказ (карточка истории заказов)
**Figma component:** `Заказ` (#616:4738) / `Заказ адаптив` (#747:6065)

Карточка: fill `surface-white`, stroke `neutral-250-a80` 1px, `radius-lg` (12px). Содержит номер заказа (`text-label-sm`, Inter Bold 14), дату (Inter SemiBold/Bold 12–14, `neutral-350`), статус («Доставлен», `overlay-gray-50`), сумму (Inter Bold 18/14), кнопку «Повторить» (см. §18).

---

## 29. Чекаут (сводка заказа) — Чекаут 1 / Чекаут 2 / Чекаут 3
**Figma component sets:** `Чекаут 1` (#758:7437), `Чекаут 2` (#753:6300), `Чекаут 3` (#753:6498)

Блок сводки заказа разных модификаций (с промокодом / со списанием баллов), fill `surface-white`, stroke `neutral-250-a80` 1px, `radius-xl` (16px). Общая структура:
- «Товары (N)» / «Скидка» / разделительная линия / «Итого» + сумма (`text-h1` Bold 24 right)
- Поле промокода (`radius-md`, placeholder `text-body-sm` цвет `neutral-400`) + кнопка-стрелка (§20)
- (Чекаут 3) Блок «Списать баллы»: заголовок `text-button-sm`, поле ввода с подписью «Доступно: N» и «Макс.» (`neutral-800`)
- CTA-кнопка «Перейти к оформлению» (§19) или «Оплатить заказ» (§21)
- Дисклеймер «Нажимая на кнопку, вы соглашаетесь с условиями возврата» (`text-caption-bold`, цвет `overlay-dark-40`)

---

## 30. Хэдэр (Header)
**Figma component set:** `Хэдэр` (#149:295)

Композитный header 1440×80(+80 доп. панель навигации):
- Верхняя инфо-полоса: телефон, «Магазины», «Россия», иконки (search/heart/shopping-bag/user), лого «Сырная палитра» (Lora Bold 24, цвет `#1A1A1A`)
- Нижняя навигация (fill `surface-white`, tab-ссылки): «Каталог», «Без лактозы», «К красному вину», «Легкий завтрак», «Изысканное», «100% Vegan» — текст `text-button-bold-sm` (Bold 14) / `text-label` (Inter Bold 16)
- Тень блока: `shadow-header`

**Единственный вариант:** Property 1 = «строка поиска - 1» (#149:293).

---

## Сводная таблица соответствия «компонент → базовые токены»

| Компонент | Цвет (fill) | Radius | Текст |
|---|---|---|---|
| Кнопка в корзину (все вариации) | `brand-900` / `brand-700` | `radius-lg` | `text-button-lg`/`text-button-bold` |
| Карточка товара | `surface-white` + `border-card` | `radius-xl`/`radius-lg` | `text-h2-product`, `text-price` |
| Ползунки (цена/вкус) | `accent-gold` (значения) | — | `text-caption` |
| Heart | `danger-700`/`danger-500` | — | — |
| Тумблер | `brand-900`/`neutral-300`/`disabled` | `radius-pill` | — |
| Чекбоксы | `neutral-black` (обводка) | `radius-sm` | `text-button` |
| Dropdown | `surface-cream` + `neutral-black` | `radius-md` | `text-sort` |
| Кнопки авторизации/CTA | `brand-900`/`brand-700` | `radius-lg`/`radius-md` | `text-button` |
| Выбор способа получения/оплаты | `brand-900`/outline `brand-outline` | `radius-lg` | `text-button-sm`/`text-label` |
| Чекаут-блоки | `surface-white` + `neutral-250-a80` | `radius-xl` | `text-h1`, `text-body-sm` |
| Header | `surface-white` + `shadow-header` | — | `text-logo`, `text-label` |
