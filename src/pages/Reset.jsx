import React, { useState } from 'react';
import { Navigate, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Reset() {
  const { user, resetPassword } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const code = searchParams.get('code') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!password || password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Повторите пароль';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!code) {
      setGeneralError('Код неверен или устарел');
      return;
    }

    setErrors({});
    setGeneralError('');
    setIsSubmitting(true);

    try {
      await resetPassword(code, password);
      push('Пароль изменён', 'success');
      navigate('/auth');
    } catch (err) {
      if (err.message === 'CODE_INVALID' || err === 'CODE_INVALID') {
        setGeneralError('Код неверен или устарел');
      } else {
        setGeneralError(err.message || 'Ошибка сброса пароля');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#FDFBF7] flex items-center justify-center px-4 py-12 md:py-20 font-montserrat">
      <div className="w-full max-w-[480px] bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 md:p-10">
        <h1 className="font-lora text-[26px] md:text-[28px] font-bold text-[#1A1A1A] mb-6 text-left">
          Новый пароль
        </h1>

        {generalError && (
          <div className="mb-4 text-red-600 text-sm font-medium text-left">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4 text-left">
            <label
              htmlFor="reset-password"
              className="block text-sm font-medium text-[#1A1A1A] mb-2"
            >
              Новый пароль
            </label>
            <input
              id="reset-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                if (generalError) setGeneralError('');
              }}
              placeholder="Минимум 6 символов"
              className={`w-full px-4 py-3 rounded-lg border text-sm text-neutral-900 placeholder:text-[#A1A1AA] bg-white focus:outline-none transition-colors ${
                errors.password
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-[#CCCCCC] focus:border-[#4F3422]'
              }`}
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1.5">{errors.password}</p>
            )}
          </div>

          <div className="mb-6 text-left">
            <label
              htmlFor="reset-confirm"
              className="block text-sm font-medium text-[#1A1A1A] mb-2"
            >
              Повторите пароль
            </label>
            <input
              id="reset-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }
                if (generalError) setGeneralError('');
              }}
              placeholder="Повторите новый пароль"
              className={`w-full px-4 py-3 rounded-lg border text-sm text-neutral-900 placeholder:text-[#A1A1AA] bg-white focus:outline-none transition-colors ${
                errors.confirmPassword
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-[#CCCCCC] focus:border-[#4F3422]'
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1.5">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#4F3422] hover:bg-[#6D4C41] active:bg-[#3E291B] text-white py-3.5 px-4 rounded-lg font-medium text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-3"
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить пароль'}
          </button>

          <Link
            to="/auth"
            className="w-full block bg-white border border-[#3A3A3A] hover:bg-neutral-50 active:bg-neutral-100 text-[#1A1A1A] py-3.5 px-4 rounded-lg font-medium text-base transition-colors text-center"
          >
            Назад ко входу
          </Link>
        </form>
      </div>
    </div>
  );
}