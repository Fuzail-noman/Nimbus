import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Stagger, StaggerItem } from '../../animations';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/Spinner';

export default function Team() {
  const { user } = useAuth();
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    api.get('/projects').then((r) => setProjects(r.data.projects)).catch((e) => { toast.error(errorMessage(e)); setProjects([]); });
  }, []);

  // Everyone you share at least one project with.
  const people = useMemo(() => {
    const map = new Map();
    (projects || []).forEach((p) =>
      p.members.forEach((m) => {
        const entry = map.get(m._id) || { user: m, projects: [] };
        entry.projects.push(p);
        map.set(m._id, entry);
      })
    );
    return [...map.values()].sort((a, b) => (a.user._id === user._id ? -1 : b.user._id === user._id ? 1 : a.user.name.localeCompare(b.user.name)));
  }, [projects, user._id]);

  if (!projects) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Team</h1>
        <p className="mt-1 text-muted">{people.length} {people.length === 1 ? 'person' : 'people'} across your projects. Add members from inside a project.</p>
      </div>

      {people.length === 0 ? (
        <EmptyState icon={Users} title="No teammates yet" text="Open a project and use Manage team to invite people by email." action={<Link to="/app/projects" className="btn btn-primary">Go to projects</Link>} />
      ) : (
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" gap={0.06} amount={0.05}>
          {people.map(({ user: m, projects: list }) => (
            <StaggerItem key={m._id}>
              <div className="card h-full p-5">
                <div className="flex items-center gap-3">
                  <Avatar user={m} size="lg" />
                  <div className="min-w-0">
                    <p className="truncate font-bold">{m.name}{m._id === user._id && <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 align-middle text-[10px] font-bold text-accent">You</span>}</p>
                    <p className="flex items-center gap-1.5 truncate text-xs text-muted"><Mail size={12} />{m.email}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {list.map((p) => (
                    <Link key={p._id} to={`/app/projects/${p._id}`} className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs font-semibold transition hover:border-ink/40">
                      <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />{p.name}
                    </Link>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
