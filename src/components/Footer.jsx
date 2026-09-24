import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-footer-bg font-montserrat">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] 2xl:px-[120px] max-w-[1920px] mx-auto pt-10 md:pt-[60px] pb-6 md:pb-[30px]">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr] gap-8 md:gap-10 mb-8 md:mb-10">
          <div className="flex flex-col">
            <div className="font-lora text-[24px] font-bold leading-none text-surface-white mb-5">Сырная палитра</div>
            <p className="text-[14px] leading-[1.6] text-neutral-350 mb-6">
              Крафтовая сыроварня. Делаем<br />
              настоящий сыр из фермерского<br />
              молока без компромиссов в качестве
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                aria-label="ВКонтакте"
                className="text-neutral-350 transition-colors duration-200 hover:text-surface-white inline-flex items-center justify-center"
              >
                <svg
                  width="25"
                  height="15"
                  viewBox="0 0 25 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[25px] h-[15px]"
                  aria-hidden="true"
                >
                  <path
                    d="M23.4193 14.4942H20.7477C19.7374 14.4942 19.433 13.6758 17.6219 11.8636C16.039 10.3381 15.3705 10.1484 14.9701 10.1484C14.4164 10.1484 14.2654 10.3006 14.2654 11.0628V13.4651C14.2654 14.1149 14.0546 14.4954 12.3571 14.4954C10.7102 14.3847 9.11316 13.8844 7.69752 13.0356C6.28188 12.1869 5.08815 11.0139 4.21463 9.61341C2.14128 7.03151 0.698234 4.00191 0 0.765024C0 0.364634 0.152195 0.00170726 0.915512 0.00170726H3.58478C4.27083 0.00170726 4.51785 0.307269 4.78712 1.01322C6.08312 4.82746 8.29463 8.14531 9.19258 8.14531C9.53678 8.14531 9.68663 7.99312 9.68663 7.13497V3.206C9.57307 1.41361 8.62127 1.26259 8.62127 0.614C8.63331 0.442887 8.71158 0.283208 8.83946 0.16888C8.96734 0.0545515 9.13476 -0.00541876 9.30615 0.00170726H13.502C14.0757 0.00170726 14.2654 0.287366 14.2654 0.973414V6.27683C14.2654 6.84932 14.5112 7.03897 14.6845 7.03897C15.0287 7.03897 15.2933 6.84931 15.9243 6.21946C17.2764 4.5695 18.3814 2.73175 19.2047 0.763853C19.2886 0.527323 19.4477 0.324819 19.6577 0.187372C19.8676 0.0499251 20.1169 -0.0148834 20.3672 0.0028779H23.0377C23.8384 0.0028779 24.0082 0.403268 23.8384 0.974585C22.8669 3.15015 21.6651 5.21539 20.2537 7.13497C19.9657 7.574 19.8509 7.80229 20.2537 8.31741C20.5182 8.7178 21.4548 9.49985 22.0835 10.2433C22.999 11.1564 23.7588 12.2124 24.3337 13.3691C24.5631 14.1137 24.1815 14.4942 23.4193 14.4942Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Одноклассники"
                className="text-neutral-350 transition-colors duration-200 hover:text-surface-white inline-flex items-center justify-center"
              >
                <svg
                  width="12"
                  height="20"
                  viewBox="0 0 12 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[12px] h-[20px]"
                  aria-hidden="true"
                >
                  <path
                    d="M5.62249 10.0927C2.86532 10.0927 0.573693 7.80305 0.573693 5.0937C0.573693 2.29065 2.86532 0 5.62347 0C8.47532 0 10.6723 2.28967 10.6723 5.0937C10.6701 5.75249 10.5382 6.40439 10.2841 7.0122C10.0299 7.62001 9.6586 8.17182 9.19122 8.63611C8.72384 9.1004 8.1696 9.4681 7.56012 9.71819C6.95064 9.96828 6.29787 10.0959 5.63909 10.0937L5.62249 10.0927ZM5.62249 2.94456C4.45521 2.94456 3.56706 3.92543 3.56706 5.09467C3.56706 6.26196 4.45521 7.15011 5.62347 7.15011C6.83858 7.15011 7.67988 6.26196 7.67988 5.09467C7.68086 3.92446 6.83858 2.94456 5.62249 2.94456ZM7.63303 14.2524L10.4859 17.0096C11.0471 17.6157 11.0471 18.5038 10.4859 19.065C9.87879 19.6711 8.94281 19.6711 8.47532 19.065L5.62347 16.261L2.86532 19.065C2.58521 19.3451 2.21043 19.4847 1.7888 19.4847C1.46184 19.4847 1.08804 19.3441 0.760107 19.065C0.198912 18.5038 0.198912 17.6157 0.760107 17.0086L3.6588 14.2514C2.61202 13.9413 1.60784 13.5024 0.669339 12.9446C-0.0323982 12.5708 -0.171965 11.6367 0.20184 10.935C0.66934 10.2342 1.51064 10.0478 2.25923 10.5153C3.27289 11.1339 4.43743 11.4612 5.62493 11.4612C6.81244 11.4612 7.97698 11.1339 8.99064 10.5153C9.73922 10.0478 10.6264 10.2342 11.0471 10.935C11.4687 11.6367 11.2803 12.5698 10.6254 12.9446C9.73825 13.5058 8.70955 13.9264 7.63401 14.2534L7.63303 14.2524Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="text-neutral-350 transition-colors duration-200 hover:text-surface-white inline-flex items-center justify-center"
              >
                <svg
                  width="21"
                  height="15"
                  viewBox="0 0 21 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[21px] h-[15px]"
                  aria-hidden="true"
                >
                  <path
                    d="M8.19832 10.2479L13.517 7.17353L8.19832 4.09916V10.2479ZM20.0449 2.2238C20.1781 2.70545 20.2704 3.35106 20.3318 4.1709C20.4036 4.99073 20.4343 5.69783 20.4343 6.31271L20.4958 7.17353C20.4958 9.41782 20.3318 11.0677 20.0449 12.1233C19.7887 13.0456 19.1943 13.64 18.272 13.8962C17.7904 14.0294 16.909 14.1216 15.5563 14.1831C14.2241 14.2548 13.0046 14.2856 11.8773 14.2856L10.2479 14.3471C5.95403 14.3471 3.27933 14.1831 2.22379 13.8962C1.30148 13.64 0.707105 13.0456 0.450908 12.1233C0.317685 11.6416 0.225454 10.996 0.163967 10.1762C0.0922312 9.35634 0.0614874 8.64923 0.0614874 8.03436L0 7.17353C0 4.92924 0.163967 3.27933 0.450908 2.2238C0.707105 1.30148 1.30148 0.707105 2.22379 0.450908C2.70545 0.317685 3.58677 0.225454 4.93949 0.163966C6.27172 0.092231 7.49122 0.0614874 8.61849 0.0614874L10.2479 0C14.5418 0 17.2165 0.163967 18.272 0.450908C19.1943 0.707105 19.7887 1.30148 20.0449 2.2238Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Telegram"
                className="text-neutral-350 transition-colors duration-200 hover:text-surface-white inline-flex items-center justify-center"
              >
                <svg
                  width="17"
                  height="15"
                  viewBox="0 0 17 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[17px] h-[15px]"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.8732 0.0969692C15.0772 0.0111082 15.3005 -0.0185047 15.5198 0.0112124C15.7392 0.0409295 15.9465 0.12889 16.1203 0.26594C16.2941 0.402989 16.428 0.584117 16.508 0.79047C16.5881 0.996823 16.6113 1.22086 16.5754 1.43926L14.7032 12.7959C14.5215 13.8913 13.3196 14.5195 12.3149 13.9739C11.4746 13.5174 10.2264 12.814 9.10369 12.0801C8.54234 11.7128 6.82279 10.5364 7.03412 9.69936C7.21573 8.98364 10.105 6.29411 11.7561 4.69509C12.4041 4.06687 12.1086 3.70447 11.3433 4.28233C9.44297 5.71707 6.39187 7.89891 5.38309 8.51309C4.49319 9.05463 4.02925 9.14709 3.4745 9.05463C2.46242 8.88623 1.52381 8.62536 0.75773 8.30754C-0.277466 7.87827 -0.227109 6.45508 0.756905 6.04068L14.8732 0.0969692Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="font-lora text-[18px] font-semibold text-surface-white mb-5">Связь с нами</div>
            <a href="mailto:hello@cheesecraft.ru" className="block text-[14px] text-neutral-350 no-underline mb-3 transition-colors duration-200 hover:text-surface-white">hello@cheesecraft.ru</a>
            <a href="tel:+74952551533" className="block text-[14px] text-neutral-350 no-underline mb-3 transition-colors duration-200 hover:text-surface-white">+7 495 255 15 33</a>
          </div>
          <div className="flex flex-col">
            <div className="font-lora text-[18px] font-semibold text-surface-white mb-5">В интернет-магазине</div>
            <Link to="/delivery" className="block text-[14px] text-neutral-350 no-underline mb-3 transition-colors duration-200 hover:text-surface-white">Условия доставки</Link>
            <Link to="/returns" className="block text-[14px] text-neutral-350 no-underline mb-3 transition-colors duration-200 hover:text-surface-white">Оплата и возврат</Link>
            <Link to="/faq" className="block text-[14px] text-neutral-350 no-underline mb-3 transition-colors duration-200 hover:text-surface-white">Частые вопросы</Link>
            <Link to="/about" className="block text-[14px] text-neutral-350 no-underline mb-3 transition-colors duration-200 hover:text-surface-white">О нас</Link>
          </div>
        </div>
        <div className="h-px bg-footer-divider mb-6 md:mb-[30px]"></div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <span className="text-[12px] text-neutral-350 text-center sm:text-left">© 2026 Сырная палитра. Все права защищены.</span>
          <Link to="/terms" className="text-[12px] text-neutral-350 no-underline transition-colors duration-200 hover:text-surface-white text-center sm:text-right">
            Пользовательское соглашение
          </Link>
        </div>
      </div>
    </footer>
  );
}
