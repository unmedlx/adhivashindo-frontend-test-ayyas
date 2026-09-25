import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Task, ColumnId } from '../types/board.types';
import { getTasks, setTasks, getColumns, setColumns } from '../lib/storage';
import { seedTasks, DEFAULT_COLS } from '../data/seed';

interface BoardState {
  tasks: Task[];
  columns: ColumnId[];
  filters: {
    assignees: Set<string>;
    labels: Set<string>;
    date: string;
  };
  search: string;
}

type BoardAction =
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'UPDATE_TASK'; taskId: string; updates: Partial<Task> }
  | { type: 'DELETE_TASK'; taskId: string }
  | { type: 'MOVE_TASK'; taskId: string; toColumnId: ColumnId }
  | { type: 'ADD_COLUMN'; columnName: string }
  | { type: 'TOGGLE_CHECKLIST_ITEM'; taskId: string; checklistItemId: string }
  | { type: 'SET_FILTERS'; filters: { assignees?: Set<string>; labels?: Set<string>; date?: string } }
  | { type: 'SET_SEARCH'; search: string }
  | { type: 'SET_STATE'; state: BoardState };

const initialState: BoardState = {
  tasks: getTasks<Task[]>(seedTasks()),
  columns: getColumns<ColumnId[]>(DEFAULT_COLS),
  filters: {
    assignees: new Set(),
    labels: new Set(),
    date: '',
  },
  search: '',
};

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.task],
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.taskId
            ? { ...task, ...action.updates, activity: [...task.activity, { ts: Date.now(), text: 'Task diperbarui' }] }
            : task
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.taskId),
      };

    case 'MOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.taskId
            ? { ...task, columnId: action.toColumnId, activity: [...task.activity, { ts: Date.now(), text: `Dipindahkan ke ${action.toColumnId}` }] }
            : task
        ),
      };

    case 'ADD_COLUMN':
      if (state.columns.includes(action.columnName)) {
        return state;
      }
      return {
        ...state,
        columns: [...state.columns, action.columnName],
      };

    case 'TOGGLE_CHECKLIST_ITEM':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.taskId
            ? {
                ...task,
                checklist: task.checklist.map(item =>
                  item.id === action.checklistItemId
                    ? { ...item, done: !item.done }
                    : item
                ),
                activity: [...task.activity, { ts: Date.now(), text: 'Checklist diperbarui' }],
              }
            : task
        ),
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...(action.filters.assignees !== undefined && { assignees: action.filters.assignees }),
          ...(action.filters.labels !== undefined && { labels: action.filters.labels }),
          ...(action.filters.date !== undefined && { date: action.filters.date }),
        },
      };

    case 'SET_SEARCH':
      return {
        ...state,
        search: action.search,
      };

    case 'SET_STATE':
      return action.state;

    default:
      return state;
  }
}

interface BoardContextValue {
  state: BoardState;
  dispatch: React.Dispatch<BoardAction>;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, toColumnId: ColumnId) => void;
  addColumn: (columnName: string) => void;
  toggleChecklistItem: (taskId: string, checklistItemId: string) => void;
  setFilters: (filters: { assignees?: Set<string>; labels?: Set<string>; date?: string }) => void;
  setSearch: (search: string) => void;
}

const BoardContext = createContext<BoardContextValue | undefined>(undefined);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  // Persist state to localStorage on changes
  useEffect(() => {
    setTasks(state.tasks);
  }, [state.tasks]);

  useEffect(() => {
    setColumns(state.columns);
  }, [state.columns]);

  const addTask = (task: Task) => {
    dispatch({ type: 'ADD_TASK', task });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', taskId, updates });
  };

  const deleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', taskId });
  };

  const moveTask = (taskId: string, toColumnId: ColumnId) => {
    dispatch({ type: 'MOVE_TASK', taskId, toColumnId });
  };

  const addColumn = (columnName: string) => {
    dispatch({ type: 'ADD_COLUMN', columnName });
  };

  const toggleChecklistItem = (taskId: string, checklistItemId: string) => {
    dispatch({ type: 'TOGGLE_CHECKLIST_ITEM', taskId, checklistItemId });
  };

  const setFilters = (filters: { assignees?: Set<string>; labels?: Set<string>; date?: string }) => {
    dispatch({ type: 'SET_FILTERS', filters });
  };

  const setSearch = (search: string) => {
    dispatch({ type: 'SET_SEARCH', search });
  };

  const value: BoardContextValue = {
    state,
    dispatch,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    toggleChecklistItem,
    setFilters,
    setSearch,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export { useBoard };

function useBoard(): BoardContextValue {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}