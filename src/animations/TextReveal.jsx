import { motion } from 'framer-motion';
import { ease, stagger } from './variants';

// Word-by-word headline reveal. Words listed in `accentWords` get the accent colour.
export default function TextReveal({
  text,
  as = 'h1',
  delay = 0,
  className = '',
  accentWords = [],
  accentClass = 'text-accent',
}) {
  const Comp = motion[as];
  const words = text.split(' ');

  return (
    <Comp className={className} initial="hidden" animate="show" variants={stagger(0.07, delay)} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} aria-hidden className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block ${accentWords.includes(word.replace(/[.,!?]/g, '')) ? accentClass : ''}`}
            variants={{
              hidden: { y: '115%', rotate: 4 },
              show: { y: 0, rotate: 0, transition: { duration: 0.85, ease } },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Comp>
  );
}
