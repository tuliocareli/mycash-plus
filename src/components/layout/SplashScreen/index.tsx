import React, { useEffect, useState } from 'react';

/**
 * Splash Screen corrigida v3.
 * Usa o verde lima oficial (#DFFE35) para pintar os olhos e focinho,
 * criando o efeito de transparência real no porquinho branco.
 */
export const SplashScreen: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);
    const LIME_GREEN = "#DFFE35";

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2200);

        const removeTimer = setTimeout(() => {
            setShouldRender(false);
        }, 2900);

        return () => {
            clearTimeout(timer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!shouldRender) return null;

    return (
        <div 
            className={`
                fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#DFFE35]
                transition-all duration-700 ease-in-out
                ${isVisible ? 'opacity-100' : 'opacity-0 scale-110 pointer-events-none'}
            `}
        >
            <div className="relative animate-pulse-slow">
                <svg 
                    width="140" 
                    height="140" 
                    viewBox="0 0 265.1 249.8" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Corpo do Porquinho (Branco) */}
                    <path fill="#FFFFFF" d="M194.5 75.5c-7.9-3.2-9.2-7.9-14.8-8.9-5.2-1-11.3 1.8-14.4 6-1.2 1.6-1.9 3.3-2.2 5.1-9.7-11.5-22.3-19.5-36.1-19.5s-26.3 8-36.1 19.5c0-.3-.3-.7-.4-1-2.3-4.7-7.8-8.5-13.1-8.4-5.7 0-7.7 4.5-16.1 6.2-4 .8-7.4.7-9.7.4.2 6.1 1.9 10.1 3.5 12.6 2.4 3.9 4 3.6 9.1 9.7 4.4 5.3 4.9 7.4 7.5 8 1.3.3 2.7 0 3.9-.4-2.9 8.2-4.5 16.6-4.5 24.4 0 30.9 25 55.9 55.9 55.9s55.9-25 55.9-55.9-1.7-16.8-4.8-25.3h.8c2.7-.2 3.5-2.2 8.8-6.6 6.1-5.1 7.6-4.6 10.7-8 1.9-2.2 4.4-5.8 5.6-11.8-2.4 0-5.8-.5-9.5-2" />
                    <path fill="#FFFFFF" d="M127.1 187c-31.9 0-57.8-25.9-57.8-57.8s1.2-14.5 3.6-22c-.5 0-1.1 0-1.6-.2-2.4-.6-3.5-2.1-5.2-4.4-.8-1.1-1.8-2.5-3.3-4.3-2.4-2.8-4-4.2-5.3-5.4-1.5-1.3-2.6-2.3-4-4.5-2.3-3.8-3.6-8.3-3.8-13.5v-2.2l2.1.3c3.1.4 6.2.3 9.1-.4 3.8-.8 6.3-2.2 8.4-3.5 2.4-1.4 4.7-2.7 8-2.8 5.3 0 10.8 3.3 13.9 8 10.6-11.7 23.2-18.1 35.7-18.1s24.8 6.2 35.3 17.7c.4-.9.9-1.7 1.5-2.5 3.7-5 10.5-7.8 16.2-6.8 3.3.6 5.3 2.3 7.5 4.1 1.9 1.6 4 3.4 7.7 4.9 2.8 1.1 5.8 1.8 8.9 1.9h2.2l-.4 2.2c-1 5.1-3.1 9.4-6 12.7-1.7 1.9-3.1 2.8-4.7 3.8-1.5.9-3.3 2-6.1 4.4-1.8 1.5-3 2.7-4 3.6-1.6 1.5-2.7 2.6-4.3 3.1 2.7 8.1 4.2 16.3 4.2 23.7 0 31.9-25.9 57.8-57.8 57.8zm-48.3-85.3-1.3 3.8c-2.9 8.1-4.4 16.3-4.4 23.8 0 29.8 24.3 54.1 54.1 54.1s54.1-24.3 54.1-54.1-1.6-16.2-4.7-24.7l-1-2.7 2.9.3h.6c1 0 1.6-.5 3.5-2.4 1-1 2.3-2.3 4.2-3.8 3.1-2.6 5-3.8 6.6-4.7 1.5-.9 2.5-1.5 3.9-3.1 2.1-2.4 3.7-5.4 4.7-8.9-2.8-.3-5.4-1-7.9-2-4.2-1.7-6.7-3.8-8.7-5.5s-3.4-2.9-5.7-3.3c-4.3-.8-9.7 1.5-12.5 5.3-.9 1.3-1.6 2.7-1.9 4.3l-.7 3.8-2.5-3c-10.2-12.1-22.5-18.8-34.6-18.8s-24.4 6.7-34.6 18.8l-2 2.4-1.1-2.9c0-.3-.2-.6-.4-.9-2.1-4.2-7-7.4-11.4-7.4s-4 1-6.2 2.3c-2.3 1.3-5.1 3-9.5 3.9-2.6.6-5.4.8-8.1.6.4 3.7 1.4 6.9 3.1 9.6 1.1 1.8 2 2.5 3.3 3.7 1.4 1.2 3.1 2.7 5.7 5.8 1.6 1.9 2.6 3.3 3.5 4.5 1.6 2.1 2 2.7 3 2.9.8.2 1.8 0 2.8-.3l3.7-1.4z" />
                    
                    {/* Olhos e Focinho (Pintados de Verde para parecer transparente) */}
                    <circle fill={LIME_GREEN} cx="103.9" cy="110.5" r="5.3" />
                    <circle fill={LIME_GREEN} cx="143.9" cy="110.5" r="5.3" />
                    <path fill={LIME_GREEN} d="M126.3 166.6c-4.6 0-9.1-1.2-13.1-3.5-1.7-1-4.9-2.9-7.2-6.8-3.4-5.9-2.7-13-.4-17.3 2.5-4.8 7.9-8.4 14.6-9.8 7.7-1.6 15.7 0 20.8 4.3 5 4.1 9.4 12 7.1 19.5-1.6 5.4-6 8.2-8.1 9.6-4 2.6-8.9 3.9-13.7 3.9Zm-.4-34.3c-1.7 0-3.4.2-5 .5-5.6 1.1-10.1 4.1-12.1 7.9-1.7 3.3-2.3 9 .4 13.7 1.8 3.1 4.3 4.6 5.9 5.4 6.9 4.1 16.4 3.9 23-.4 2-1.3 5.4-3.5 6.6-7.5 1.7-5.6-1.7-12.1-5.9-15.6-3.2-2.6-7.8-4.1-12.7-4.1h-.2Z" />
                    <path fill={LIME_GREEN} d="M117.7 155.3c-.4 0-.7 0-.9-.1-.8-.2-2.3-1.1-2.6-3.8-.2-1.5 0-3.3.6-5.1.5-1.8 1.4-3.4 2.3-4.6 1.8-2.1 3.4-2 4.3-1.8.8.2 2.3 1.1 2.6 3.8.2 1.5 0 3.3-.6 5.1-.5 1.8-1.4 3.4-2.3 4.6-1.3 1.5-2.5 1.9-3.4 1.9m2.6-11.6c-.5.5-1.3 1.6-1.9 3.6s-.5 3.3-.4 4c.5-.5 1.3-1.6 1.9-3.6.6-1.9.5-3.3.4-4" />
                    <path fill={LIME_GREEN} d="M135.6 155.1c-.8 0-1.9-.3-3.2-1.4-1.1-1-2.2-2.5-3-4.2-2-4.3-1.6-8 .8-9.1.8-.4 2.4-.7 4.5 1.2 1.1 1 2.2 2.5 3 4.2 2 4.3 1.6 8-.8 9.1-.3.1-.8.3-1.3.3Zm-3.6-11.2c0 .7 0 2.1.9 3.9.8 1.8 1.8 2.8 2.4 3.3 0-.7 0-2.1-.9-3.9-.8-1.8-1.8-2.8-2.4-3.3" />
                    
                    {/* Brilhos (Branco) */}
                    <path fill="#FFFFFF" d="M171.1 183.3c-2.2-14-3.5-15.3-17.5-17.5v-3.7c14-2.2 15.3-3.5 17.5-17.5h3.7c2.2 14 3.5 15.3 17.5 17.5v3.7c-14 2.2-15.3 3.5-17.5 17.5z" />
                    <path 
                        fill="#FFFFFF"
                        className="animate-sparkle" 
                        d="M172.9 144.9c2.3 14.9 4.2 16.8 19.1 19.1-14.9 2.3-16.8 4.2-19.1 19.1-2.3-14.9-4.2-16.8-19.1-19.1 14.9-2.3 16.8-4.2 19.1-19.1m3.7-.6h-7.3c-1 6.5-1.9 10.3-3.8 12.2s-5.7 2.8-12.2 3.8v7.3c6.5 1 10.3 1.9 12.2 3.8s2.8 5.7 3.8 12.2h7.3c1-6.5 1.9-10.3 3.8-12.2s5.7-2.8 12.2-3.8v-7.3c-6.5-1-10.3-1.9-12.2-3.8s-2.8-5.7-3.8-12.2"
                    />
                </svg>
            </div>

            <div className={`
                absolute bottom-12 transition-all duration-500 delay-300
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}>
                <span className="font-['Bebas_Neue'] text-2xl tracking-widest text-[#000000]/40">
                    PURSO
                </span>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                @keyframes sparkle {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.2; transform: scale(0.7); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 2.5s infinite ease-in-out;
                }
                .animate-sparkle {
                    animation: sparkle 1.2s infinite ease-in-out;
                    transform-origin: 172.9px 144.9px;
                }
            `}} />
        </div>
    );
};
