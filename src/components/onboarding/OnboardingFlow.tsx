import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronRight, Check } from 'lucide-react';
import Svg1 from './svgs/Svg1';
import Svg2 from './svgs/Svg2';
import Svg3 from './svgs/Svg3';
import Svg4 from './svgs/Svg4';
import Svg5 from './svgs/Svg5';
import './OnboardingAnimations.css';

const steps = [
  {
    id: 1,
    title: 'Controle seu dinheiro',
    description: 'Gestão inteligente para você nunca mais fechar o mês no vermelho.',
    Svg: Svg1,
  },
  {
    id: 2,
    title: 'Poupe com facilidade',
    description: 'Guarde pequenas quantias em caixinhas e veja suas economias crescerem.',
    Svg: Svg2,
  },
  {
    id: 3,
    title: 'Entenda seus gastos',
    description: 'Categorias automáticas e alertas de onde seu dinheiro está indo.',
    Svg: Svg3,
  },
  {
    id: 4,
    title: 'Seus cartões unificados',
    description: 'Acompanhe faturas e limites em tempo real de forma centralizada.',
    Svg: Svg4,
  },
  {
    id: 5,
    title: 'Pronto para decolar?',
    description: 'Sua jornada para a independência financeira começa agora.',
    Svg: Svg5,
  },
];

export function OnboardingFlow() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    
    // Check if the user is the special exception
    const userEmail = user?.email?.toLowerCase() || '';
    
    if (userEmail === 'tctulio2009@gmail.com') {
      setShow(true);
      return;
    }

    // Check localStorage for other users
    const hasSeenOnboarding = localStorage.getItem('onboarding_completed');
    if (!hasSeenOnboarding) {
      setShow(true);
    }
  }, [user]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Only set to true for users other than tctulio2009@gmail.com
    // Although setting it won't affect the specific email, it's best practice
    localStorage.setItem('onboarding_completed', 'true');
    setShow(false);
  };

  if (!show) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4" style={{ zIndex: 99999 }}>
      <motion.div 
        className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[500px]"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Progress Indicators */}
        <div className="px-6 pt-6 pb-2 flex gap-2 w-full max-w-[240px] mx-auto justify-center">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${
                index <= currentStep ? 'bg-[var(--brand-500)]' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="w-full flex-1 flex flex-col items-center justify-center"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="w-full max-w-[280px] aspect-square onboarding-svg-wrapper mb-8 flex items-center justify-center relative">
                <step.Svg className={`w-full h-full drop-shadow-xl transition-transform duration-500 ${currentStep === 2 ? 'scale-[1.35] translate-y-2' : ''}`} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {step.title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-[300px]">
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        <div className="p-6 bg-gray-50/50 dark:bg-gray-800/80 flex justify-between items-center border-t border-gray-100 dark:border-gray-700">
          <button 
            onClick={handleComplete}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium px-4 py-2 transition-colors focus:outline-none"
          >
            Pular
          </button>
          
          <button 
            onClick={handleNext}
            className="flex items-center justify-center gap-2 bg-[var(--brand-500)] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[var(--brand-500)]/25 focus:outline-none"
            style={{ backgroundColor: 'var(--brand-500)' }}
          >
            {currentStep === steps.length - 1 ? (
              <>Começar <Check className="w-5 h-5" /></>
            ) : (
              <>Próximo <ChevronRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
