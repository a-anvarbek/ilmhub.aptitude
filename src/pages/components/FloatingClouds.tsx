import { motion } from 'motion/react';

export function FloatingClouds() {
  return (
    <>
      {/* Cloud 1 */}
      <motion.div
        className="absolute top-16 left-10 text-7xl pointer-events-none opacity-80"
        animate={{ x: [0, 30, 0], y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        ☁️
      </motion.div>

      {/* Cloud 2 */}
      <motion.div
        className="absolute top-40 right-20 text-6xl pointer-events-none opacity-70"
        animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        ☁️
      </motion.div>

      {/* Cloud 3 */}
      <motion.div
        className="absolute bottom-40 left-32 text-5xl pointer-events-none opacity-60"
        animate={{ x: [0, 25, 0], y: [0, -12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      >
        ☁️
      </motion.div>
    </>
  );
}
