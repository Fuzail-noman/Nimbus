import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Float } from '../animations';

export default function NotFound() {
  return (
    <div className="dotted-bg grid min-h-screen place-items-center px-6 text-center">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <Float amount={14}>
          <p className="font-display text-8xl font-extrabold text-accent sm:text-9xl">404</p>
        </Float>
        <h1 className="mt-4 text-3xl font-extrabold">This page drifted away</h1>
        <p className="mt-2 text-muted">The page you are looking for does not exist or was moved.</p>
        <Link to="/" className="btn btn-dark mt-8">Back to home</Link>
      </motion.div>
    </div>
  );
}
