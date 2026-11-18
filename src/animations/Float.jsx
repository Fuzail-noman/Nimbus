import { motion } from 'framer-motion';

// Gently bobs its children up and down forever.
export default function Float({ children, amount = 10, duration = 5, delay = 0, rotate = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amount, 0], rotate: rotate ? [0, rotate, 0] : 0 }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
