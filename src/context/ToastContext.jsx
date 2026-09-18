import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback((text, type = 'error') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 10000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed top-24 right-6 z-[60] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          return (
            <div
              key={toast.id}
              className="pointer-events-auto bg-surface-white border border-neutral-250-a80 rounded-radius-lg shadow-shadow-header px-5 py-4 text-[14px] font-montserrat text-neutral-black flex items-center justify-between gap-3 toast-enter"
            >
              <div className="flex items-center gap-2.5">
                {isSuccess ? (
                  <svg
                    className="w-5 h-5 text-success-600 shrink-0"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="10" cy="10" r="8" />
                    <path d="M6 10l3 3 5-6" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-danger-700 shrink-0"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="10" cy="10" r="8" />
                    <path d="M7.5 7.5l5 5M12.5 7.5l-5 5" />
                  </svg>
                )}
                <span>{toast.text}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-neutral-black hover:opacity-70 transition-opacity ml-2 text-base leading-none focus:outline-none"
                aria-label="Закрыть уведомление"
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

