import { motion } from 'motion/react';
import { Cloud } from 'lucide-react';

export function FloatingClouds() {
  return (
    <>
      {/* Cloud 1 */}
      <motion.div
        className="absolute top-10 left-70 w-32 h-32 pointer-events-none opacity-80"
        animate={{ x: [0, 30, 0], y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Cloud className="w-full h-full text-white drop-shadow-lg" />
      </motion.div>

      {/* Cloud 2 */}
      <motion.div
        className="absolute top-70 right-20 w-24 h-24 pointer-events-none opacity-70"
        animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Cloud className="w-full h-full text-white/90 drop-shadow-lg" />
      </motion.div>

      {/* Cloud 3 */}
      <motion.div
        className="absolute bottom-70 left-32 w-20 h-20 pointer-events-none opacity-60"
        animate={{ x: [0, 25, 0], y: [0, -12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Cloud className="w-full h-full text-white/80 drop-shadow-lg" />
      </motion.div>
    </>
  );
}
