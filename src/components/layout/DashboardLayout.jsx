import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, FolderKanban, LayoutDashboard, LogOut, Menu, Settings, Sparkles, Users, X } from 'lucide-react';
import Logo from '../ui/Logo';
import Avatar from '../ui/Avatar';
import { PageTransition } from '../../animations';
import { useAuth } from '../../context/AuthContext';

const nav = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/app/projects', label: 'Projects', icon: FolderKanban },
  { to: '/app/team', label: 'Team', icon: Users },
  { to: '/app/billing', label: 'Billing', icon: CreditCard },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

const PLAN_NAMES = { free: 'Starter', pro: 'Pro', business: 'Business' };

function Sidebar({ idPrefix, onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-white p-4">
      <div className="px-2 py-2"><Logo to="/app" /></div>

      <nav className="mt-6 flex-1 space-y-1">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onNavigate} className="relative block rounded-xl">
            {({ isActive }) => (
              <span className={`relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${isActive ? 'text-white' : 'text-ink/65 hover:bg-ink/5 hover:text-ink'}`}>
                {isActive && (
                  <motion.span layoutId={`${idPrefix}-active`} className="absolute inset-0 rounded-xl bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <Icon size={18} className="relative" />
                <span className="relative">{label}</span>
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {user.plan === 'free' && (
        <Link to="/app/billing" onClick={onNavigate} className="mb-3 block rounded-2xl bg-accent-soft p-4 transition hover:bg-accent/20">
          <span className="flex items-center gap-2 text-sm font-bold text-accent"><Sparkles size={16} /> Upgrade to Pro</span>
          <span className="mt-1 block text-xs text-ink/60">Unlock 25 projects and advanced analytics.</span>
        </Link>
      )}

      <div className="flex items-center gap-3 rounded-2xl border border-line p-3">
        <Avatar user={user} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{user.name}</p>
          <p className="truncate text-xs text-muted">{PLAN_NAMES[user.plan]} plan</p>
        </div>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="btn btn-ghost !p-2"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-paper lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line lg:block">
        <Sidebar idPrefix="desk" />
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur lg:hidden">
        <Logo to="/app" />
        <button className="btn btn-ghost !p-2" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
      </header>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div className="absolute inset-0 bg-ink/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              className="absolute inset-y-0 left-0 w-72 shadow-2xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              <button className="btn btn-ghost absolute right-3 top-3 z-10 !p-2" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button>
              <Sidebar idPrefix="mob" onNavigate={() => setOpen(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        <PageTransition key={pathname}>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}
