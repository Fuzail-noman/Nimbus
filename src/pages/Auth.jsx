import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { Float, FloatingBlobs, PageTransition, Stagger, StaggerItem } from '../animations';

function Field({ icon: Icon, label, type = 'text', value, onChange, placeholder, autoComplete, right }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <Icon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input className="input !pl-10" type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} required />
        {right}
      </div>
    </div>
  );
}

function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <PageTransition className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h1 className="text-4xl font-extrabold">{title}</h1>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-center text-sm text-muted">{footer}</p>
        </div>
      </PageTransition>

      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <FloatingBlobs className="opacity-70" />
        <div className="relative flex h-full flex-col items-center justify-center p-12 text-white">
          <Float amount={12} duration={6}>
            <div className="w-72 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <p className="text-xs font-semibold text-white/60">This week</p>
              <p className="font-display text-5xl font-extrabold">24 <span className="text-lg text-white/60">tasks done</span></p>
              <div className="mt-4 flex h-16 items-end gap-1.5">
                {[35, 60, 45, 80, 55, 95, 70].map((h, i) => (
                  <motion.span key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.4 + i * 0.07, duration: 0.6 }} className="flex-1 rounded bg-accent" />
                ))}
              </div>
            </div>
          </Float>
          <Stagger className="mt-12 max-w-sm space-y-3 text-center" gap={0.15} delay={0.3}>
            <StaggerItem><p className="font-display text-3xl font-bold leading-tight">Plan clearly. Move fast. Ship together.</p></StaggerItem>
            <StaggerItem><p className="text-white/60">Everything your team needs to stay in sync, in one calm workspace.</p></StaggerItem>
          </Stagger>
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('Welcome back!');
      navigate(location.state?.from || '/app', { replace: true });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('demo@nimbus.app');
    setPassword('Demo@1234');
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to pick up where you left off." footer={<>New to Nimbus? <Link to="/register" className="font-semibold text-accent hover:underline">Create an account</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" autoComplete="email" />
        <Field
          icon={Lock}
          label="Password"
          type={show ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          placeholder="Your password"
          autoComplete="current-password"
          right={<button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted hover:text-ink" aria-label="Toggle password">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
        />
        <Button type="submit" loading={loading} className="w-full !py-3">Sign in</Button>
        <button type="button" onClick={fillDemo} className="w-full cursor-pointer rounded-xl border border-dashed border-line py-2.5 text-xs font-semibold text-muted transition hover:border-accent hover:text-accent">
          Use demo account
        </button>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const { register, setUser } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      const plan = params.get('plan');
      // Picked a paid plan on the pricing section: apply it right after sign-up.
      if (plan && plan !== 'free') {
        const { data } = await api.post('/billing/subscribe', { plan, cycle: params.get('cycle') === 'monthly' ? 'monthly' : 'yearly' });
        setUser(data.user);
        toast.success(data.message);
      } else {
        toast.success('Account created. Welcome to Nimbus!');
      }
      navigate('/app', { replace: true });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Free forever. No credit card required." footer={<>Already have an account? <Link to="/login" className="font-semibold text-accent hover:underline">Sign in</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <Field icon={User} label="Full name" value={form.name} onChange={set('name')} placeholder="Ayesha Khan" autoComplete="name" />
        <Field icon={Mail} label="Work email" type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" autoComplete="email" />
        <Field
          icon={Lock}
          label="Password"
          type={show ? 'text' : 'password'}
          value={form.password}
          onChange={set('password')}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          right={<button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted hover:text-ink" aria-label="Toggle password">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
        />
        <Button type="submit" loading={loading} className="w-full !py-3">Create account</Button>
      </form>
    </AuthShell>
  );
}
