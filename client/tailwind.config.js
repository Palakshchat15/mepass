/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#c41e3a',
                    light: '#e63946',
                    dark: '#9a1830'
                },
                dark: {
                    DEFAULT: '#0a0a0a',
                    100: '#121212',
                    200: '#1a1a1a',
                    300: '#252525',
                    400: '#2a2a2a',
                    500: '#333333'
                }
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease',
                'slide-up': 'slideUp 0.3s ease',
                'spin-slow': 'spin 0.8s linear infinite'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                }
            }
        }
    },
    plugins: []
}
