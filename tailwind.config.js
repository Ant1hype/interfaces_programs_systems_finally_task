/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 1.1 Брендовые (коричневая палитра)
        'brand-900': '#4F3422',
        'brand-700': '#6D4C41',
        'brand-outline': '#3A3A3A',
        'accent-gold': '#D4AF37',

        // 1.2 Нейтральные / текст
        'neutral-black': '#000000',
        'neutral-900-alt': '#1A1A1A',
        'neutral-800': '#3E3E3E',
        'neutral-700': '#595959',
        'neutral-600': '#828282',
        'neutral-500': '#808080',
        'neutral-400': '#A1A1AA',
        'neutral-350': '#B3B3B3',
        'neutral-300': '#BDBDBD',
        'neutral-250': '#CCCCCC',
        'neutral-250-a80': 'rgba(204,204,204,0.8)',
        'neutral-disabled': '#9D9D9D',
        'overlay-dark-40': 'rgba(51,51,51,0.4)',
        'overlay-dark-60': 'rgba(58,58,58,0.6)',
        'overlay-gray-50': 'rgba(127,127,127,0.5)',

        // 1.3 Поверхности / фоны
        'surface-white': '#FFFFFF',
        'surface-cream': '#FDFBF7',
        'surface-gray-fill': '#D9D9D9',

        // 1.4 Акцентные / статусные
        'danger-700': '#A61A1A',
        'danger-500': '#CC6666',
        'purple-service': '#8A38F5',

        // 5. Обводки (доп. цвет, не входящий в п.1)
        'border-toggle-off': '#C6C6C8',

        // Доп. цвета компонентов, отсутствующие в DESIGN_TOKENS.md как отдельные
        // токены, но встречающиеся в конкретных фреймах Figma (Футер, #296:1986/#296:1967/#296:1982)
        'footer-bg': '#5E4839',
        'footer-divider': '#757575',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        lora: ['Lora', 'serif'],
        inter: ['Inter', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
      borderRadius: {
        'radius-sm': '4px',
        'radius-md': '8px',
        'radius-lg': '12px',
        'radius-xl': '16px',
        'radius-pill': '20px',
        'radius-service': '5px',
      },
      boxShadow: {
        'shadow-header': '0px 2px 8px 0px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
};
