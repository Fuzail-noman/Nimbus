import { AnimatedCounter, Stagger, StaggerItem } from '../../animations';

const stats = [
  { value: 12000, suffix: '+', label: 'Teams on Nimbus' },
  { value: 2.4, suffix: 'M', decimals: 1, label: 'Tasks shipped' },
  { value: 38, suffix: '%', label: 'Faster delivery' },
  { value: 4.9, suffix: '/5', decimals: 1, label: 'Average rating' },
];

export default function Stats() {
  return (
    <section className="py-20">
      <div className="container-x">
        <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="card p-6 text-center">
              <p className="font-display text-4xl font-extrabold text-ink sm:text-5xl">
                <AnimatedCounter value={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
              </p>
              <p className="mt-2 text-sm font-medium text-muted">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
