const TASKS_KEY = 'adhivasindo_kanban_v1';
const COLUMNS_KEY = 'adhivasindo_columns_v1';

export function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
}

export function getTasks<T>(fallback: T): T {
  return getItem<T>(TASKS_KEY, fallback);
}

export function setTasks<T>(value: T): void {
  setItem<T>(TASKS_KEY, value);
}

export function getColumns<T>(fallback: T): T {
  return getItem<T>(COLUMNS_KEY, fallback);
}

export function setColumns<T>(value: T): void {
  setItem<T>(COLUMNS_KEY, value);
}