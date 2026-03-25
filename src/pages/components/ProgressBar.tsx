import { motion } from 'motion/react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = (current / total) * 100;
  const stars = Array.from({ length: total }, (_, i) => i);

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between items-center mb-2">
        {stars.map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: i < current ? 1 : 0.6,
              rotate: i < current ? 0 : -180,
            }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <span className={`text-3xl ${i < current ? '' : 'opacity-30'}`}>
              {i < current ? '⭐' : '☆'}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="h-4 bg-white/30 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <p className="text-center mt-2 font-bold text-white text-lg">
        Question {current} of {total}
      </p>
    </div>
  );
}
