import { Hexagon, Leaf, Orbit, Mountain, Zap, Waves, Triangle, Flame } from 'lucide-react';
import { Marquee, Reveal } from '../../animations';

const brands = [
  [Hexagon, 'Helix'],
  [Leaf, 'Pinecone'],
  [Orbit, 'Orbit Labs'],
  [Mountain, 'Kestrel'],
  [Zap, 'Voltage'],
  [Waves, 'Northwind'],
  [Triangle, 'Vantage'],
  [Flame, 'Brightside'],
];

export default function LogoCloud() {
  return (
    <section className="border-y border-line bg-white py-10">
      <Reveal className="container-x">
        <p className="mb-7 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted">Trusted by fast-moving teams</p>
        <Marquee>
          {brands.map(([Icon, name]) => (
            <span key={name} className="flex items-center gap-2.5 text-ink/40 transition hover:text-ink">
              <Icon size={24} />
              <span className="font-display text-xl font-bold">{name}</span>
            </span>
          ))}
        </Marquee>
      </Reveal>
    </section>
  );
}
