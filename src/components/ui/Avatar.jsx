import { initials } from '../../lib/utils';

export default function Avatar({ user, size = 'md', ring = false, className = '' }) {
  const sizes = { xs: 'h-5 w-5 text-[9px]', sm: 'h-7 w-7 text-[10px]', md: 'h-9 w-9 text-xs', lg: 'h-12 w-12 text-sm', xl: 'h-16 w-16 text-lg' };
  return (
    <span
      title={user?.name}
      className={`inline-grid shrink-0 place-items-center rounded-full font-bold text-white ${sizes[size]} ${
        ring ? 'ring-2 ring-white' : ''
      } ${className}`}
      style={{ backgroundColor: user?.avatarColor || '#12121a' }}
    >
      {initials(user?.name)}
    </span>
  );
}

export function AvatarStack({ users = [], max = 4, size = 'sm' }) {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  return (
    <div className="flex -space-x-2">
      {shown.map((u) => (
        <Avatar key={u._id} user={u} size={size} ring />
      ))}
      {extra > 0 && (
        <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-ink/10 text-[10px] font-bold text-ink/70 ring-2 ring-white">
          +{extra}
        </span>
      )}
    </div>
  );
}
