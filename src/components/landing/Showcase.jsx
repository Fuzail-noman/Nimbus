import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Reveal, ease } from '../../animations';

const tabs = [
  { id: 'board', label: 'Boards', title: 'See every task at a glance', text: 'Columns that mirror how your team really works. Drag a card and everyone sees the change.' },
  { id: 'analytics', label: 'Analytics', title: 'Know how you are doing', text: 'Velocity, completion rate and overdue work, summarised the moment you open the dashboard.' },
  { id: 'team', label: 'Team', title: 'Everyone in the loop', text: 'Invite people, assign owners and keep a shared record of who is working on what.' },
];

function BoardVisual() {
  const cols = [['To do', 3, 'bg-ink/30'], ['In progress', 2, 'bg-violet'], ['Review', 2, 'bg-amber'], ['Done', 4, 'bg-mint']];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cols.map(([name, n, dot], c) => (
        <div key={name} className="rounded-2xl bg-paper p-3">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold"><span className={`h-2 w-2 rounded-full ${dot}`} />{name}</p>
          <div className="space-y-2">
            {Array.from({ length: n }).map((_, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: c * 0.08 + i * 0.07, ease }} className="rounded-xl border border-line bg-white p-3">
                <div className="h-2 w-4/5 rounded bg-ink/15" />
                <div className="mt-2 h-2 w-2/5 rounded bg-ink/10" />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsVisual() {
  const bars = [30, 55, 42, 70, 58, 85, 64, 92, 75, 60, 88, 100];
  return (
    <div className="rounded-2xl bg-paper p-5">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-muted">Completion rate</p>
          <p className="font-display text-4xl font-extrabold">78%</p>
        </div>
        <span className="rounded-full bg-mint-soft px-3 py-1 text-xs font-bold text-mint">+12% this week</span>
      </div>
      <div className="flex h-44 items-end gap-2">
        {bars.map((h, i) => (
          <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.04, duration: 0.7, ease }} className="flex-1 rounded-t-lg bg-gradient-to-t from-accent to-accent/60" />
        ))}
      </div>
    </div>
  );
}

function TeamVisual() {
  const people = [['Aisha Khan', 82, '#6c5ce7'], ['Omar Siddiqui', 64, '#12b886'], ['Demo User', 91, '#ff5b2e'], ['Sara Ali', 47, '#0984e3']];
  return (
    <div className="space-y-3 rounded-2xl bg-paper p-5">
      {people.map(([name, pct, color], i) => (
        <motion.div key={name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, ease }} className="flex items-center gap-4 rounded-xl border border-line bg-white p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ background: color }}>
            {name.split(' ').map((w) => w[0]).join('')}
          </span>
          <div className="flex-1">
            <div className="flex justify-between text-sm font-semibold"><span>{name}</span><span className="text-muted">{pct}%</span></div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink/10">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease }} className="h-full rounded-full" style={{ background: color }} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const visuals = { board: BoardVisual, analytics: AnalyticsVisual, team: TeamVisual };

export default function Showcase() {
  const [active, setActive] = useState('board');
  const tab = tabs.find((t) => t.id === active);
  const Visual = visuals[active];

  return (
    <section className="py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Product tour</span>
          <h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">One workspace, three superpowers</h2>
        </Reveal>

        <Reveal className="mx-auto mt-10 flex w-fit rounded-full border border-line bg-white p-1.5" delay={0.1}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActive(t.id)} className="relative cursor-pointer rounded-full px-5 py-2 text-sm font-semibold">
              {active === t.id && <motion.span layoutId="showcase-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              <span className={`relative transition-colors ${active === t.id ? 'text-white' : 'text-ink/70'}`}>{t.label}</span>
            </button>
          ))}
        </Reveal>

        <Reveal delay={0.15} className="card mx-auto mt-10 grid max-w-5xl items-center gap-8 p-5 sm:p-8 lg:grid-cols-[0.8fr_1.4fr]">
          <AnimatePresence mode="wait">
            <motion.div key={active + '-copy'} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <h3 className="text-2xl font-bold sm:text-3xl">{tab.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{tab.text}</p>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }}>
              <Visual />
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
