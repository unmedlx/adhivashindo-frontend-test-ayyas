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

  const emojiSize = size === 'small' ? '14px' : '18px';

  // Use emoji if available, otherwise fall back to initials
  if (member.emoji) {
    return (
      <div
        className={`${sizeClasses} rounded-full flex items-center justify-center flex-none shadow-sm ${className}`}
        style={{ backgroundColor: member.color }}
        title={member.name}
      >
        <span style={{ fontSize: emojiSize, lineHeight: 1 }}>{member.emoji}</span>
      </div>
    );
  }

  // Fallback to initials
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