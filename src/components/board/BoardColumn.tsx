import type { Task, ColumnId } from '../../types/board.types';
import type { DragEvent } from 'react';
import TaskCard from './TaskCard';

interface BoardColumnProps {
  columnId: string;
  tasks: Task[];
  onDrop?: (taskId: string, targetColumnId: string) => void;
  onTaskClick?: (task: Task) => void;
  onAddTask?: (columnId: ColumnId) => void;
}

export function BoardColumn({ columnId, tasks, onDrop, onTaskClick, onAddTask }: BoardColumnProps) {
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && onDrop) {
      onDrop(taskId, columnId);
    }
  };

  const handleAddTask = () => {
    if (onAddTask) {
      onAddTask(columnId);
    }
  };

  return (
    <div
      style={{
        flex: '0 0 280px',
        backgroundColor: 'var(--color-surface-1)',
        borderRadius: 'var(--radius-lg)',
        padding: '6px',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
      }}
    >
      {/* Column Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          marginLeft: '6px',
          fontWeight: 700,
          fontSize: '16px',
          color: 'var(--color-text)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{columnId}</span>
              <button
                onClick={handleAddTask}
                style={{
                  backgroundColor: 'var(--color-accent-soft)',
              borderRadius: '8px',
              padding: '4px 8px',
              fontSize: '16px',
                  border: 'none',
                  color: 'var(--color-accent)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  
                }}
                title="Add task"
              >
                +
              </button>
          {/* <span
            style={{
              backgroundColor: 'var(--color-muted-2)',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 500,
              textAlign: 'right'
            }}
          >
            {tasks.length}
          </span> */}
        </div>
      </div>

      {/* Task Cards */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflowY: 'auto',
          flex: 1,
        }}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}
      </div>
    </div>
  );
}

export default BoardColumn;