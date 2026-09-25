import type { Task, ColumnId, LabelName, Priority } from '../types/board.types';
import { newId } from '../lib/id';

export const DEFAULT_COLS: ColumnId[] = ['To Do', 'Doing', 'Review', 'Done', 'Rework'];

export function seedTasks(): Task[] {
  const createTask = (
    title: string,
    columnId: ColumnId,
    label: LabelName,
    assignees: string[],
    dueDate: string,
    description: string,
    checklist: string[] = []
  ): Task => ({
    id: newId(),
    title,
    columnId,
    label,
    assignees,
    dueDate,
    description,
    checklist: checklist.map(text => ({
      id: newId(),
      text,
      done: false,
    })),
    attachments: [],
    cover: null,
    priority: '' as Priority,
    completed: false,
    activity: [{ ts: Date.now(), text: 'Task dibuat' }],
  });

  return [
    createTask(
      'Research for a podcast and video website',
      'To Do',
      'Feature',
      ['m4', 'm5'],
      '2026-08-08',
      'Riset kompetitor & referensi format konten.'
    ),
    createTask(
      'Debug checkout process for the e-commerce website',
      'To Do',
      'Bug',
      ['m1', 'm2', 'm3'],
      '2026-10-19',
      'Perbaiki bug pada proses checkout.'
    ),
    createTask(
      'Design wireframes for the landing page revamp',
      'Doing',
      'Feature',
      ['m4', 'm5'],
      '2026-08-12',
      'Wireframe halaman landing baru.'
    ),
    createTask(
      'Implement responsive design for mobile users',
      'Doing',
      'Feature',
      ['m1', 'm2'],
      '2026-08-15',
      'Responsive design untuk mobile.'
    ),
    createTask(
      'Code review for authentication module',
      'Review',
      'Feature',
      ['m3', 'm4'],
      '2026-08-10',
      'Review kode modul autentikasi.'
    ),
    createTask(
      'Fix navigation menu alignment issue',
      'Review',
      'Bug',
      ['m2', 'm5'],
      '2026-08-14',
      'Perbaiki alignment menu navigasi.'
    ),
    createTask(
      'Deploy latest changes to production',
      'Done',
      'Feature',
      ['m1', 'm3'],
      '2026-08-06',
      'Deploy perubahan terbaru ke production.'
    ),
    createTask(
      'Enhance website usability through user feedback',
      'Done',
      'Feature',
      ['m4', 'm5'],
      '2026-08-05',
      'Implementasi feedback user.'
    ),
    createTask(
      'Blog Edit Page Modification and Playlist Page Design',
      'Rework',
      'Feature',
      ['m1', 'm2', 'm3'],
      '2026-08-08',
      'Revisi halaman blog & playlist.'
    ),
    createTask(
      'Plan and execute training sessions for new hires',
      'Rework',
      'Issue',
      ['m4', 'm5'],
      '2026-08-09',
      'Susun jadwal training karyawan baru.'
    ),
  ];
}