import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';

interface YesNoButtonProps {
  type: 'yes' | 'no';
  onClick: () => void;
  disabled?: boolean;
  state?: 'default' | 'correct' | 'incorrect';
}

export function YesNoButton({ type, onClick, disabled, state = 'default' }: YesNoButtonProps) {
  
  const config = {
    yes: {
      icon: Check,
      defaultColors: 'bg-green-400 hover:bg-green-500 border-green-600',
      glowColor: 'shadow-green-400',
    },
    no: {
      icon: X,
      defaultColors: 'bg-red-400 hover:bg-red-500 border-red-600',
      glowColor: 'shadow-red-400',
    },
  };

  const buttonConfig = config[type];
  const Icon = buttonConfig.icon;

  const stateColors = {
    default: buttonConfig.defaultColors,
    correct: 'bg-green-500 border-green-700 shadow-2xl shadow-green-400',
    incorrect: 'bg-red-500 border-red-700',
  };

  const shakeAnimation = state === 'incorrect' ? {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  } : {};

  const glowAnimation = state === 'correct' ? {
    boxShadow: [
      '0 0 0px rgba(74, 222, 128, 0)',
      '0 0 40px rgba(74, 222, 128, 0.8)',
      '0 0 60px rgba(74, 222, 128, 1)',
      '0 0 40px rgba(74, 222, 128, 0.8)',
    ],
    transition: { duration: 1, repeat: 2 }
  } : {};

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`relative mt-5 overflow-hidden w-full px-12 py-10 font-bold text-4xl md:text-5xl text-white shadow-2xl border-8 transition-colors duration-100 ease-out ${stateColors[state]} disabled:opacity-50 disabled:cursor-not-allowed`}
      style={{ borderRadius: "48px" }}
      whileHover={!disabled ? { scale: 1.05, y: -5, transition: { duration: 0.1 } } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex items-center justify-center gap-6">
        <div>
          <Icon className="w-20 h-20 md:w-30 md:h-15" strokeWidth={4} />
        </div>
        <span className="text-5xl md:text-3xl"></span>
      </div>

      {state === 'correct' && (
        <motion.div
          className="absolute inset-0 rounded-[3rem] bg-green-300/30"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.8, repeat: 2 }}
        />
      )}
    </motion.button>
  );
}
