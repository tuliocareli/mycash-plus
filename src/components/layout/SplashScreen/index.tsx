import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC = () => {
    const [phase, setPhase] = useState<'intro' | 'coin' | 'exit'>('intro');
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Fase 1: Intro -> Coin (Transição para o porco com moeda + brilho)
        const t1 = setTimeout(() => {
            setPhase('coin');
        }, 900);

        // Fase 2: Exit (Fade out suave revelando a tela inicial)
        const t2 = setTimeout(() => {
            setPhase('exit');
        }, 2100);

        // Fase 3: Desmonta do DOM
        const t3 = setTimeout(() => {
            setShouldRender(false);
        }, 2800);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    if (!shouldRender) return null;

    return (
        <div 
            className={`
                fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#DFFE35]
                transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]
                ${phase === 'exit' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}
            `}
        >
            <div className="relative flex items-center justify-center w-40 h-40">
                {/* Efeito de Brilho Dinâmico (Sparkle pseudo-3D glow) */}
                <div 
                    className={`
                        absolute inset-0 flex items-center justify-center z-0
                        transition-all duration-500 ease-out
                        ${phase === 'coin' ? 'opacity-100 scale-150 rotate-45' : 'opacity-0 scale-50 rotate-0'}
                    `}
                >
                    <div className="w-[120%] h-[120%] bg-white/50 blur-[20px] rounded-full" />
                </div>

                {/* Porco 1 (Intro) */}
                <img 
                    src="/porco%201.svg" 
                    alt="Porco Base" 
                    className={`
                        absolute w-full h-full object-contain z-10
                        transition-all duration-300 ease-in-out origin-center
                        ${phase === 'intro' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                        ${phase === 'intro' ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''}
                    `}
                />

                {/* Porco 2 (Moeda) */}
                <img 
                    src="/porco%202.svg" 
                    alt="Porco Moeda" 
                    className={`
                        absolute w-full h-full object-contain z-20
                        transition-all duration-500 origin-center
                        ${phase === 'coin' || phase === 'exit' 
                            ? 'opacity-100 scale-100 rotate-0 ease-[cubic-bezier(0.34,1.56,0.64,1)]' 
                            : 'opacity-0 scale-50 -rotate-12 ease-in'}
                    `}
                />
            </div>

            {/* Texto base ". " substituto do PURSO */}
            <div className={`
                absolute bottom-12 transition-all duration-500 delay-100
                ${phase === 'exit' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
            `}>
                <span className="font-['Bebas_Neue'] text-3xl font-black tracking-widest text-[#000000]/20">
                    .
                </span>
            </div>
        </div>
    );
};
