import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, CheckCircle2, FolderKanban, ListTodo, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { AnimatedCounter, Stagger, StaggerItem, ease } from '../../animations';
import { PageLoader } from '../../components/ui/Spinner';
import Avatar from '../../components/ui/Avatar';
import { STATUSES, timeAgo } from '../../lib/utils';

const STATUS_COLORS = { todo: '#c9c5bb', in_progress: '#6c5ce7', review: '#f59f00', done: '#12b886' };

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

function StatCard({ icon: Icon, label, value, suffix, tone }) {
  return (
    <StaggerItem>
      <motion.div whileHover={{ y: -4 }} className="card p-5">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><Icon size={18} /></span>
        <p className="mt-4 font-display text-4xl font-extrabold"><AnimatedCounter value={value} suffix={suffix} /></p>
        <p className="mt-1 text-sm font-medium text-muted">{label}</p>
      </motion.div>
    </StaggerItem>
  );
}

export default function Overview() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/analytics/overview'), api.get('/activity', { params: { limit: 8 } })])
      .then(([a, b]) => {
        setData(a.data);
        setActivity(b.data.activity);
      })
      .catch((e) => toast.error(errorMessage(e)));
  }, []);

  if (!data) return <PageLoader />;

  const { totals, series, byStatus, projectProgress } = data;
  const chart = series.map((d) => ({ ...d, label: new Date(d.date + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) }));
  const pie = STATUSES.map((s) => ({ name: s.label, key: s.id, value: byStatus[s.id] })).filter((s) => s.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{greeting()}, {user.name.split(' ')[0]} 👋</h1>
          <p className="mt-1 text-muted">Here is what is happening across your projects.</p>
        </div>
        <Link to="/app/projects" className="btn btn-primary"><Plus size={16} /> New project</Link>
      </div>

      <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4" gap={0.07}>
        <StatCard icon={FolderKanban} label="Active projects" value={totals.projects} tone="bg-accent-soft text-accent" />
        <StatCard icon={ListTodo} label="Open tasks for you" value={totals.myOpen} tone="bg-violet-soft text-violet" />
        <StatCard icon={CheckCircle2} label="Completion rate" value={totals.completionRate} suffix="%" tone="bg-mint-soft text-mint" />
        <StatCard icon={AlertTriangle} label="Overdue tasks" value={totals.overdue} tone="bg-red-50 text-red-600" />
      </Stagger>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, ease }} className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Team velocity</h2>
              <p className="text-xs text-muted">Tasks created vs completed, last 14 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-accent" />Completed</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-violet" />Created</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart} margin={{ top: 5, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="gDone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff5b2e" stopOpacity={0.35} /><stop offset="100%" stopColor="#ff5b2e" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gNew" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6c5ce7" stopOpacity={0.25} /><stop offset="100%" stopColor="#6c5ce7" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e3d9" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b6b78' }} axisLine={false} tickLine={false} interval={2} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6b6b78' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e8e3d9', fontSize: 12 }} />
                <Area type="monotone" dataKey="created" name="Created" stroke="#6c5ce7" strokeWidth={2.5} fill="url(#gNew)" />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="#ff5b2e" strokeWidth={2.5} fill="url(#gDone)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, ease }} className="card p-5">
          <h2 className="text-lg font-bold">Tasks by status</h2>
          {pie.length === 0 ? (
            <p className="mt-10 text-center text-sm text-muted">No tasks yet.</p>
          ) : (
            <>
              <div className="relative h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pie} dataKey="value" innerRadius={54} outerRadius={78} paddingAngle={3} stroke="none">
                      {pie.map((s) => <Cell key={s.key} fill={STATUS_COLORS[s.key]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e8e3d9', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                  <div><p className="font-display text-3xl font-extrabold">{totals.tasks}</p><p className="text-[11px] text-muted">total</p></div>
                </div>
              </div>
              <ul className="mt-3 space-y-2">
                {STATUSES.map((s) => (
                  <li key={s.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[s.id] }} />{s.label}</span>
                    <span className="font-bold">{byStatus[s.id]}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Project progress</h2>
            <Link to="/app/projects" className="text-xs font-semibold text-accent hover:underline">View all</Link>
          </div>
          {projectProgress.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Create a project to see progress here.</p>
          ) : (
            <ul className="space-y-5">
              {projectProgress.map((p, i) => {
                const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
                return (
                  <li key={p._id}>
                    <Link to={`/app/projects/${p._id}`} className="group block">
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-semibold group-hover:text-accent"><span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />{p.name}</span>
                        <span className="text-xs font-semibold text-muted">{p.done}/{p.total} · {pct}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-ink/8">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.9, ease }} className="h-full rounded-full" style={{ background: p.color }} />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <h2 className="mb-4 text-lg font-bold">Recent activity</h2>
          {activity.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Activity will show up here as your team works.</p>
          ) : (
            <Stagger className="space-y-4" gap={0.05} amount={0.05}>
              {activity.map((a) => (
                <StaggerItem key={a._id} className="flex items-start gap-3">
                  <Avatar user={a.user} size="sm" />
                  <div className="min-w-0 flex-1 text-sm">
                    <p><span className="font-bold">{a.user?.name}</span> {a.message}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.project?.color }} />{a.project?.name} · {timeAgo(a.createdAt)}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </div>
    </div>
  );
}
