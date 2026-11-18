import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Reveal, Stagger, StaggerItem, hoverLift } from '../../animations';
import { MARKETING_PLANS } from '../../lib/plans';

export default function Pricing() {
  const [cycle, setCycle] = useState('yearly');

  return (
    <section id="pricing" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Pricing</span>
          <h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">Simple plans that grow with you</h2>
          <p className="mt-4 text-lg text-muted">Start free. Upgrade when your team needs more room.</p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-9 flex w-fit items-center rounded-full border border-line bg-white p-1.5">
          {['monthly', 'yearly'].map((c) => (
            <button key={c} onClick={() => setCycle(c)} className="relative cursor-pointer rounded-full px-5 py-2 text-sm font-semibold capitalize">
              {cycle === c && <motion.span layoutId="pricing-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              <span className={`relative flex items-center gap-2 ${cycle === c ? 'text-white' : 'text-ink/70'}`}>
                {c}
                {c === 'yearly' && <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">-17%</span>}
              </span>
            </button>
          ))}
        </Reveal>

        <Stagger className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-3" gap={0.12}>
          {MARKETING_PLANS.map((plan) => (
            <StaggerItem key={plan.id}>
              <motion.div
                {...hoverLift}
                className={`relative flex h-full flex-col rounded-3xl p-7 ${
                  plan.popular ? 'bg-ink text-white shadow-[0_30px_60px_-25px_rgba(18,18,26,0.6)]' : 'card'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3.5 py-1 text-xs font-bold text-white">Most popular</span>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className={`mt-1 text-sm ${plan.popular ? 'text-white/60' : 'text-muted'}`}>{plan.tagline}</p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-display text-5xl font-extrabold">$</span>
                  <div className="relative h-14 overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={cycle}
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -40, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="block font-display text-5xl font-extrabold leading-[3.5rem]"
                      >
                        {plan.price[cycle]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className={`text-sm ${plan.popular ? 'text-white/60' : 'text-muted'}`}>/ month</span>
                </div>
                <p className={`mt-1 h-5 text-xs ${plan.popular ? 'text-white/50' : 'text-muted'}`}>
                  {plan.price.monthly > 0 && cycle === 'yearly' ? `Billed $${plan.price.yearly * 12} per year` : plan.price.monthly > 0 ? 'Billed monthly' : 'Free forever'}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${plan.popular ? 'bg-accent text-white' : 'bg-mint-soft text-mint'}`}>
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link to={`/register?plan=${plan.id}&cycle=${cycle}`} className={`btn mt-8 w-full !py-3 ${plan.popular ? 'btn-primary' : 'btn-dark'}`}>
                  {plan.price.monthly === 0 ? 'Start for free' : `Choose ${plan.name}`}
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
