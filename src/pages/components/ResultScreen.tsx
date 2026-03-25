import { motion } from 'motion/react';

interface ResultScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
}

export function ResultScreen({ score, total, onRestart }: ResultScreenProps) {
  const percentage = (score / total) * 100;
  const message =
    percentage >= 80
      ? '🎉 Amazing!'
      : percentage >= 60
      ? '👏 Great Job!'
      : '💪 Keep Practicing!';

  const mascotEmoji =
    percentage >= 80 ? '🌟' : percentage >= 60 ? '😊' : '🤗';

  return (
    <motion.div
      className="bg-white p-8 md:p-12 shadow-2xl max-w-2xl w-full text-center"
      style={{ borderRadius: '24px' }} // ✅ border-radius FIX
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', duration: 0.8 }}
    >
      <motion.div
        className="text-8xl mb-6"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        {mascotEmoji}
      </motion.div>

      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        {message}
      </h2>

      <div className="my-8">
        <div className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
          {score} / {total}
        </div>
        <p className="text-2xl text-gray-600">Questions Correct!</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {Array.from({ length: total }, (_, i) => (
          <motion.span
            key={i}
            className="text-4xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {i < score ? '⭐' : '☆'}
          </motion.span>
        ))}
      </div>

      <motion.button
        onClick={onRestart}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-2xl px-12 py-4 shadow-lg"
        style={{ borderRadius: '9999px' }} // ✅ button radius FIX
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🎮 Play Again!
      </motion.button>
    </motion.div>
  );
}