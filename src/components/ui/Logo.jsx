import { Link } from 'react-router-dom';

export default function Logo({ to = '/', light = false, size = 'md' }) {
  const box = size === 'lg' ? 'h-10 w-10' : 'h-8 w-8';
  return (
    <Link to={to} className="inline-flex items-center gap-2.5" aria-label="Nimbus home">
      <span className={`${box} grid place-items-center rounded-xl ${light ? 'bg-white' : 'bg-ink'}`}>
        <svg viewBox="0 0 64 64" className="h-5 w-5" fill="none">
          <path d="M20 46V18l24 28V18" stroke="#ff5b2e" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={`font-display text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>Nimbus</span>
    </Link>
  );
}
