import { useMemo } from 'react';
import { useBoard } from '../../store/BoardProvider';
import { useToast } from '../ui/Toast';
import BoardColumn from './BoardColumn';
import AddListColumn from './AddListColumn';
import { filterTasks } from '../../lib/filterTasks';
import type { Task, ColumnId } from '../../types/board.types';

interface BoardCanvasProps {
  onTaskClick?: (task: Task) => void;
  onAddTask?: (columnId: ColumnId) => void;
}

export function BoardCanvas({ onTaskClick, onAddTask }: BoardCanvasProps) {
  const { state, moveTask } = useBoard();
  const { showToast } = useToast();

  // Apply filters and search to tasks
  const filteredTasks = useMemo(() => {
    return filterTasks(state.tasks, state.filters, state.search);
  }, [state.tasks, state.filters, state.search]);

  const handleTaskDrop = (taskId: string, targetColumnId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task && task.columnId !== targetColumnId) {
      moveTask(taskId, targetColumnId);
      showToast(`Task dipindahkan ke ${targetColumnId}`);
    }
  };

  return (
    <div
      style={{

        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        padding: '16px',
        overflowX: 'auto',
        alignItems: 'flex-start',
        backgroundColor: 'var(--color-bg)',
        // Ensure smooth scrolling on mobile
        WebkitOverflowScrolling: 'touch',
        // Hide scrollbar for cleaner look but keep functionality
        scrollbarWidth: 'thin',
        minHeight: '100vh'
      }}
    >
      {state.columns.map((columnId) => {
        const columnTasks = filteredTasks.filter(task => task.columnId === columnId);
        return (
          <BoardColumn 
            key={columnId} 
            columnId={columnId} 
            tasks={columnTasks}
            onDrop={handleTaskDrop}
            onTaskClick={onTaskClick}
            onAddTask={onAddTask}
          />
        );
      })}
      <AddListColumn />
    </div>
  );
}

export default BoardCanvas;