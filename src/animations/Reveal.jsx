import { motion } from 'framer-motion';
import { fadeUp, withDelay } from './variants';

// Fades/slides children in when they scroll into view.
export default function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  as = 'div',
  once = true,
  amount = 0.2,
  className = '',
  ...rest
}) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      variants={delay ? withDelay(variants, delay) : variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
