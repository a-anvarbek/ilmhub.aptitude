import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';

interface QuizCardProps {
  question: string;
  onSoundClick: () => void;
  children: React.ReactNode;
}

export function QuizCard({ question, onSoundClick, children }: QuizCardProps) {
  return (
    <motion.div
      className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-3xl w-full relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      {/* Sound button */}
      <motion.button
        onClick={onSoundClick}
        className="absolute top-4 right-4 md:top-6 md:right-6 bg-purple-400 hover:bg-purple-500 text-white p-3 md:p-4 rounded-full shadow-lg"
        style={{ borderRadius: "9999px" }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        <Volume2 className="w-6 h-6 md:w-8 md:h-8" />
      </motion.button>

      {/* Question */}
      <motion.h2
        className="text-3xl md:text-5xl font-bold text-center mb-10 md:mb-14 text-gray-800 px-12"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {question}
      </motion.h2>

      {/* Answer buttons */}
      {children}
    </motion.div>
  );
}