import React from 'react';
import { Link } from 'react-router-dom';

export default function Payment() {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] 2xl:px-[120px] max-w-[1920px] mx-auto pt-16 md:pt-24 pb-[154px] text-neutral-900-alt">
      {/* Крошки */}
      <nav aria-label="Хлебные крошки" className="flex items-center space-x-2 font-montserrat text-[16px] text-neutral-400 mb-8 md:mb-12">
        <Link to="/" className="text-neutral-400 hover:text-neutral-600 transition-colors">
          Главная
        </Link>
        <span>/</span>
        <span className="text-neutral-600">Оплата и возврат</span>
      </nav>

      {/* H1 */}
      <h1 className="font-lora font-medium text-[48px] leading-[1.2] mb-4 text-neutral-900-alt">
        Оплата и возврат
      </h1>

      {/* Подзаголовок */}
      <p className="font-montserrat text-[18px] leading-[1.5] text-neutral-600 max-w-[640px] mb-12 md:mb-16">
        Прозрачные правила: как платить, что делать с баллами и в каких случаях возвращаем деньги.
      </p>

      {/* Секции */}
      <div>
        {/* 1. Оплата картой */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            Оплата картой
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Онлайн картой МИР, Visa и Mastercard российских банков. Платёж
              проходит через защищённый эквайринг Тинькофф, данные карт мы не
              храним и не видим.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              3D Secure обязателен: банк присылает код на телефон для
              подтверждения.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Наличных при получении нет: сборку заказа начинаем сразу после
              оплаты, чтобы сыр не ждал.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Повторная оплата: если платёж завис, подождите 5 минут и обновите
              страницу. Списания не было — попробуйте ещё раз.
            </li>
          </ul>
        </section>

        {/* 2. Безопасность платежей */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            Безопасность платежей
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Все транзакции идут по HTTPS с шифрованием TLS 1.3.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Мы соответствуем стандарту PCI DSS Level 1 — самому строгому
              уровню защиты платёжных данных.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Эквайер (Тинькофф) хранит данные карт, мы получаем только токен
              транзакции и статус оплаты.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              При подозрении на мошенничество платёж блокируется вручную, мы
              звоним вам для подтверждения.
            </li>
          </ul>
        </section>

        {/* 3. Чеки и налоги */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            Чеки и налоги
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Фискальный чек формируется автоматически через онлайн-кассу Атол и
              отправляется на email в течение минуты после оплаты.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Если чек не пришёл — проверьте спам или напишите на
              care@cheesecraft.ru, пришлём повторно.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Мы работаем как ИП на УСН 6%, НДС не облагаем.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Юридическим лицам: счёт на оплату, УПД и закрывающие документы по
              запросу (care@cheesecraft.ru с темой «Юрлицо»).
            </li>
          </ul>
        </section>

        {/* 4. Баллы: начисление и списание */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            Баллы: начисление и списание
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              5% суммы каждого оплаченного заказа возвращаются баллами. Баллы
              появляются в личном кабинете сразу после оформления.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              1 балл = 1 ₽. Баллами можно оплатить до 50% стоимости заказа на
              шаге оплаты.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Баллы не суммируются с промокодами: выбираете что выгоднее.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Баллы живут 12 месяцев с момента начисления; за месяц до сгорания
              напомним письмом.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Сгоревшие баллы не восстанавливаются.
            </li>
          </ul>
        </section>

        {/* 5. Промокоды */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            Промокоды
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Промокоды приходят в рассылке, в подарок за отзывы или от
              партнёров. Срок и условия указаны в письме.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Промокоды не суммируются друг с другом: работает только один на
              заказ.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Минимальная сумма заказа для применения промокода указана в
              условиях (обычно 1 500 ₽).
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Промокод не работает? Проверьте срок, сумму заказа и напишите на
              care@cheesecraft.ru — применим вручную, если условия соблюдены.
            </li>
          </ul>
        </section>
        {/* 6. Возврат продуктов */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            Возврат продуктов
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Продукты надлежащего качества возврату не подлежат по
              постановлению Правительства № 55 (перечень непродовольственных
              товаров).
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Исключения, когда возвращаем деньги или меняем заказ:
              <ul className="list-disc pl-5 mt-2 space-y-3">
                <li className="font-montserrat text-[16px] text-neutral-600">
                  Сыр приехал испорченным (плесень не по сорту, кислый запах)
                </li>
                <li className="font-montserrat text-[16px] text-neutral-600">
                  Упаковка повреждена, продукт вытек
                </li>
                <li className="font-montserrat text-[16px] text-neutral-600">
                  Привезли не тот сорт или вес
                </li>
                <li className="font-montserrat text-[16px] text-neutral-600">
                  Курьер опоздал больше чем на час без предупреждения
                </li>
              </ul>
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Фото испорченного продукта на care@cheesecraft.ru в течение 24
              часов после получения — решим за день.
            </li>
          </ul>
        </section>

        {/* 7. Сроки возврата денег */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            Сроки возврата денег
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Решение о возврате принимаем в течение 24 часов после получения
              фото и описания проблемы.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Деньги возвращаются на ту же карту, с которой оплачивали.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Срок зачисления: 3–10 рабочих дней в зависимости от банка (Тинькофф
              и Сбер — 1–2 дня, остальные — до 10).
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Возврат баллами: мгновенно, баллы появляются в личном кабинете
              сразу.
            </li>
          </ul>
        </section>

        {/* 8. Спорные ситуации */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            Спорные ситуации
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Не подошёл вкус — не повод для возврата, но напишите нам: подберём
              сыр с другим профилем или дадим промокод на следующий заказ.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Курьер нагрубил или вёл себя непрофессионально — напишите,
              разберёмся и принесём извинения лично.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Заказ потерялся или не доехал — вернём деньги или соберём новый
              заказ бесплатно.
            </li>
          </ul>
        </section>

        {/* 9. Оплата для юридических лиц */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            Оплата для юридических лиц
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Работаем с юрлицами и ИП: сыр для офисных кухонь, корпоративных
              подарков, кейтеринга.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Схема: счёт на оплату → оплата по безналу → отгрузка → УПД.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Минимальный заказ для юрлиц — 5 000 ₽.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Персональный менеджер для заказов от 50 000 ₽ в месяц.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Запрос на b2b@cheesecraft.ru с темой «Сотрудничество».
            </li>
          </ul>
        </section>

        {/* 10. Порядок действий при проблемах */}
        <section>
          <h2 className="font-lora font-semibold text-[32px] text-neutral-900-alt mt-16 mb-6">
            Порядок действий при проблемах
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li className="font-montserrat text-[16px] text-neutral-600">
              Обнаружили проблему при получении — сфотографируйте упаковку и
              продукт, не выбрасывайте.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Напишите на care@cheesecraft.ru: номер заказа, описание проблемы,
              фото.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Ответ в течение 24 часов в рабочие дни (пн–пт 10:00–19:00).
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Предлагаем решение: возврат денег, замена, баллы-компенсация.
            </li>
            <li className="font-montserrat text-[16px] text-neutral-600">
              Если не согласны с решением — напишите «Эскалация» в теме,
              подключится руководитель службы поддержки.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
