import { motion } from 'framer-motion';
import { fadeUp, stagger } from './variants';

// <Stagger> wraps a group; each <StaggerItem> inside animates one after another.
export function Stagger({ children, gap = 0.08, delay = 0, className = '', once = true, amount = 0.15, ...rest }) {
  return (
    <motion.div
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, variants = fadeUp, className = '', ...rest }) {
  return (
    <motion.div className={className} variants={variants} {...rest}>
      {children}
    </motion.div>
  );
}
