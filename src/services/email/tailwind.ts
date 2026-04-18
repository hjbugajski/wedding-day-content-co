import { type TailwindConfig, pixelBasedPreset } from 'react-email';
import defaultTheme from 'tailwindcss/defaultTheme';

export const tailwindEmailConfig: TailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    fontFamily: {
      sans: ['Figtree', 'sans-serif', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        black: '#111',
        white: '#fff',
        'dusty-rose': {
          50: '#faf5f7',
          100: '#f7ecf0',
          200: '#f0dae3',
          300: '#e5bccc',
          400: '#d393aa',
          500: '#c3718e',
          600: '#ae546f',
          700: '#a24860',
          800: '#7b394a',
          900: '#683340',
          950: '#3e1922',
        },
      },
    },
  },
};
