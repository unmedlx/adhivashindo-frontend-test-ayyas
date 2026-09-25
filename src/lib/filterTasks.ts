import type { Task } from '../types/board.types';

export interface FilterState {
  assignees: Set<string>;
  labels: Set<string>;
  date: string;
}

export function filterTasks(tasks: Task[], filters: FilterState, search: string): Task[] {
  return tasks.filter(task => {
    // Apply search filter (title or description contains search string, case-insensitive)
    if (search) {
      const searchLower = search.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchLower);
      const descriptionMatch = task.description.toLowerCase().includes(searchLower);
      if (!titleMatch && !descriptionMatch) {
        return false;
      }
    }

    // Apply assignee filter (AND logic: task must have ALL selected assignees)
    if (filters.assignees.size > 0) {
      const hasAllAssignees = Array.from(filters.assignees).every(assigneeId =>
        task.assignees.includes(assigneeId)
      );
      if (!hasAllAssignees) {
        return false;
      }
    }

    // Apply label filter (task label must be in selected labels)
    if (filters.labels.size > 0) {
      const hasLabel = filters.labels.has(task.label);
      if (!hasLabel) {
        return false;
      }
    }

    // Apply due date filter (task must be due before or on the selected date)
    if (filters.date) {
      if (!task.dueDate) {
        return false; // Task with no due date doesn't match date filter
      }
      const taskDate = new Date(task.dueDate);
      const filterDate = new Date(filters.date);
      if (taskDate > filterDate) {
        return false;
      }
    }

    return true;
  });
}
