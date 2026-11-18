import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderKanban, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Stagger, StaggerItem, ease } from '../../animations';
import { AvatarStack } from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { PageLoader } from '../../components/ui/Spinner';
import { PROJECT_COLORS, timeAgo } from '../../lib/utils';

function NewProjectModal({ open, onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', color: PROJECT_COLORS[0] });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/projects', form);
      toast.success('Project created');
      setForm({ name: '', description: '', color: PROJECT_COLORS[0] });
      onClose();
      navigate(`/app/projects/${data.project._id}`);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="New project">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Name</label>
          <input className="input" autoFocus required minLength={2} maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Website redesign" />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-20 resize-none" maxLength={300} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What is this project about?" />
        </div>
        <div>
          <label className="label">Colour</label>
          <div className="flex flex-wrap gap-2.5">
            {PROJECT_COLORS.map((c) => (
              <button key={c} type="button" onClick={() => setForm({ ...form, color: c })} aria-label={`Colour ${c}`} className={`h-8 w-8 cursor-pointer rounded-full transition ${form.color === c ? 'scale-110 ring-2 ring-ink ring-offset-2' : 'hover:scale-110'}`} style={{ background: c }} />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Create project</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api.get('/projects').then((r) => setProjects(r.data.projects)).catch((e) => { toast.error(errorMessage(e)); setProjects([]); });
  }, [open]);

  if (!projects) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Projects</h1>
          <p className="mt-1 text-muted">{projects.length} active {projects.length === 1 ? 'project' : 'projects'}</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={16} /> New project</Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects yet" text="Create your first project to start planning tasks with your team." action={<Button onClick={() => setOpen(true)}><Plus size={16} /> Create project</Button>} />
      ) : (
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" gap={0.07} amount={0.05}>
          {projects.map((p) => {
            const pct = p.taskCount ? Math.round((p.doneCount / p.taskCount) * 100) : 0;
            return (
              <StaggerItem key={p._id}>
                <Link to={`/app/projects/${p._id}`}>
                  <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="card group relative h-full overflow-hidden p-5 transition-shadow hover:shadow-[0_24px_50px_-24px_rgba(18,18,26,0.3)]">
                    <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: p.color }} />
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold transition-colors group-hover:text-accent">{p.name}</h3>
                      {String(p.owner) === user._id && <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-bold text-ink/60">Owner</span>}
                    </div>
                    <p className="mt-1.5 line-clamp-2 min-h-10 text-sm text-muted">{p.description || 'No description yet.'}</p>
                    <div className="mt-5">
                      <div className="mb-1.5 flex justify-between text-xs font-semibold text-muted"><span>{p.doneCount}/{p.taskCount} tasks done</span><span>{pct}%</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-ink/8">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease }} className="h-full rounded-full" style={{ background: p.color }} />
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <AvatarStack users={p.members} />
                      <span className="text-xs text-muted">Updated {timeAgo(p.updatedAt)}</span>
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}

      <NewProjectModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
