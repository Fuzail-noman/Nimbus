import { motion } from 'framer-motion';

const blobs = [
  { className: 'left-[-8%] top-[-10%] h-[28rem] w-[28rem] bg-accent/25', x: [0, 60, 0], y: [0, 40, 0], d: 14 },
  { className: 'right-[-6%] top-[8%] h-[24rem] w-[24rem] bg-violet/20', x: [0, -50, 0], y: [0, 60, 0], d: 17 },
  { className: 'bottom-[-12%] left-[30%] h-[22rem] w-[22rem] bg-mint/15', x: [0, 40, 0], y: [0, -40, 0], d: 19 },
];

// Soft, slowly drifting colour blobs used as a hero / section background.
export default function FloatingBlobs({ className = '' }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${b.className}`}
          animate={{ x: b.x, y: b.y }}
          transition={{ duration: b.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
