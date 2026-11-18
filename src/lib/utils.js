export const STATUSES = [
  { id: 'todo', label: 'To do', dot: 'bg-ink/30', tint: 'bg-ink/[0.04]' },
  { id: 'in_progress', label: 'In progress', dot: 'bg-violet', tint: 'bg-violet-soft/60' },
  { id: 'review', label: 'In review', dot: 'bg-amber', tint: 'bg-amber/10' },
  { id: 'done', label: 'Done', dot: 'bg-mint', tint: 'bg-mint-soft/70' },
];

export const PRIORITIES = {
  low: { label: 'Low', cls: 'bg-ink/5 text-ink/60' },
  medium: { label: 'Medium', cls: 'bg-violet-soft text-violet' },
  high: { label: 'High', cls: 'bg-amber/15 text-amber' },
  urgent: { label: 'Urgent', cls: 'bg-red-50 text-red-600' },
};

export const PROJECT_COLORS = ['#ff5b2e', '#6c5ce7', '#12b886', '#0984e3', '#f59f00', '#d63031', '#00b8d9', '#12121a'];

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

export function timeAgo(date) {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  const units = [
    ['d', 86400],
    ['h', 3600],
    ['m', 60],
  ];
  for (const [label, size] of units) {
    if (seconds >= size) return `${Math.floor(seconds / size)}${label} ago`;
  }
  return 'just now';
}

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const isOverdue = (task) => task.dueDate && task.status !== 'done' && new Date(task.dueDate) < new Date();

export const toDateInput = (date) => (date ? new Date(date).toISOString().slice(0, 10) : '');
