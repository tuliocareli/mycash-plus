import React, { useEffect, useState } from 'react';

/**
 * Splash Screen premium para o Purso.
 * Exibe o ícone oficial em branco com um efeito de brilho animado no fundo verde lima.
 */
export const SplashScreen: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Tempo para exibição da marca (2.5 segundos)
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2200);

        // Remove do DOM após a animação de saída
        const removeTimer = setTimeout(() => {
            setShouldRender(false);
        }, 2800);

        return () => {
            clearTimeout(timer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!shouldRender) return null;

    return (
        <div 
            className={`
                fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#DFFE35]
                transition-all duration-700 ease-in-out
                ${isVisible ? 'opacity-100' : 'opacity-0 scale-110 pointer-events-none'}
            `}
        >
            <div className="relative">
                {/* Ícone Purso (Forçado para Branco via CSS Filter) */}
                <div className="relative animate-pulse-slow">
                    <img 
                        src="/purso-icon.svg" 
                        alt="Purso" 
                        className="w-32 h-32 brightness-0 invert" 
                    />
                    
                    {/* Efeito de Brilho Extras (Sparkle) */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/40 blur-xl rounded-full animate-ping" />
                </div>
            </div>

            {/* Footer / Slogan */}
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
                .animate-pulse-slow {
                    animation: pulse-slow 2s infinite ease-in-out;
                }
            `}} />
        </div>
    );
};
