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
            spacing: {
                '4': '4px',
                '8': '8px',
                '16': '16px',
                '24': '24px',
                '32': '32px',
                '40': '40px',
                '56': '56px',
            },
            borderRadius: {
                '2xl': '20px',
                '3xl': '24px',
                'full': '9999px',
                'pill': '100px', // Custom pill shape
            }
        },
    },
    plugins: [],
}
