import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SupportWidget.css';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="support-widget">
      {/* Сам Попап */}
      <div className={`support-popup ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
        <h4 className="support-title">Возникли вопросы?</h4>
        <p className="support-text">
          Наши специалисты всегда готовы помочь с заказом или выбором сыра.
        </p>
        <Link to="/cpp" className="support-link" onClick={() => setIsOpen(false)}>
          Перейти в ЦПП →
        </Link>
      </div>

      {/* Плавающая кнопка */}
      <button 
        className="support-fab" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '💬' : '❓'}
      </button>
    </div>
  );
}