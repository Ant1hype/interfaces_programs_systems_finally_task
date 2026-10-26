import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useToast } from '../context/ToastContext.jsx';

const STORAGE_KEY = 'syrnaya-palitra:support:v1';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBJECTS = ['Общий вопрос', 'Проблема с заказом', 'Возврат товара', 'Сотрудничество', 'Другое'];
const MAX_MESSAGE = 1000;

const QUICK_LINKS = [
  { to: '/faq', title: 'Частые вопросы', text: 'Баллы, сроки, состав заказа — короткие ответы.' },
  { to: '/delivery', title: 'Условия доставки', text: 'Москва и область, интервалы и стоимость.' },
  { to: '/payment', title: 'Оплата и возврат', text: 'Способы оплаты и возврат в течение 14 дней.' },
];

export default function Support() {
  const { push } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const inputBase =
    'w-full px-4 rounded-lg border bg-white font-montserrat text-[15px] text-neutral-900-alt focus:outline-none transition-colors';
  const borderFor = (field) => (errors[field] ? 'border-danger-700' : 'border-neutral-300 focus:border-brand-900');

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'Укажите ваше имя';
    if (!email.trim()) {
      next.email = 'Укажите email';
    } else if (!EMAIL_RE.test(email.trim())) {
      next.email = 'Некорректный email, пример: ivan@example.com';
    }
    if (!subject) next.subject = 'Выберите тему обращения';
    if (!message.trim()) {
      next.message = 'Опишите ваш вопрос';
    } else if (message.trim().length > MAX_MESSAGE) {
      next.message = `Не более ${MAX_MESSAGE} символов`;
    }
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const newTicket = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
        date: new Date().toISOString(),
        status: 'new',
      };
      let existing = [];
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed)) existing = parsed;
      } catch {
        existing = [];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newTicket, ...existing]));
      push('Сообщение отправлено! Мы свяжемся с вами в течение 24 часов.', 'success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      push('Не удалось отправить сообщение. Попробуйте ещё раз.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-cream min-h-[70vh] py-12">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px]">
        <Breadcrumbs items={[{ to: '/', label: 'Главная' }]} current="Центр поддержки" />

        <h1 className="font-lora text-[32px] sm:text-[36px] font-bold mb-2 text-neutral-900-alt">
          Центр поддержки пользователей
        </h1>
        <p className="text-[16px] text-neutral-500 mb-10 font-montserrat">
          Мы готовы помочь с любыми вопросами о наших сырах и заказах
        </p>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12">
          {/* Левая колонка: контакты и быстрая помощь */}
          <div>
            <section aria-labelledby="support-contacts-title">
              <h2 id="support-contacts-title" className="font-lora text-[22px] font-bold mb-6 text-neutral-900-alt">
                Свяжитесь с нами
              </h2>
              <ul className="space-y-4">
                <li className="bg-white border border-neutral-200 rounded-2xl p-5">
                  <span className="block text-[13px] text-neutral-500 mb-1 font-montserrat">Email</span>
                  <a
                    href="mailto:hello@cheesecraft.ru"
                    className="font-montserrat text-[15px] font-medium text-brand-900 hover:text-brand-700 underline-offset-2 hover:underline"
                  >
                    hello@cheesecraft.ru
                  </a>
                </li>
                <li className="bg-white border border-neutral-200 rounded-2xl p-5">
                  <span className="block text-[13px] text-neutral-500 mb-1 font-montserrat">Телефон</span>
                  <a
                    href="tel:+74952551533"
                    className="font-montserrat text-[15px] font-medium text-brand-900 hover:text-brand-700 underline-offset-2 hover:underline"
                  >
                    +7 495 255 15 33
                  </a>
                </li>
                <li className="bg-white border border-neutral-200 rounded-2xl p-5">
                  <span className="block text-[13px] text-neutral-500 mb-1 font-montserrat">Часы работы</span>
                  <span className="block font-montserrat text-[15px] text-neutral-900-alt">
                    пн-пт 9:00–20:00, сб-вс 10:00–18:00
                  </span>
                </li>
              </ul>
            </section>

            <section className="mt-8" aria-labelledby="support-quick-title">
              <h2 id="support-quick-title" className="font-lora text-[22px] font-bold mb-6 text-neutral-900-alt">
                Быстрая помощь
              </h2>
              <div className="space-y-4">
                {QUICK_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block bg-white border border-neutral-200 rounded-2xl p-5 hover:border-brand-900 transition-colors no-underline"
                  >
                    <span className="block font-montserrat text-[15px] font-semibold text-neutral-900-alt">
                      {item.title} →
                    </span>
                    <span className="block mt-1 font-montserrat text-[13px] text-neutral-500">{item.text}</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Правая колонка: форма обращения */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8">
            <h2 className="font-lora text-[24px] font-bold mb-6 text-neutral-900-alt">Напишите нам</h2>
            <form className="space-y-5" noValidate onSubmit={handleSubmit}>
              <div>
                <label className="block text-[13px] text-neutral-500 mb-1.5 font-montserrat" htmlFor="support-name">
                  Имя
                </label>
                <input
                  id="support-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Иванов"
                  aria-invalid={Boolean(errors.name)}
                  className={`${inputBase} h-[52px] ${borderFor('name')}`}
                />
                {errors.name ? <p className="text-[13px] text-danger-700 mt-1 font-montserrat">{errors.name}</p> : null}
              </div>

              <div>
                <label className="block text-[13px] text-neutral-500 mb-1.5 font-montserrat" htmlFor="support-email">
                  Email
                </label>
                <input
                  id="support-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ivan@example.com"
                  aria-invalid={Boolean(errors.email)}
                  className={`${inputBase} h-[52px] ${borderFor('email')}`}
                />
                {errors.email ? (
                  <p className="text-[13px] text-danger-700 mt-1 font-montserrat">{errors.email}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-[13px] text-neutral-500 mb-1.5 font-montserrat" htmlFor="support-subject">
                  Тема
                </label>
                <select
                  id="support-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  aria-invalid={Boolean(errors.subject)}
                  className={`${inputBase} h-[52px] ${borderFor('subject')}`}
                >
                  <option value="">Выберите тему</option>
                  {SUBJECTS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.subject ? (
                  <p className="text-[13px] text-danger-700 mt-1 font-montserrat">{errors.subject}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-[13px] text-neutral-500 mb-1.5 font-montserrat" htmlFor="support-message">
                  Сообщение
                </label>
                <textarea
                  id="support-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Опишите ваш вопрос подробно..."
                  maxLength={MAX_MESSAGE}
                  aria-invalid={Boolean(errors.message)}
                  className={`${inputBase} h-[140px] py-3 resize-y ${borderFor('message')}`}
                />
                <div className="flex items-start justify-between gap-3">
                  {errors.message ? (
                    <p className="text-[13px] text-danger-700 mt-1 font-montserrat">{errors.message}</p>
                  ) : (
                    <span />
                  )}
                  <span className="mt-1 text-[12px] text-neutral-400 font-montserrat whitespace-nowrap">
                    {message.length}/{MAX_MESSAGE}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-900 hover:bg-brand-700 text-white py-3.5 rounded-lg font-medium font-montserrat text-[15px] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Отправка...' : 'Отправить сообщение'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
