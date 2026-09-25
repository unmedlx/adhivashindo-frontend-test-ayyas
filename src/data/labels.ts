import type { LabelName } from '../types/board.types';

export const LABEL_TOKENS: Record<LabelName, { bg: string; text: string }> = {
  Feature: { bg: 'var(--label-feature-bg)', text: 'var(--label-feature-text)' },
  Bug: { bg: 'var(--label-bug-bg)', text: 'var(--label-bug-text)' },
  Issue: { bg: 'var(--label-issue-bg)', text: 'var(--label-issue-text)' },
  Undefined: { bg: 'var(--label-undefined-bg)', text: 'var(--label-undefined-text)' },
};