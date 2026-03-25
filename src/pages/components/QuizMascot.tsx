import { motion } from 'motion/react';


interface QuizMascotProps {
  mood: 'happy' | 'excited' | 'thinking';
}

export function QuizMascot({ mood }: QuizMascotProps) {
  const animations = {
    happy: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
    },
    excited: {
      scale: [1, 1.1, 1],
      rotate: [0, 10, -10, 0],
    },
    thinking: {
      rotate: [-5, 5, -5],
    },
  };

  return (
    <motion.div
      className="relative"
      animate={animations[mood]}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-5xl md:text-6xl">🦊</span>
      </div>
      {mood === 'thinking' && (
        <motion.div
          className="absolute -top-2 -right-2 text-3xl"
          animate={{ scale: [0, 1, 1], rotate: [0, 0, 20] }}
          transition={{ duration: 0.5 }}
        >
          💭
        </motion.div>
      )}
    </motion.div>
  );
}
