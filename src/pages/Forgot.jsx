import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Forgot() {
  const { user, requestReset } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setEmailError('Некорректный email');
      return;
    }

    setEmailError('');
    setIsSubmitting(true);

    try {
      const token = await requestReset(trimmedEmail);
      if (import.meta.env.DEV) {
        console.info(`[dev] ссылка сброса: http://localhost:5173/reset?code=${token}`);
      }
      setIsSent(true);
    } catch (err) {
      if (err.message === 'USER_NOT_FOUND' || err === 'USER_NOT_FOUND') {
        setEmailError('Пользователь с таким email не найден');
      } else {
        setEmailError(err.message || 'Ошибка сброса пароля');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#FDFBF7] flex items-center justify-center px-4 py-12 md:py-20 font-montserrat">
      <div className="w-full max-w-[480px] bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 md:p-10">
        {!isSent ? (
          <div>
            <h1 className="font-lora text-[26px] md:text-[28px] font-bold text-[#1A1A1A] mb-2 text-left">
              Восстановление пароля
            </h1>
            <p className="text-neutral-500 text-sm leading-relaxed mb-6 text-left">
              Введите email, указанный при регистрации,
              <br className="hidden sm:inline" /> и мы отправим ссылку для сброса пароля
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-6 text-left">
                <label
                  htmlFor="forgot-email"
                  className="block text-sm font-medium text-[#1A1A1A] mb-2"
                >
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="example@mail.ru"
                  className={`w-full px-4 py-3 rounded-lg border text-sm text-neutral-900 placeholder:text-[#A1A1AA] bg-white focus:outline-none transition-colors ${
                    emailError
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-[#CCCCCC] focus:border-[#4F3422]'
                  }`}
                />
                {emailError && (
                  <p className="text-red-600 text-xs mt-1.5">{emailError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#4F3422] hover:bg-[#6D4C41] active:bg-[#3E291B] text-white py-3.5 px-4 rounded-lg font-medium text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-3"
              >
                {isSubmitting ? 'Сброс пароля...' : 'Сбросить пароль'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="w-full bg-white border border-[#3A3A3A] hover:bg-neutral-50 active:bg-neutral-100 text-[#1A1A1A] py-3.5 px-4 rounded-lg font-medium text-base transition-colors"
              >
                Назад ко входу
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="font-lora text-[26px] md:text-[28px] font-bold text-[#1A1A1A] mb-3">
              Письмо отправлено
            </h1>
            <p className="text-neutral-500 text-sm leading-relaxed mb-8">
              Мы отправили ссылку для восстановления на
              <br className="hidden sm:inline" /> ваш email. Пожалуйста, проверьте папку Спам,
              <br className="hidden sm:inline" /> если письма нет во входящих
            </p>

            <Link
              to="/auth"
              className="w-full block bg-[#4F3422] hover:bg-[#6D4C41] active:bg-[#3E291B] text-white py-3.5 px-4 rounded-lg font-medium text-base transition-colors text-center"
            >
              Вернуться ко входу
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}