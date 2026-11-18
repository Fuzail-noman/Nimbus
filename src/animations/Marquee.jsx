import { motion } from 'framer-motion';

// Infinite horizontal scroller. Children are duplicated so the loop is seamless.
export default function Marquee({ children, duration = 28, className = '' }) {
  return (
    <div className={`flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] ${className}`}>
      <motion.div
        className="flex shrink-0 items-center gap-14 pr-14"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        style={{ width: 'max-content' }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
