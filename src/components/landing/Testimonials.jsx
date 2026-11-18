import { Quote, Star } from 'lucide-react';
import { Reveal, Stagger, StaggerItem, TiltCard } from '../../animations';

const items = [
  { quote: 'We replaced three tools with Nimbus. Standups got shorter because the board already tells the story.', name: 'Hira Malik', role: 'Product Lead, Helix', color: '#6c5ce7' },
  { quote: 'The analytics view is what sold our leadership. One glance and they know where every project stands.', name: 'Daniel Brooks', role: 'Engineering Manager, Kestrel', color: '#ff5b2e' },
  { quote: 'Setup took ten minutes. My team was dragging cards around before the coffee got cold.', name: 'Sana Iqbal', role: 'Founder, Pinecone', color: '#12b886' },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Loved by teams</span>
          <h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">Teams ship more when work is visible</h2>
        </Reveal>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-3" gap={0.12}>
          {items.map((t) => (
            <StaggerItem key={t.name}>
              <TiltCard max={5} className="h-full">
                <figure className="flex h-full flex-col rounded-3xl border border-line bg-paper p-7">
                  <Quote className="text-accent" size={28} />
                  <div className="mt-4 flex gap-0.5 text-amber">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <blockquote className="mt-4 flex-1 text-lg leading-relaxed">{t.quote}</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white" style={{ background: t.color }}>
                      {t.name.split(' ').map((w) => w[0]).join('')}
                    </span>
                    <span>
                      <span className="block text-sm font-bold">{t.name}</span>
                      <span className="block text-xs text-muted">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
