import React, { useState } from 'react';
import { Navigate, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Auth() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Некорректный email';
    }

    if (!password) {
      newErrors.password = 'Введите пароль';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await login(email.trim(), password, remember);
      const next = searchParams.get('next') || '/';
      navigate(next);
    } catch (err) {
      if (err.message === 'USER_NOT_FOUND') {
        setErrors({ email: 'Пользователь не найден' });
      } else if (err.message === 'WRONG_PASSWORD') {
        setErrors({ password: 'Неверный пароль' });
      } else {
        setErrors({ form: err.message || 'Ошибка входа' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  // Регистрация
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAgree, setRegAgree] = useState(false);
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regErrors, setRegErrors] = useState({});
  const [isRegSubmitting, setIsRegSubmitting] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!regName.trim()) {
      newErrors.name = 'Введите имя';
    }

    if (!regEmail.trim()) {
      newErrors.email = 'Введите email';
    } else if (!emailRegex.test(regEmail.trim())) {
      newErrors.email = 'Некорректный email';
    }

    if (!regPassword) {
      newErrors.password = 'Введите пароль';
    } else if (regPassword.length < 6) {
      newErrors.password = 'Пароль не короче 6 символов';
    }

    if (!regAgree) {
      newErrors.agree = 'Нужно согласие с политикой';
    }

    if (Object.keys(newErrors).length > 0) {
      setRegErrors(newErrors);
      return;
    }

    setRegErrors({});
    setIsRegSubmitting(true);

    try {
      await register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
      });
      const next = searchParams.get('next') || '/';
      navigate(next);
    } catch (err) {
      if (err.message === 'EMAIL_TAKEN') {
        setRegErrors({ email: 'Пользователь с таким email уже существует' });
      } else {
        setRegErrors({ form: err.message || 'Ошибка регистрации' });
      }
    } finally {
      setIsRegSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#FDFBF7] flex items-center justify-center px-4 py-12 md:py-20 font-montserrat">
      <div className="w-full max-w-[450px] bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 md:p-10">
        <div className="flex items-center gap-7 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`font-lora text-[26px] md:text-[28px] leading-tight pb-1 border-b-2 transition-colors ${
              activeTab === 'login'
                ? 'text-[#1A1A1A] border-[#1A1A1A]'
                : 'text-[#C4C4C4] border-transparent hover:text-neutral-600'
            }`}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`font-lora text-[26px] md:text-[28px] leading-tight pb-1 border-b-2 transition-colors ${
              activeTab === 'register'
                ? 'text-[#1A1A1A] border-[#1A1A1A]'
                : 'text-[#C4C4C4] border-transparent hover:text-neutral-600'
            }`}
          >
            Регистрация
          </button>
        </div>

        {activeTab === 'register' ? (
          <form onSubmit={handleRegisterSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="reg-name" className="block text-sm text-neutral-700 mb-2">
                Имя
              </label>
              <input
                id="reg-name"
                type="text"
                value={regName}
                onChange={(e) => {
                  setRegName(e.target.value);
                  if (regErrors.name) setRegErrors((prev) => ({ ...prev, name: '' }));
                }}
                placeholder="Иван"
                className={`w-full px-4 py-3 rounded-lg border text-sm text-neutral-900 placeholder:text-[#A1A1AA] bg-white focus:outline-none transition-colors ${
                  regErrors.name ? 'border-red-500 focus:border-red-600' : 'border-[#CCCCCC] focus:border-[#4F3422]'
                }`}
              />
              {regErrors.name && <p className="text-xs text-red-600 mt-1.5">{regErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm text-neutral-700 mb-2">
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                value={regEmail}
                onChange={(e) => {
                  setRegEmail(e.target.value);
                  if (regErrors.email) setRegErrors((prev) => ({ ...prev, email: '' }));
                }}
                placeholder="example@mail.ru"
                className={`w-full px-4 py-3 rounded-lg border text-sm text-neutral-900 placeholder:text-[#A1A1AA] bg-white focus:outline-none transition-colors ${
                  regErrors.email ? 'border-red-500 focus:border-red-600' : 'border-[#CCCCCC] focus:border-[#4F3422]'
                }`}
              />
              {regErrors.email && <p className="text-xs text-red-600 mt-1.5">{regErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm text-neutral-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={regShowPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => {
                    setRegPassword(e.target.value);
                    if (regErrors.password) setRegErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-11 rounded-lg border text-sm text-neutral-900 placeholder:text-[#A1A1AA] bg-white focus:outline-none transition-colors ${
                    regErrors.password ? 'border-red-500 focus:border-red-600' : 'border-[#CCCCCC] focus:border-[#4F3422]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setRegShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800 p-1 transition-colors"
                  aria-label={regShowPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
              {regErrors.password && <p className="text-xs text-red-600 mt-1.5">{regErrors.password}</p>}
            </div>

            <div>
              <label htmlFor="reg-agree" className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  id="reg-agree"
                  type="checkbox"
                  checked={regAgree}
                  onChange={(e) => {
                    setRegAgree(e.target.checked);
                    if (regErrors.agree) setRegErrors((prev) => ({ ...prev, agree: '' }));
                  }}
                  className="sr-only"
                />
                <div
                  className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition-colors flex-shrink-0 ${
                    regAgree ? 'bg-[#4F3422] border-[#4F3422]' : regErrors.agree ? 'border-red-500 bg-white' : 'border-[#CCCCCC] bg-white'
                  }`}
                >
                  {regAgree && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2.5 6 4.8 8.5 9.5 3.5" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-neutral-800">Я согласен с политикой конфиденциальности</span>
              </label>
              {regErrors.agree && <p className="text-xs text-red-600 mt-1.5">{regErrors.agree}</p>}
            </div>

            {regErrors.form && <p className="text-xs text-red-600">{regErrors.form}</p>}

            <button
              type="submit"
              disabled={isRegSubmitting}
              className="w-full bg-[#4F3422] hover:bg-[#6D4C41] active:bg-[#3E291B] text-white py-3.5 px-4 rounded-lg font-medium text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isRegSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="auth-email" className="block text-sm text-neutral-700 mb-2">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="example@mail.ru"
                className={`w-full px-4 py-3 rounded-lg border text-sm text-neutral-900 placeholder:text-[#A1A1AA] bg-white focus:outline-none transition-colors ${
                  errors.email ? 'border-red-500 focus:border-red-600' : 'border-[#CCCCCC] focus:border-[#4F3422]'
                }`}
              />
              {errors.email && <p className="text-xs text-red-600 mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-sm text-neutral-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-11 rounded-lg border text-sm text-neutral-900 placeholder:text-[#A1A1AA] bg-white focus:outline-none transition-colors ${
                    errors.password ? 'border-red-500 focus:border-red-600' : 'border-[#CCCCCC] focus:border-[#4F3422]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800 p-1 transition-colors"
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1.5">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label htmlFor="auth-remember" className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  id="auth-remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition-colors ${
                    remember ? 'bg-[#4F3422] border-[#4F3422]' : 'border-[#CCCCCC] bg-white'
                  }`}
                >
                  {remember && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2.5 6 4.8 8.5 9.5 3.5" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-neutral-800">Запомнить меня</span>
              </label>

              <Link to="/forgot" className="text-sm text-neutral-600 hover:text-neutral-900 underline transition-colors">
                Забыли пароль?
              </Link>
            </div>

            {errors.form && <p className="text-xs text-red-600">{errors.form}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#4F3422] hover:bg-[#6D4C41] active:bg-[#3E291B] text-white py-3.5 px-4 rounded-lg font-medium text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Вход...' : 'Войти'}
            </button>

            <p
              onClick={() => {
                setEmail('demo@cheesecraft.ru');
                setPassword('demo1234');
                setErrors({});
              }}
              className="text-xs text-neutral-400 hover:text-neutral-600 text-center pt-1 cursor-pointer select-none transition-colors"
              title="Кликните, чтобы заполнить"
            >
              Демо: demo@cheesecraft.ru / demo1234
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
