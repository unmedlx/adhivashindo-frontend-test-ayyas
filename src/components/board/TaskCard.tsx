import type { Task } from '../../types/board.types';
import type { MouseEvent, DragEvent } from 'react';
import { attachOutline, timeOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import LabelBadge from '../ui/LabelBadge';
import ProgressBar from '../ui/ProgressBar';
import AvatarStack from '../ui/AvatarStack';
import { MEMBERS } from '../../data/members';

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const completedChecklistItems = task.checklist.filter(item => item.done).length;
  const totalChecklistItems = task.checklist.length;
  const progressPercent = totalChecklistItems > 0 
    ? (completedChecklistItems / totalChecklistItems) * 100 
    : 0;

  const assignees = MEMBERS.filter(member => task.assignees.includes(member.id));

  // Format date to "d MMM" format (e.g., "1 Aug")
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    return `${day} ${month}`;
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(task);
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.cursor = 'grabbing';
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.cursor = 'grab';
    e.currentTarget.style.opacity = '1';
  };

  return (
    <div
      onClick={handleCardClick}
      draggable
      onDragStart={handleDragStart}
      style={{
        backgroundColor: 'var(--color-surface-2)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px',
        boxShadow: 'var(--shadow-card)',
        cursor: 'grab',
        transition: 'box-shadow 0.2s',
        border: '1px solid var(--color-border)',
      }}
      onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,24,40,.08)';
        e.currentTarget.style.cursor = 'grab';
      }}
      onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.cursor = 'grab';
      }}
      onDragEnd={handleDragEnd}
    >
      {/* Cover Image */}
      {task.cover && (
        <div
          style={{
            width: '100%',
            height: '160px',
            backgroundImage: `url(${task.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '10px',
          }}
        />
      )}

      {/* Label Badge */}
      <div style={{ marginBottom: '8px' }}>
        <LabelBadge label={task.label} />
      </div>

      {/* Mini Progress Bar */}
      {totalChecklistItems > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <ProgressBar progress={progressPercent} />
        </div>
      )}

      {/* Title */}
      <h3
        style={{
          margin: '0 0 6px',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--color-text)',
          textDecoration: task.completed ? 'line-through' : 'none',
          opacity: task.completed ? 0.6 : 1,
          lineHeight: '1.4',
        }}
      >
        {task.title}
      </h3>

      {/* Description (2-line clamp) */}
      {task.description && (
        <p
          style={{
            margin: '0 0 10px',
            fontSize: '12px',
            color: 'var(--color-muted)',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '10px',
          paddingTop: '10px',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        {/* Due Date & Attachments */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Due Date */}
          {task.dueDate && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.3px',
                backgroundColor: 'var(--label-feature-bg)',
                color: 'var(--label-feature-text)',
                borderRadius: '4px',
                padding: '2px 8px',
              }}
            >
              <IonIcon icon={timeOutline} style={{ fontSize: '12px' }} />
              <span>{formatDueDate(task.dueDate)}</span>
            </div>
          )}

          {/* Attachment Count */}
          {task.attachments.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: 'var(--color-muted)',
              }}
            >
              <IonIcon icon={attachOutline} style={{ fontSize: '12px' }} />
              <span>{task.attachments.length}</span>
            </div>
          )}
        </div>

        {/* Assignee Avatars */}
        <AvatarStack members={assignees} maxVisible={3} size="small" />
      </div>
    </div>
  );
}

export default TaskCard;