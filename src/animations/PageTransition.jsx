import { motion } from 'framer-motion';
import { pageVariants } from './variants';

// Wrap a page's content to give it a soft enter animation on every route change.
export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div className={className} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}
