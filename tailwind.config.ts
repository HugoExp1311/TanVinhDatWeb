import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: {
                        50: '#E6F1F8',
                        100: '#C2DCEB',
                        200: '#9CC6DD',
                        300: '#75AFCF',
                        400: '#4F99C2',
                        500: '#2882B4',
                        600: '#1E6A95',
                        700: '#155177',
                        800: '#0F4C75',
                        900: '#0A3A5C',
                        950: '#062840',
                    },
                    secondary: {
                        50: '#F0FDF4',
                        100: '#DCFCE7',
                        200: '#BBF7D0',
                        300: '#86EFAC',
                        400: '#4ADE80',
                        500: '#22C55E',
                        600: '#16A34A',
                        700: '#15803D',
                        800: '#166534',
                        900: '#14532D',
                    },
                    accent: {
                        DEFAULT: '#FFD700',
                        light: '#FFE552',
                        dark: '#D4AF00',
                    },
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'hero-gradient':
                    'linear-gradient(135deg, #0A3A5C 0%, #0F4C75 35%, #155177 70%, #166534 100%)',
                'subtle-gradient':
                    'linear-gradient(180deg, #F0FDF4 0%, #FFFFFF 100%)',
                'card-glow':
                    'radial-gradient(circle at top right, rgba(34,197,94,0.15), transparent 60%)',
            },
            boxShadow: {
                soft: '0 4px 20px -4px rgba(15, 76, 117, 0.15)',
                glow: '0 0 0 1px rgba(34,197,94,0.2), 0 8px 30px -4px rgba(15,76,117,0.25)',
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.6s ease-out both',
                'fade-in': 'fade-in 0.5s ease-out both',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
