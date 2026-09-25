export type ColumnId = string;

export type LabelName = 'Feature' | 'Bug' | 'Issue' | 'Undefined';

export type Priority = 'Low' | 'Medium' | 'High' | '';

export interface Member {
  id: string;
  name: string;
  color: string;
  emoji?: string; // Profession emoji for avatar
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Attachment {
  id: string;
  filename: string;
}

export interface ActivityEntry {
  ts: number;
  text: string;
}

export interface Task {
  id: string;
  title: string;
  columnId: ColumnId;
  label: LabelName;
  assignees: string[]; // member IDs
  dueDate: string | null; // YYYY-MM-DD format
  description: string;
  checklist: ChecklistItem[];
  attachments: Attachment[];
  cover: string | null; // data URL
  priority: Priority;
  completed: boolean;
  activity: ActivityEntry[];
}