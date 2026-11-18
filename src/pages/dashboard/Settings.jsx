import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Reveal } from '../../animations';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';

export default function Settings() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [changing, setChanging] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch('/auth/me', { name });
      setUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setChanging(true);
    try {
      await api.patch('/auth/password', pw);
      setPw({ currentPassword: '', newPassword: '' });
      toast.success('Password changed');
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Settings</h1>
        <p className="mt-1 text-muted">Manage your profile and security.</p>
      </div>

      <Reveal className="card p-6">
        <h2 className="text-lg font-bold">Profile</h2>
        <form onSubmit={saveProfile} className="mt-5 space-y-4">
          <div className="flex items-center gap-4">
            <Avatar user={user} size="xl" />
            <p className="text-sm text-muted">Your avatar colour is generated from your account.</p>
          </div>
          <div>
            <label className="label">Full name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={60} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input cursor-not-allowed bg-ink/[0.03]" value={user.email} disabled />
          </div>
          <Button type="submit" loading={saving} disabled={name.trim() === user.name}>Save changes</Button>
        </form>
      </Reveal>

      <Reveal className="card p-6" delay={0.08}>
        <h2 className="text-lg font-bold">Change password</h2>
        <form onSubmit={changePassword} className="mt-5 space-y-4">
          <div>
            <label className="label">Current password</label>
            <input className="input" type="password" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required />
          </div>
          <div>
            <label className="label">New password</label>
            <input className="input" type="password" autoComplete="new-password" minLength={8} value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required placeholder="At least 8 characters" />
          </div>
          <Button type="submit" variant="dark" loading={changing}>Update password</Button>
        </form>
      </Reveal>

      <Reveal className="card flex flex-wrap items-center justify-between gap-4 p-6" delay={0.16}>
        <div>
          <h2 className="text-lg font-bold">Sign out</h2>
          <p className="text-sm text-muted">You will need to sign in again on this device.</p>
        </div>
        <Button variant="danger" onClick={() => { logout(); navigate('/'); }}><LogOut size={16} /> Sign out</Button>
      </Reveal>
    </div>
  );
}
