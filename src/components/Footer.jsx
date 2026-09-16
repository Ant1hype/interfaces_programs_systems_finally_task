import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        
        {/* Верхняя часть с колонками */}
        <div className="footer__top">
          
          {/* Колонка 1: Бренд */}
          <div className="footer__col">
            <div className="footer__logo">Сырная палитра</div>
            <p className="footer__desc">
              Крафтовая сыроварня. Делаем<br />
              настоящий сыр из фермерского<br />
              молока без компромиссов в качестве
            </p>
            <div className="footer__socials">
              <a href="#">VK</a>
              <a href="#">OK</a>
              <a href="#">YT</a>
              <a href="#">TG</a>
            </div>
          </div>

          {/* Колонка 2: Контакты */}
          <div className="footer__col">
            <div className="footer__title">Связь с нами</div>
            <a href="mailto:hello@cheesecraft.ru" className="footer__link">hello@cheesecraft.ru</a>
            <a href="tel:+74952551533" className="footer__link">+7 495 255 15 33</a>
          </div>

          {/* Колонка 3: Навигация */}
          <div className="footer__col">
            <div className="footer__title">В интернет-магазине</div>
            <Link to="/delivery" className="footer__link">Условия доставки</Link>
            <Link to="/returns" className="footer__link">Оплата и возврат</Link>
            <Link to="/faq" className="footer__link">Частые вопросы</Link>
            <Link to="/about" className="footer__link">О нас</Link>
          </div>

        </div>

        {/* Тонкая линия разделителя */}
        <div className="footer__divider"></div>

        {/* Нижняя часть (копирайт и соглашение) */}
        <div className="footer__bottom">
          <span className="footer__copy">© 2026 Сырная палитра. Все права защищены.</span>
          <Link to="/terms" className="footer__link footer__link--bottom">
            Пользовательское соглашение
          </Link>
        </div>

      </div>
    </footer>
  );
}