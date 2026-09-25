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
    checklist: string[] = [],
    coverImage: string | null = null,
    priority: Priority = ''
  ): Task => ({
    id: newId(),
    title,
    columnId,
    label,
    assignees,
    dueDate,
    description,
    checklist: checklist.map((text, index) => ({
      id: newId(),
      text,
      done: index < Math.floor(checklist.length / 2), // Make first half done for demo
    })),
    attachments: [],
    cover: coverImage,
    priority,
    completed: false,
    activity: [{ ts: Date.now(), text: 'Task dibuat' }],
  });

  return [
    // To Do - 3 tasks
    createTask(
      'User Authentication System Design',
      'To Do',
      'Feature',
      ['m1', 'm2'],
      '2026-10-15',
      'Design secure authentication flow with OAuth integration and password recovery.',
      ['Create login/register UI', 'Implement OAuth providers', 'Setup password reset flow', 'Add 2FA support'],
      '/cover-image-seed/ayyas.png',
      'High'
    ),
    createTask(
      'Database Schema Optimization',
      'To Do',
      'Feature',
      ['m3', 'm4'],
      '2026-10-18',
      'Optimize database queries and add proper indexing for better performance.',
      [],
      null,
      'Medium'
    ),
    createTask(
      'API Rate Limiting Implementation',
      'To Do',
      'Feature',
      ['m5'],
      '2026-10-20',
      'Implement rate limiting to prevent API abuse and ensure fair usage.',
      [],
      null,
      'Medium'
    ),

    // Doing - 3 tasks
    createTask(
      'Real-time Notification System',
      'Doing',
      'Feature',
      ['m1', 'm3'],
      '2026-10-12',
      'Build WebSocket-based notification system for real-time updates.',
      ['Setup WebSocket server', 'Implement connection management', 'Create notification types', 'Build UI components'],
      '/cover-image-seed/keyboard.webp',
      'High'
    ),
    createTask(
      'Mobile App Responsive Layout',
      'Doing',
      'Feature',
      ['m2', 'm4'],
      '2026-10-14',
      'Ensure responsive design works across all mobile devices and screen sizes.',
      [],
      null,
      'High'
    ),
    createTask(
      'Payment Gateway Integration',
      'Doing',
      'Feature',
      ['m5'],
      '2026-10-16',
      'Integrate payment gateway for subscription and one-time payments.',
      [],
      null,
      'High'
    ),

    // Review - 2 tasks
    createTask(
      'Security Audit & Penetration Testing',
      'Review',
      'Issue',
      ['m1', 'm2', 'm3'],
      '2026-10-10',
      'Conduct security audit and fix vulnerabilities found during testing.',
      [],
      null,
      'High'
    ),
    createTask(
      'Performance Testing & Optimization',
      'Review',
      'Feature',
      ['m4', 'm5'],
      '2026-10-11',
      'Load test the application and optimize performance bottlenecks.',
      ['Setup load testing environment', 'Run stress tests', 'Analyze performance metrics', 'Implement optimizations'],
      '/cover-image-seed/pokemon.svg',
      'Medium'
    ),

    // Done - 2 tasks
    createTask(
      'Project Dashboard Development',
      'Done',
      'Feature',
      ['m1', 'm4'],
      '2026-10-05',
      'Build comprehensive project dashboard with analytics and reporting.',
      [],
      null,
      'Medium'
    ),
    createTask(
      'User Profile Management',
      'Done',
      'Feature',
      ['m2', 'm3', 'm5'],
      '2026-10-06',
      'Create user profile management with avatar upload and preferences.',
      [],
      null,
      'Low'
    ),

    // Rework - 2 tasks
    createTask(
      'Search Functionality Enhancement',
      'Rework',
      'Feature',
      ['m1', 'm2'],
      '2026-10-08',
      'Improve search with filters, autocomplete, and better relevance ranking.',
      ['Add advanced filters', 'Implement autocomplete', 'Improve search algorithm', 'Add search analytics'],
      '/cover-image-seed/sigmatop.png',
      'Medium'
    ),
    createTask(
      'Error Handling & Logging System',
      'Rework',
      'Bug',
      ['m3', 'm4', 'm5'],
      '2026-10-09',
      'Fix error handling issues and implement comprehensive logging system.',
      [],
      null,
      'High'
    ),
  ];
}