/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    500: '#DFFE35', // Lime Neon (Primary)
                    700: '#C4E703', // Citric
                },
                neutral: {
                    0: '#FFFFFF',
                    100: '#F9FAFB',
                    200: '#F3F4F6', // Bg App
                    300: '#E5E7EB', // Border
                    1100: '#080B12', // Text Primary
                },
                semantic: {
                    success: '#15BE78',
                    error: '#E61E32',
                    info: '#2A89EF',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                '2xl': '20px',
                '3xl': '24px',
                'full': '9999px',
                'pill': '100px', // Custom pill shape
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                slideInUp: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'slide-in-up': 'slideInUp 0.3s ease-out',
            }
        },
    },
    plugins: [],
}
