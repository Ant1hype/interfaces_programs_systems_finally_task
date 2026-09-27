import React from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] 2xl:px-[120px] max-w-[1920px] mx-auto pt-16 md:pt-24 pb-[154px] text-neutral-900-alt">
      {/* Крошки */}
      <nav aria-label="Хлебные крошки" className="flex items-center space-x-2 font-montserrat text-[16px] text-neutral-400 mb-8 md:mb-12">
        <Link to="/" className="text-neutral-400 hover:text-neutral-600 transition-colors">
          Главная
        </Link>
        <span>/</span>
        <span className="text-neutral-600">Пользовательское соглашение</span>
      </nav>

      {/* H1 */}
      <h1 className="font-lora font-medium text-[48px] leading-[1.2] mb-4 text-neutral-900-alt">
        Пользовательское соглашение
      </h1>

      {/* Подзаголовок */}
      <p className="font-montserrat text-[18px] leading-[1.5] text-neutral-600 max-w-[640px] mb-12 md:mb-16">
        Редакция от 25 мая 2026 года.
      </p>

      {/* Секции */}
      <div>
        {/* 1. Общие положения */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            1. Общие положения
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Настоящее соглашение регулирует использование сайта cheesecraft.ru и
              покупку товаров в магазине «Сырная палитра».
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Оформляя заказ, пользователь полностью принимает условия соглашения
              (публичная оферта, ст. 438 ГК РФ).
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Администрация может обновлять соглашение; действующая редакция всегда
              опубликована по этому адресу.
            </li>
          </ul>
        </section>

        {/* 2. Термины */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            2. Термины
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Сайт — интернет-ресурс cheesecraft.ru: каталог, корзина, личный кабинет.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Пользователь — лицо, оформляющее заказ или просматривающее сайт.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Заказ — оформленное через корзину обращение о покупке товара.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Баллы — единицы программы лояльности; 1 балл = 1 ₽.
            </li>
          </ul>
        </section>

        {/* 3. Заказ и оформление */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            3. Заказ и оформление
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Заказ считается принятым после онлайн-оплаты; чек приходит на email,
              указанный при оформлении.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Пользователь отвечает за точность данных: адрес, телефон, email.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Магазин вправе отказать в заказе при явной ошибке цены или остатка, с
              полным возвратом оплаченной суммы.
            </li>
          </ul>
        </section>

        {/* 4. Оплата */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            4. Оплата
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Оплата производится банковской картой онлайн; баллами можно покрыть до
              50% суммы заказа.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Момент оплаты является моментом заключения договора купли-продажи.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Возврат средств выполняется на карту плательщика в срок от 3 до 10
              рабочих дней.
            </li>
          </ul>
        </section>

        {/* 5. Доставка и самовывоз */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            5. Доставка и самовывоз
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Условия доставки определены страницей «Условия доставки» и являются
              неотъемлемой частью соглашения.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Риск случайной гибели товара переходит к покупателю в момент передачи
              заказа.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              При получении пользователь вправе осмотреть заказ и проверить целостность
              упаковки.
            </li>
          </ul>
        </section>

        {/* 6. Возврат и качество */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            6. Возврат и качество
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Продукты надлежащего качества возврату и обмену не подлежат (постановление
              Правительства № 55).
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Претензии по качеству принимаются в течение 24 часов после получения, с
              фотографиями.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Порядок рассмотрения претензий описан на странице «Оплата и возврат».
            </li>
          </ul>
        </section>

        {/* 7. Программа лояльности */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            7. Программа лояльности
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Участие добровольное; баллы начисляются в размере 5% от суммы оплаченного
              заказа.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Баллы не передаются третьим лицам, не имеют денежного эквивалента и
              сгорают через 12 месяцев.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Магазин вправе изменить условия программы, уведомив пользователей за 14
              дней.
            </li>
          </ul>
        </section>

        {/* 8. Персональные данные */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            8. Персональные данные
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Сайт обрабатывает данные согласно 152-ФЗ «О персональных данных».
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Оформляя заказ, пользователь соглашается на обработку данных для
              исполнения заказа.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Данные не передаются третьим лицам, кроме службы доставки и платёжного
              эквайера.
            </li>
          </ul>
        </section>

        {/* 9. Интеллектуальная собственность */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            9. Интеллектуальная собственность
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Дизайн, тексты и фотографии сайта принадлежат магазину; копирование без
              разрешения запрещено.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Товарные знаки партнёрских сыроварен используются с согласия
              правообладателей.
            </li>
          </ul>
        </section>

        {/* 10. Ограничение ответственности */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            10. Ограничение ответственности
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Магазин не отвечает за временную недоступность сайта из-за технического
              обслуживания.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Ответственность за качество товара ограничена стоимостью заказа.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Обстоятельства непреодолимой силы: стихийные бедствия, забастовки, решения
              органов власти.
            </li>
          </ul>
        </section>

        {/* 11. Заключительные положения */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            11. Заключительные положения
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Соглашение регулируется законодательством Российской Федерации.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Споры решаются переговорами, при недостижении согласия — в суде по месту
              нахождения продавца.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Вопросы по соглашению: hello@cheesecraft.ru.
            </li>
          </ul>
        </section>

        {/* 12. Реквизиты */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            12. Реквизиты
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              ИП «Сырная палитра», г. Томск. Налоговый режим УСН 6%; ОГРНИП и ИНН указаны
              в фискальном чеке.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Служба поддержки: care@cheesecraft.ru, +7 495 255 15 33, ежедневно с 10:00
              до 22:00.
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}
