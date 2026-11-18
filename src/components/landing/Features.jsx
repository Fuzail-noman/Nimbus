import { motion } from 'framer-motion';
import { Activity, BarChart3, CalendarClock, KanbanSquare, ShieldCheck, Users } from 'lucide-react';
import { Reveal, Stagger, StaggerItem, hoverLift } from '../../animations';

const features = [
  {
    icon: KanbanSquare,
    title: 'Drag-and-drop boards',
    text: 'Move work across To do, In progress, Review and Done. Order is saved instantly for the whole team.',
    span: 'lg:col-span-2',
    tone: 'bg-accent-soft text-accent',
    visual: true,
  },
  { icon: BarChart3, title: 'Live analytics', text: 'Completion rate, overdue work and 14-day velocity, always up to date.', tone: 'bg-violet-soft text-violet' },
  { icon: Users, title: 'Built for teams', text: 'Invite teammates by email and assign tasks with a click.', tone: 'bg-mint-soft text-mint' },
  { icon: CalendarClock, title: 'Priorities and due dates', text: 'Flag what is urgent and spot overdue tasks before they slip.', tone: 'bg-amber/15 text-amber' },
  {
    icon: Activity,
    title: 'Activity timeline',
    text: 'A clear feed of who did what and when, across every project you belong to.',
    span: 'lg:col-span-2',
    tone: 'bg-ink/5 text-ink',
  },
  { icon: ShieldCheck, title: 'Secure by default', text: 'Hashed passwords, JWT sessions, rate limiting and strict validation.', tone: 'bg-accent-soft text-accent' },
];

function MiniBoard() {
  return (
    <div className="mt-6 grid grid-cols-3 gap-2.5">
      {[0, 1, 2].map((c) => (
        <div key={c} className="space-y-2 rounded-xl bg-paper p-2">
          {Array.from({ length: c === 1 ? 2 : 3 - c }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: c * 0.3 + i * 0.4 }}
              className="rounded-lg border border-line bg-white p-2"
            >
              <div className="h-1.5 w-3/4 rounded bg-ink/15" />
              <div className="mt-1.5 h-1.5 w-1/2 rounded bg-ink/10" />
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Features</span>
          <h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">Everything a team needs. Nothing it does not.</h2>
          <p className="mt-4 text-lg text-muted">Simple enough to start in minutes, strong enough to run every project you have.</p>
        </Reveal>

        <Stagger className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3" gap={0.09}>
          {features.map(({ icon: Icon, title, text, span = '', tone, visual }) => (
            <StaggerItem key={title} className={span}>
              <motion.div {...hoverLift} className="card group h-full p-7 transition-shadow hover:shadow-[0_24px_50px_-24px_rgba(18,18,26,0.25)]">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 ${tone}`}>
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{text}</p>
                {visual && <MiniBoard />}
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
