import type { Member } from '../../types/board.types';
import Avatar from './Avatar';

interface AvatarStackProps {
  members: Member[];
  maxVisible?: number;
  size?: 'normal' | 'small';
  className?: string;
}

export function AvatarStack({ members, maxVisible = 4, size = 'normal', className = '' }: AvatarStackProps) {
  const visibleMembers = members.slice(0, maxVisible);
  const remainingCount = members.length - maxVisible;

  return (
    <div className={`flex items-center ${className}`}>
      {visibleMembers.map((member, index) => (
        <div
          key={member.id}
          className={index === 0 ? '' : '-ml-2'}
         
        >
          <Avatar member={member} size={size} />
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={`-ml-2 ${size === 'small' ? 'w-[22px] h-[22px] text-[9px]' : 'w-[32px] h-[32px] text-[11px]'} rounded-full flex items-center justify-center font-bold flex-none shadow-sm`}
          style={{ 
            backgroundColor: 'var(--color-accent-soft)', 
            color: 'var(--color-accent)',
            border: '2px solid var(--color-surface)'
          }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

export default AvatarStack;