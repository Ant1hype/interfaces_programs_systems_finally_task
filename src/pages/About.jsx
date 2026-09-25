import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ImageWithFallback({ src, alt, className }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`overflow-hidden rounded-2xl bg-gradient-to-br from-stone-800 via-stone-850 to-stone-900 ${className || ''}`}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : null}
    </div>
  );
}

const PARTNERS = [
  { id: 1, name: "L'AFFINAGE NOBLE", src: '/images/partners/logo-1.png' },
  { id: 2, name: 'ANTICO CASEIFICIO', src: '/images/partners/logo-2.png' },
  { id: 3, name: 'CHÂTEAU BLEU', src: '/images/partners/logo-3.png' },
  { id: 4, name: 'THE CHEESE WARDEN', src: '/images/partners/logo-4.png' },
  { id: 5, name: 'ЗОЛОТАЯ КРОМКА', src: '/images/partners/logo-5.png' },
  { id: 6, name: 'ALPINE GOLD', src: '/images/partners/logo-6.png' },
];

function PartnerLogo({ partner }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-[213px] h-[133px] px-4 bg-neutral-900-alt text-neutral-100 rounded-lg flex items-center justify-center text-xs font-medium tracking-wide text-center">
        {partner.name}
      </div>
    );
  }

  return (
    <div className="w-[213px] h-[133px] rounded-lg flex items-center justify-center">
      <img
        src={partner.src}
        alt={partner.name}
        onError={() => setHasError(true)}
        className="w-full h-full object-contain rounded-lg"
      />
    </div>
  );
}

