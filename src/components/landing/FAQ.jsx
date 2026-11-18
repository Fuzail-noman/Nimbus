import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Reveal } from '../../animations';

const faqs = [
  ['Is there really a free plan?', 'Yes. Starter is free forever and includes 3 projects with up to 3 members each. No credit card is needed to sign up.'],
  ['Can I invite teammates who do not have an account?', 'Teammates need to create a free account first. After that you can add them to any project using their email address.'],
  ['Can I change plans later?', 'Anytime. Upgrade or downgrade from the Billing page and the change applies straight away.'],
  ['How is my data protected?', 'Passwords are hashed with bcrypt, sessions use signed tokens, requests are rate limited and every input is validated on the server.'],
  ['Do you offer discounts for yearly billing?', 'Yes. Paying yearly saves roughly 17% compared with paying month to month.'],
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-x max-w-3xl">
        <Reveal className="text-center">
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">Questions, answered</h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 space-y-3">
          {faqs.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q} className="card overflow-hidden">
                <button onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left" aria-expanded={isOpen}>
                  <span className="font-semibold">{q}</span>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${isOpen ? 'bg-accent text-white' : 'bg-ink/5'}`}>
                    <Plus size={16} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <p className="px-5 pb-5 leading-relaxed text-muted">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
