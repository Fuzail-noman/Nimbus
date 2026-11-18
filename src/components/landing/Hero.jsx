import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { Float, FloatingBlobs, TextReveal, TiltCard, ease } from '../../animations';

const columns = [
  { title: 'To do', dot: 'bg-ink/30', cards: [['Fix broken links', 'Urgent', 'bg-red-50 text-red-600'], ['Set up analytics', 'Medium', 'bg-violet-soft text-violet']] },
  { title: 'In progress', dot: 'bg-violet', cards: [['Scroll animations', 'Medium', 'bg-violet-soft text-violet'], ['Write case study', 'Low', 'bg-ink/5 text-ink/60']] },
  { title: 'Done', dot: 'bg-mint', cards: [['Design hero section', 'High', 'bg-amber/15 text-amber'], ['Audit site speed', 'High', 'bg-amber/15 text-amber']] },
];

function BoardMockup() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_40px_80px_-30px_rgba(18,18,26,0.35)]">
      <div className="flex items-center gap-2 border-b border-line bg-paper px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-mint/60" />
        <span className="ml-3 rounded-md bg-white px-3 py-1 text-[11px] font-medium text-muted">nimbus.app / Website Redesign</span>
      </div>
      <div className="grid grid-cols-3 gap-3 p-4 sm:gap-4 sm:p-5">
        {columns.map((col, ci) => (
          <div key={col.title} className="rounded-2xl bg-paper p-2.5 sm:p-3">
            <div className="mb-2.5 flex items-center gap-2 px-1 text-[11px] font-bold text-ink/70">
              <span className={`h-2 w-2 rounded-full ${col.dot}`} /> {col.title}
            </div>
            <div className="space-y-2.5">
              {col.cards.map(([title, tag, cls], i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + ci * 0.15 + i * 0.12, duration: 0.6, ease }}
                  className="rounded-xl border border-line bg-white p-2.5 shadow-sm"
                >
                  <p className="text-[11px] font-semibold leading-tight sm:text-xs">{title}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${cls}`}>{tag}</span>
                    <span className="h-4 w-4 rounded-full bg-gradient-to-br from-accent to-violet" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="dotted-bg relative overflow-hidden pb-20 pt-32 sm:pt-40">
      <FloatingBlobs />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="eyebrow">
            <span className="h-2 w-2 animate-blink rounded-full bg-mint" />
            New · Drag-and-drop boards with live analytics
          </motion.div>

          <TextReveal
            text="Ship work, not status meetings."
            delay={0.35}
            accentWords={['Ship']}
            className="mt-6 text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.7, ease }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted"
          >
            Nimbus gives your team one calm place to plan projects, assign tasks and see exactly what is moving, without chasing anyone for updates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7, ease }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/register" className="btn btn-primary !px-7 !py-3.5 text-base">
              Start free <ArrowRight size={18} />
            </Link>
            <a href="/#how" className="btn btn-outline !px-7 !py-3.5 text-base">See how it works</a>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="mt-5 text-xs font-medium text-muted">
            No credit card · Free forever plan · Set up in 2 minutes
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 70, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.9, duration: 1, ease }}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          <TiltCard max={4}>
            <BoardMockup />
          </TiltCard>

          <Float className="absolute -left-2 top-16 hidden sm:block lg:-left-14" amount={12} duration={5}>
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-xl">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint-soft text-mint"><CheckCircle2 size={18} /></span>
              <div>
                <p className="text-xs font-bold">Task completed</p>
                <p className="text-[11px] text-muted">Design hero section</p>
              </div>
            </div>
          </Float>

          <Float className="absolute -right-2 bottom-24 hidden sm:block lg:-right-12" amount={14} duration={6} delay={0.8}>
            <div className="rounded-2xl border border-line bg-white px-4 py-3 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold">
                <TrendingUp size={14} className="text-accent" /> Weekly velocity
              </div>
              <div className="mt-2 flex h-10 items-end gap-1">
                {[40, 65, 50, 80, 62, 95, 78].map((h, i) => (
                  <motion.span
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 1.6 + i * 0.07, duration: 0.6, ease }}
                    className="w-2.5 rounded-sm bg-accent/80"
                  />
                ))}
              </div>
            </div>
          </Float>

          <Float className="absolute -top-5 right-10 hidden sm:block" amount={8} duration={4.5} delay={0.4}>
            <div className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white shadow-xl">
              <Sparkles size={14} className="text-accent" /> 3 teammates online
            </div>
          </Float>
        </motion.div>
      </div>
    </section>
  );
}
