import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Calendar, Plus, Search, Settings2, Trash2, UserPlus, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Avatar, { AvatarStack } from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { PageLoader } from '../../components/ui/Spinner';
import { PRIORITIES, PROJECT_COLORS, STATUSES, formatDate, isOverdue, toDateInput } from '../../lib/utils';

const byOrder = (a, b) => a.order - b.order;

/* ---------------------------------- Task modal --------------------------------- */

function TaskModal({ open, task, defaultStatus, members, projectId, onClose, onSaved, onDeleted }) {
  const empty = { title: '', description: '', status: defaultStatus, priority: 'medium', assignee: '', dueDate: '' };
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      task
        ? { title: task.title, description: task.description || '', status: task.status, priority: task.priority, assignee: task.assignee?._id || '', dueDate: toDateInput(task.dueDate) }
        : { ...empty, status: defaultStatus }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, task, defaultStatus]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, assignee: form.assignee || null, dueDate: form.dueDate || null };
    try {
      const { data } = task ? await api.patch(`/tasks/${task._id}`, payload) : await api.post(`/projects/${projectId}/tasks`, payload);
      onSaved(data.task, !task);
      toast.success(task ? 'Task updated' : 'Task added');
      onClose();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    setRemoving(true);
    try {
      await api.delete(`/tasks/${task._id}`);
      onDeleted(task._id);
      toast.success('Task deleted');
      onClose();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit task' : 'New task'}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input className="input" autoFocus required maxLength={140} value={form.title} onChange={set('title')} placeholder="What needs to be done?" />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-24 resize-none" maxLength={2000} value={form.description} onChange={set('description')} placeholder="Add more detail (optional)" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={set('status')}>
              {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select className="input" value={form.priority} onChange={set('priority')}>
              {Object.entries(PRIORITIES).map(([id, p]) => <option key={id} value={id}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Assignee</label>
            <select className="input" value={form.assignee} onChange={set('assignee')}>
              <option value="">Unassigned</option>
              {members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Due date</label>
            <input type="date" className="input" value={form.dueDate} onChange={set('dueDate')} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 pt-2">
          {task ? <Button type="button" variant="danger" loading={removing} onClick={remove}><Trash2 size={15} /> Delete</Button> : <span />}
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={loading}>{task ? 'Save changes' : 'Add task'}</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

/* ---------------------------------- Team modal --------------------------------- */

function TeamModal({ open, onClose, project, isOwner, onChange }) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const add = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post(`/projects/${project._id}/members`, { email });
      onChange(data.project);
      setEmail('');
      toast.success('Teammate added');
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const remove = async (member) => {
    if (!window.confirm(`Remove ${member.name} from this project?`)) return;
    try {
      const { data } = await api.delete(`/projects/${project._id}/members/${member._id}`);
      onChange(data.project, true);
      toast.success('Member removed');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Project team">
      <ul className="space-y-2">
        {project.members.map((m) => (
          <li key={m._id} className="flex items-center gap-3 rounded-xl border border-line p-3">
            <Avatar user={m} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{m.name}{m._id === user._id && <span className="ml-1.5 text-xs font-medium text-muted">(you)</span>}</p>
              <p className="truncate text-xs text-muted">{m.email}</p>
            </div>
            {String(project.owner) === m._id ? (
              <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[10px] font-bold text-accent">Owner</span>
            ) : (
              isOwner && <button onClick={() => remove(m)} className="btn btn-ghost !p-2 hover:!text-red-600" aria-label={`Remove ${m.name}`}><X size={16} /></button>
            )}
          </li>
        ))}
      </ul>

      {isOwner ? (
        <form onSubmit={add} className="mt-5 border-t border-line pt-5">
          <label className="label">Add by email</label>
          <div className="flex gap-2">
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@company.com" />
            <Button type="submit" loading={loading} className="shrink-0"><UserPlus size={16} /> Add</Button>
          </div>
          <p className="mt-2 text-xs text-muted">They need a Nimbus account first. Try aisha@nimbus.app or omar@nimbus.app in the demo.</p>
        </form>
      ) : (
        <p className="mt-5 text-xs text-muted">Only the project owner can add or remove members.</p>
      )}
    </Modal>
  );
}

/* ------------------------------- Project settings ------------------------------ */

function SettingsModal({ open, onClose, project, onChange }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: project.name, description: project.description || '', color: project.color });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setForm({ name: project.name, description: project.description || '', color: project.color });
  }, [open, project]);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch(`/projects/${project._id}`, form);
      onChange(data.project);
      toast.success('Project updated');
      onClose();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${project.name}" and all of its tasks? This cannot be undone.`)) return;
    try {
      await api.delete(`/projects/${project._id}`);
      toast.success('Project deleted');
      navigate('/app/projects', { replace: true });
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Project settings">
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="label">Name</label>
          <input className="input" required minLength={2} maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-20 resize-none" maxLength={300} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <label className="label">Colour</label>
          <div className="flex flex-wrap gap-2.5">
            {PROJECT_COLORS.map((c) => (
              <button key={c} type="button" onClick={() => setForm({ ...form, color: c })} aria-label={`Colour ${c}`} className={`h-8 w-8 cursor-pointer rounded-full transition ${form.color === c ? 'scale-110 ring-2 ring-ink ring-offset-2' : 'hover:scale-110'}`} style={{ background: c }} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="danger" onClick={remove}><Trash2 size={15} /> Delete project</Button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={loading}>Save</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------------ Card ------------------------------------- */

function TaskCard({ task, dragging, indicator, onOpen, onDragStart, onDragEnd, onDragOverCard, onDropOnCard }) {
  const priority = PRIORITIES[task.priority];
  const overdue = isOverdue(task);

  return (
    <motion.div layout="position" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: dragging ? 0.4 : 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }} className="relative">
      {indicator === 'before' && <span className="absolute -top-1.5 inset-x-1 z-10 h-1 rounded-full bg-accent" />}
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', task._id);
          onDragStart(task._id);
        }}
        onDragEnd={onDragEnd}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const r = e.currentTarget.getBoundingClientRect();
          onDragOverCard(task, e.clientY < r.top + r.height / 2 ? 'before' : 'after');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const r = e.currentTarget.getBoundingClientRect();
          onDropOnCard(task, e.clientY < r.top + r.height / 2 ? 'before' : 'after');
        }}
        onClick={() => onOpen(task)}
        className="cursor-grab rounded-xl border border-line bg-white p-3.5 shadow-sm transition hover:border-ink/25 hover:shadow-md active:cursor-grabbing"
      >
        <p className={`text-sm font-semibold leading-snug ${task.status === 'done' ? 'text-ink/50 line-through decoration-ink/25' : ''}`}>{task.title}</p>
        {task.description && <p className="mt-1 line-clamp-2 text-xs text-muted">{task.description}</p>}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${priority.cls}`}>{priority.label}</span>
            {task.dueDate && (
              <span className={`flex items-center gap-1 text-[11px] font-semibold ${overdue ? 'text-red-600' : 'text-muted'}`}>
                <Calendar size={11} />{formatDate(task.dueDate)}
              </span>
            )}
          </div>
          {task.assignee ? <Avatar user={task.assignee} size="xs" /> : <span className="h-5 w-5 rounded-full border border-dashed border-ink/25" title="Unassigned" />}
        </div>
      </div>
      {indicator === 'after' && <span className="absolute -bottom-1.5 inset-x-1 z-10 h-1 rounded-full bg-accent" />}
    </motion.div>
  );
}

/* ------------------------------------ Page ------------------------------------- */

export default function ProjectBoard() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [filters, setFilters] = useState({ q: '', priority: 'all', mine: false });
  const [taskModal, setTaskModal] = useState({ open: false, task: null, status: 'todo' });
  const [teamOpen, setTeamOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);
  const [overCard, setOverCard] = useState(null);

  const loadTasks = () => api.get(`/projects/${id}/tasks`).then((r) => setTasks(r.data.tasks));

  useEffect(() => {
    let active = true;
    setProject(null);
    setTasks(null);
    Promise.all([api.get(`/projects/${id}`), api.get(`/projects/${id}/tasks`)])
      .then(([p, t]) => {
        if (!active) return;
        setProject(p.data.project);
        setTasks(t.data.tasks);
      })
      .catch((e) => {
        toast.error(errorMessage(e));
        navigate('/app/projects', { replace: true });
      });
    return () => { active = false; };
  }, [id, navigate]);

  const columns = useMemo(() => {
    if (!tasks) return [];
    const q = filters.q.trim().toLowerCase();
    const visible = tasks.filter(
      (t) =>
        (!q || t.title.toLowerCase().includes(q)) &&
        (filters.priority === 'all' || t.priority === filters.priority) &&
        (!filters.mine || t.assignee?._id === user._id)
    );
    return STATUSES.map((s) => ({ ...s, tasks: visible.filter((t) => t.status === s.id).sort(byOrder), total: tasks.filter((t) => t.status === s.id).length }));
  }, [tasks, filters, user._id]);

  if (!project || !tasks) return <PageLoader />;

  const isOwner = String(project.owner) === user._id;
  const filtering = filters.q || filters.priority !== 'all' || filters.mine;

  const clearDrag = () => {
    setDragId(null);
    setOverCol(null);
    setOverCard(null);
  };

  // Optimistic move, then persist; reload from the server if it fails.
  const moveTask = (taskId, status, index) => {
    setTasks((prev) => {
      const task = prev.find((t) => t._id === taskId);
      const others = prev.filter((t) => t._id !== taskId);
      const col = others.filter((t) => t.status === status).sort(byOrder);
      col.splice(Math.min(index, col.length), 0, { ...task, status });
      return [...others.filter((t) => t.status !== status), ...col.map((t, i) => ({ ...t, order: i }))];
    });
    api.patch(`/tasks/${taskId}/move`, { status, index }).catch((e) => {
      toast.error(errorMessage(e));
      loadTasks();
    });
  };

  const fullColumn = (status) => tasks.filter((t) => t.status === status && t._id !== dragId).sort(byOrder);

  const dropOnColumn = (status) => {
    if (dragId) moveTask(dragId, status, fullColumn(status).length);
    clearDrag();
  };

  const dropOnCard = (target, pos) => {
    if (dragId && dragId !== target._id) {
      const col = fullColumn(target.status);
      const idx = col.findIndex((t) => t._id === target._id) + (pos === 'after' ? 1 : 0);
      moveTask(dragId, target.status, idx);
    }
    clearDrag();
  };

  const onSaved = (task, isNew) => setTasks((prev) => (isNew ? [...prev, task] : prev.map((t) => (t._id === task._id ? task : t))));
  const onDeleted = (taskId) => setTasks((prev) => prev.filter((t) => t._id !== taskId));
  const onProjectChange = (p, reloadTasks) => {
    setProject(p);
    if (reloadTasks) loadTasks();
  };
  const openTask = (task, status = 'todo') => setTaskModal({ open: true, task, status });

  return (
    <div className="space-y-5">
      <div>
        <Link to="/app/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-ink"><ArrowLeft size={15} /> All projects</Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="flex items-center gap-3 text-3xl font-extrabold sm:text-4xl">
              <span className="h-4 w-4 shrink-0 rounded-full" style={{ background: project.color }} />
              <span className="truncate">{project.name}</span>
            </h1>
            {project.description && <p className="mt-1.5 max-w-2xl text-muted">{project.description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTeamOpen(true)} className="btn btn-outline !py-2">
              <AvatarStack users={project.members} max={3} size="xs" />
              <Users size={15} /> Team
            </button>
            {isOwner && <button onClick={() => setSettingsOpen(true)} className="btn btn-outline !p-2.5" aria-label="Project settings"><Settings2 size={16} /></button>}
            <Button onClick={() => openTask(null, 'todo')}><Plus size={16} /> Add task</Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1 sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input !py-2 !pl-9" placeholder="Search tasks" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        </div>
        <select className="input !w-auto !py-2" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} aria-label="Filter by priority">
          <option value="all">All priorities</option>
          {Object.entries(PRIORITIES).map(([k, p]) => <option key={k} value={k}>{p.label}</option>)}
        </select>
        <button onClick={() => setFilters({ ...filters, mine: !filters.mine })} className={`btn !py-2 ${filters.mine ? 'btn-dark' : 'btn-outline'}`}>My tasks</button>
        {filtering && <button onClick={() => setFilters({ q: '', priority: 'all', mine: false })} className="text-sm font-semibold text-accent hover:underline">Clear filters</button>}
      </div>

      <div className="no-scrollbar -mx-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0">
        <div className="grid min-w-[880px] grid-cols-4 gap-4">
          {columns.map((col) => (
            <div
              key={col.id}
              onDragOver={(e) => { e.preventDefault(); if (dragId) setOverCol(col.id); }}
              onDrop={(e) => { e.preventDefault(); dropOnColumn(col.id); }}
              className={`rounded-2xl p-3 transition-colors ${col.tint} ${dragId && overCol === col.id ? 'ring-2 ring-accent/60' : ''}`}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="flex items-center gap-2 text-sm font-bold">
                  <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />{col.label}
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-bold text-ink/60">{filtering ? `${col.tasks.length}/${col.total}` : col.total}</span>
                </p>
                <button onClick={() => openTask(null, col.id)} className="btn btn-ghost !rounded-lg !p-1.5" aria-label={`Add task to ${col.label}`}><Plus size={16} /></button>
              </div>

              <div className="min-h-24 space-y-2.5">
                <AnimatePresence mode="popLayout" initial={false}>
                  {col.tasks.map((t) => (
                    <TaskCard
                      key={t._id}
                      task={t}
                      dragging={dragId === t._id}
                      indicator={dragId && overCard?.id === t._id && dragId !== t._id ? overCard.pos : null}
                      onOpen={(task) => openTask(task)}
                      onDragStart={setDragId}
                      onDragEnd={clearDrag}
                      onDragOverCard={(task, pos) => {
                        setOverCol(task.status);
                        setOverCard((c) => (c?.id === task._id && c.pos === pos ? c : { id: task._id, pos }));
                      }}
                      onDropOnCard={dropOnCard}
                    />
                  ))}
                </AnimatePresence>
                {col.tasks.length === 0 && (
                  <div className="grid h-20 place-items-center rounded-xl border-2 border-dashed border-ink/10 text-xs font-medium text-muted">
                    {filtering ? 'No matching tasks' : 'Drop tasks here'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-muted">Tip: drag cards between columns on desktop, or open a card to change its status on any device.</p>

      <TaskModal
        open={taskModal.open}
        task={taskModal.task}
        defaultStatus={taskModal.status}
        members={project.members}
        projectId={project._id}
        onClose={() => setTaskModal((m) => ({ ...m, open: false }))}
        onSaved={onSaved}
        onDeleted={onDeleted}
      />
      <TeamModal open={teamOpen} onClose={() => setTeamOpen(false)} project={project} isOwner={isOwner} onChange={onProjectChange} />
      {isOwner && <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} project={project} onChange={onProjectChange} />}
    </div>
  );
}
