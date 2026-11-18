import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Stagger, StaggerItem, ease } from '../../animations';
import Button from '../../components/ui/Button';
import { PageLoader } from '../../components/ui/Spinner';

const ORDER = { free: 0, pro: 1, business: 2 };

export default function Billing() {
  const { user, setUser } = useAuth();
  const [plans, setPlans] = useState(null);
  const [billing, setBilling] = useState(null);
  const [cycle, setCycle] = useState(user.billingCycle || 'yearly');
  const [busy, setBusy] = useState('');

  const load = () =>
    Promise.all([api.get('/billing/plans'), api.get('/billing')])
      .then(([p, b]) => { setPlans(p.data.plans); setBilling(b.data); })
      .catch((e) => toast.error(errorMessage(e)));

  useEffect(() => { load(); }, []);

  const choose = async (plan) => {
    setBusy(plan.id);
    try {
      const { data } = await api.post('/billing/subscribe', { plan: plan.id, cycle });
      setUser(data.user);
      toast.success(data.message);
      await load();
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy('');
    }
  };

  if (!plans || !billing) return <PageLoader />;

  const { usage } = billing;
  const pct = Math.min(100, Math.round((usage.projects / usage.projectsLimit) * 100));
  const unlimited = usage.projectsLimit >= 1000;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Billing</h1>
        <p className="mt-1 text-muted">Manage your plan and see how much of it you are using.</p>
      </div>

      <div className="card grid gap-6 p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Current plan</p>
          <p className="mt-1 font-display text-4xl font-extrabold">{billing.plan.name}</p>
          <p className="mt-1 text-sm text-muted">
            {billing.renewsAt ? `Renews on ${new Date(billing.renewsAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} (${billing.billingCycle})` : 'Free forever, no renewal.'}
          </p>
        </div>
        <div>
          <div className="mb-2 flex justify-between text-sm font-semibold">
            <span>Projects used</span>
            <span>{usage.projects} / {unlimited ? 'Unlimited' : usage.projectsLimit}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-ink/8">
            <motion.div initial={{ width: 0 }} animate={{ width: `${unlimited ? Math.min(pct, 8) : pct}%` }} transition={{ duration: 0.9, ease }} className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : 'bg-accent'}`} />
          </div>
          {pct >= 100 && !unlimited && <p className="mt-2 text-xs font-semibold text-red-600">You have reached your project limit. Upgrade to create more.</p>}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Choose a plan</h2>
        <div className="flex rounded-full border border-line bg-white p-1">
          {['monthly', 'yearly'].map((c) => (
            <button key={c} onClick={() => setCycle(c)} className="relative cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold capitalize">
              {cycle === c && <motion.span layoutId="bill-cycle" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              <span className={`relative ${cycle === c ? 'text-white' : 'text-ink/70'}`}>{c}</span>
            </button>
          ))}
        </div>
      </div>

      <Stagger className="grid gap-4 lg:grid-cols-3" gap={0.1} amount={0.05}>
        {plans.map((plan) => {
          const current = plan.id === user.plan && (plan.id === 'free' || cycle === billing.billingCycle);
          const samePlanOtherCycle = plan.id === user.plan && !current;
          const label = current ? 'Current plan' : samePlanOtherCycle ? `Switch to ${cycle}` : ORDER[plan.id] > ORDER[user.plan] ? `Upgrade to ${plan.name}` : `Downgrade to ${plan.name}`;
          return (
            <StaggerItem key={plan.id}>
              <div className={`card flex h-full flex-col p-6 ${plan.id === user.plan ? 'border-2 border-accent' : ''}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  {plan.id === user.plan && <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[10px] font-bold text-accent">Active</span>}
                </div>
                <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
                <p className="mt-5"><span className="font-display text-4xl font-extrabold">${plan.price[cycle]}</span><span className="text-sm text-muted"> / month</span></p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm"><Check size={16} className="mt-0.5 shrink-0 text-mint" strokeWidth={3} />{f}</li>
                  ))}
                </ul>
                <Button variant={current ? 'outline' : 'dark'} disabled={current} loading={busy === plan.id} onClick={() => choose(plan)} className="mt-6 w-full">{label}</Button>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      <p className="flex items-center gap-2 rounded-xl bg-white/60 p-3 text-xs text-muted"><Info size={14} className="shrink-0" /> Demo billing: plans switch instantly and no payment is taken. Connect a payment provider such as Stripe to charge real customers.</p>
    </div>
  );
}
