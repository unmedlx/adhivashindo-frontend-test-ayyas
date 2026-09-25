import type { Member } from '../../types/board.types';

interface AvatarProps {
  member: Member;
  size?: 'normal' | 'small';
  className?: string;
}

export function Avatar({ member, size = 'normal', className = '' }: AvatarProps) {
  const sizeClasses = size === 'small' 
    ? 'w-[22px] h-[22px] text-[9px]' 
    : 'w-[28px] h-[28px] text-[11px]';

  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center text-white font-bold flex-none shadow-sm ${className}`}
      style={{ backgroundColor: member.color }}
      title={member.name}
    >
      {initials}
    </div>
  );
}

export default Avatar;