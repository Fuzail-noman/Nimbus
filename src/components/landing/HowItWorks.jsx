import { motion } from 'framer-motion';
import { FolderPlus, ListChecks, Rocket } from 'lucide-react';
import { Reveal, Stagger, StaggerItem, ease } from '../../animations';

const steps = [
  { icon: FolderPlus, title: 'Create a project', text: 'Name it, pick a colour and invite your team by email. It takes less than a minute.' },
  { icon: ListChecks, title: 'Plan the work', text: 'Add tasks, set priorities and due dates, and assign each one to the right person.' },
  { icon: Rocket, title: 'Ship with clarity', text: 'Drag cards as work moves forward and watch progress update in real time.' },
];

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 bg-ink py-20 text-white sm:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow !border-white/15 !bg-white/5 !text-white/70">How it works</span>
          <h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">From idea to shipped in three steps</h2>
        </Reveal>

        <div className="relative mt-16">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.4, ease }}
            className="absolute left-[16%] right-[16%] top-8 hidden h-px origin-left bg-gradient-to-r from-accent via-violet to-mint md:block"
          />
          <Stagger className="grid gap-10 md:grid-cols-3" gap={0.18}>
            {steps.map(({ icon: Icon, title, text }, i) => (
              <StaggerItem key={title} className="relative text-center">
                <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/15 bg-ink-soft text-accent">
                  <Icon size={26} />
                  <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-bold text-white">{i + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold">{title}</h3>
                <p className="mx-auto mt-2 max-w-xs leading-relaxed text-white/60">{text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