export default function About() {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] 2xl:px-[120px] max-w-[1920px] mx-auto pt-16 md:pt-24 pb-[154px] text-neutral-900-alt">
      {/* Крошки */}
      <nav aria-label="Хлебные крошки" className="flex items-center space-x-2 font-montserrat text-[16px] text-neutral-400 mb-8 md:mb-12">
        <Link to="/" className="text-neutral-400 hover:text-neutral-600 transition-colors">
          Главная
        </Link>
        <span>/</span>
        <span className="text-neutral-600">О нас</span>
      </nav>

      {/* H1-манифест */}
      <h1
        className="font-lora font-medium text-[48px] leading-[1.25] mb-16 md:mb-24 text-neutral-900-alt max-w-[842px]"
      >
        Сырная палитра — это первый концепт-стор ремесленных сыров. Мы не варим сыр сами. Мы ищем скрытые хиты по локальным сыроварням, дегустируем сотни сортов и забираем в каталог только то, что вызывает абсолютный восторг.
      </h1>

      {/* Шахматный блок */}
      <div className="grid md:grid-cols-[649px_515px] gap-x-[175px] gap-y-16 justify-center items-start">
        {/* Левая колонка */}
        <div className="flex flex-col">
          <blockquote className="font-montserrat font-semibold text-[20px] leading-[1.5] text-neutral-900-alt mb-6">
            «Идеальный сыр заслуживает идеальной пары. Мы точно знаем, что подать к бокалу плотного красного, чтобы вечер перестал быть томным»
          </blockquote>
          <ImageWithFallback
            src="/images/about-pair.jpg"
            alt="Идеальная пара к сыру"
            className="w-full md:w-[649px] md:h-[800px] aspect-[487/600] object-cover rounded-2xl"
          />
        </div>

        {/* Правая колонка */}
        <div className="flex flex-col">
          <ImageWithFallback
            src="/images/about-tasting.jpg"
            alt="Дегустация сыров"
            className="w-full md:w-[515px] md:h-[640px] aspect-[386/480] object-cover rounded-2xl mb-6"
          />
          <blockquote className="font-montserrat font-semibold text-[20px] leading-[1.5] text-neutral-900-alt">
            «Мы дегустируем десятки сортов, но на витрину попадают единицы. Никаких компромиссов — только чистый восторг»
          </blockquote>
        </div>
      </div>

      {/* Три колонки ценностей */}
      <div className="grid md:grid-cols-3 gap-10 mt-20">
        <div className="max-w-[280px]">
          <h3 className="font-lora font-semibold text-[24px] leading-[1.25] text-neutral-900-alt mb-3">
            Жесткая селекция
          </h3>
          <p className="font-montserrat font-medium text-[18px] leading-[1.5] text-neutral-600">
            Из 50 продегустированных нами сортов в итоговый каталог попадает только один. Мы безжалостно отфильтровываем масс-маркет и скучные вкусы, чтобы оставить только сыры с характером.
          </p>
        </div>

        <div className="max-w-[285px]">
          <h3 className="font-lora font-semibold text-[24px] leading-[1.25] text-neutral-900-alt mb-3">
            Гедонизм без снобизма
          </h3>
          <p className="font-montserrat font-medium text-[18px] leading-[1.5] text-neutral-600">
            Мы продаем не просто еду, а готовый сценарий для вашего вечера. К каждому сыру мы уже подобрали идеальную пару: от плотного красного вина до правильного лукового мармелада.
          </p>
        </div>

        <div className="max-w-[336px]">
          <h3 className="font-lora font-semibold text-[24px] leading-[1.25] text-neutral-900-alt mb-3">
            Прямо из камер аффинажа
          </h3>
          <p className="font-montserrat font-medium text-[18px] leading-[1.5] text-neutral-600">
            У настоящего сыра нет срока годности, есть только стадия созревания. Мы забираем головы прямо из частных погребов и доставляем вам с соблюдением строгих температурных норм.
          </p>
        </div>
      </div>

      {/* 1. С нами работают лучшие ремесленники */}
      <section className="mt-20">
        <h2 className="font-lora font-semibold text-[32px] leading-[1.25] text-neutral-900-alt mb-8">
          С нами работают лучшие ремесленники
        </h2>
        <div className="flex flex-wrap gap-[33px] items-center justify-center">
          {PARTNERS.map((partner) => (
            <PartnerLogo key={partner.id} partner={partner} />
          ))}
        </div>
      </section>

      {/* 2. Вживую еще вкуснее */}
      <section className="mt-20">
        <h2 className="font-lora font-semibold text-[40px] leading-[1.25] text-neutral-900-alt mb-8">
          Вживую еще вкуснее
        </h2>
        <div className="grid md:grid-cols-2 gap-[33px]">
          <div>
            <ImageWithFallback
              src="/images/store-gastro.jpg"
              alt="Сырная палитра на Гастрономической"
              className="w-full aspect-[590/400] object-cover rounded-2xl"
            />
            <h3 className="font-montserrat font-medium text-[24px] leading-[1.25] text-neutral-900-alt mt-5 mb-2">
              Сырная палитра на Гастрономической
            </h3>
            <p className="font-montserrat font-medium text-[18px] leading-[1.5] text-neutral-500 mb-1">г. Томск, ул. Гастрономическая, 15</p>
            <p className="font-montserrat font-medium text-[16px] leading-[1.5] text-neutral-500">Ежедневно с 10:00 до 22:00</p>
            <div className="w-10 h-px bg-neutral-400 mt-4" />
          </div>

          <div>
            <ImageWithFallback
              src="/images/store-estetov.jpg"
              alt="Сырная палитра на Эстетов"
              className="w-full aspect-[590/400] object-cover rounded-2xl"
            />
            <h3 className="font-montserrat font-medium text-[24px] leading-[1.25] text-neutral-900-alt mt-5 mb-2">
              Сырная палитра на Эстетов
            </h3>
            <p className="font-montserrat font-medium text-[18px] leading-[1.5] text-neutral-500 mb-1">г. Томск, пр-т Эстетов, 42</p>
            <p className="font-montserrat font-medium text-[16px] leading-[1.5] text-neutral-500">Ежедневно с 10:00 до 22:00</p>
            <div className="w-10 h-px bg-neutral-400 mt-4" />
          </div>
        </div>
      </section>

      {/* 3. Контакты */}
      <section className="mt-20">
        <h2 className="font-lora font-semibold text-[40px] leading-[1.25] text-neutral-900-alt mb-8">
          Контакты
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="max-w-[277px]">
            <h3 className="font-montserrat font-medium text-[24px] leading-[1.25] text-neutral-900-alt mb-3">
              Служба поддержки
            </h3>
            <p className="font-montserrat font-medium text-[16px] leading-[1.5] text-neutral-500 mb-4">
              По любым вопросам о заказах, качестве сыра, доставке или если вам просто нужен совет сомелье.
            </p>
            <div className="space-y-2 font-montserrat font-medium text-[16px] leading-[1.5] text-neutral-700">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-neutral-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span>+7 495 255 15 33</span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-neutral-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span>care@cheesecraft.ru</span>
              </div>
            </div>
          </div>

          <div className="max-w-[342px]">
            <h3 className="font-montserrat font-medium text-[24px] leading-[1.25] text-neutral-900-alt mb-3">
              Партнерство & B2B
            </h3>
            <p className="font-montserrat font-medium text-[16px] leading-[1.5] text-neutral-500 mb-4">
              Вы локальный ремесленник и хотите на нашу витрину? Или вам нужен роскошный сырный кейтеринг на мероприятие?
            </p>
            <div className="space-y-2 font-montserrat font-medium text-[16px] leading-[1.5] text-neutral-700">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-neutral-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span>b2b@cheesecraft.ru</span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-neutral-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                <span>@cheesecraft_b2b</span>
              </div>
            </div>
          </div>

          <div className="max-w-[292px]">
            <h3 className="font-montserrat font-medium text-[24px] leading-[1.25] text-neutral-900-alt mb-3">
              PR & Спецпроекты
            </h3>
            <p className="font-montserrat font-medium text-[16px] leading-[1.5] text-neutral-500 mb-4">
              Для блогеров, бренд-коллабораций, съемок и предложений от медиа. Давайте делать красиво вместе.
            </p>
            <div className="space-y-2 font-montserrat font-medium text-[16px] leading-[1.5] text-neutral-700">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-neutral-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span>pr@cheesecraft.ru</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

