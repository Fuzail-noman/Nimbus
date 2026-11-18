import { motion } from 'framer-motion';
import Spinner from './Spinner';

const variants = { primary: 'btn-primary', dark: 'btn-dark', outline: 'btn-outline', ghost: 'btn-ghost', danger: 'btn-danger' };

export default function Button({ variant = 'primary', loading = false, children, className = '', disabled, ...rest }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={`btn ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </motion.button>
  );
}
