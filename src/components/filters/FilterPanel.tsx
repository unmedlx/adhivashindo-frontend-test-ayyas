import { useState, useEffect } from 'react';
import { IonButton } from '@ionic/react';
import { useBoard } from '../../store/BoardProvider';
import { MEMBERS } from '../../data/members';
import { LABEL_TOKENS } from '../../data/labels';
import type { LabelName } from '../../types/board.types';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterPanel({ isOpen }: FilterPanelProps) {
  const { state, setFilters } = useBoard();
  const [localAssignees, setLocalAssignees] = useState<Set<string>>(() => new Set(state.filters.assignees));
  const [localLabels, setLocalLabels] = useState<Set<string>>(() => new Set(state.filters.labels));
  const [localDate, setLocalDate] = useState(state.filters.date);

  // Sync local state with store state when panel opens
  useEffect(() => {
    if (isOpen) {
      setLocalAssignees(new Set(state.filters.assignees));
      setLocalLabels(new Set(state.filters.labels));
      setLocalDate(state.filters.date);
    }
  }, [isOpen, state.filters.assignees, state.filters.labels, state.filters.date]);  

  const handleAssigneeToggle = (assigneeId: string) => {
    const newAssignees = new Set(localAssignees);
    if (newAssignees.has(assigneeId)) {
      newAssignees.delete(assigneeId);
    } else {
      newAssignees.add(assigneeId);
    }
    setLocalAssignees(newAssignees);
    setFilters({ assignees: newAssignees });
  };

  const handleLabelToggle = (label: LabelName) => {
    const newLabels = new Set(localLabels);
    if (newLabels.has(label)) {
      newLabels.delete(label);
    } else {
      newLabels.add(label);
    }
    setLocalLabels(newLabels);
    setFilters({ labels: newLabels });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setLocalDate(newDate);
    setFilters({ date: newDate });
  };

  const handleClearFilters = () => {
    setLocalAssignees(new Set());
    setLocalLabels(new Set());
    setLocalDate('');
    setFilters({ assignees: new Set(), labels: new Set(), date: '' });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '46px',
        right: 0,
        zIndex: 50,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-pop)',
        padding: '14px',
        width: '250px',
      }}
    >
      <h4 style={{ margin: '0 0 8px', fontSize: '11px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 700 }}>
        Assignee
      </h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
        {MEMBERS.map(member => {
          const isSelected = localAssignees.has(member.id);
          return (
            <div
              key={member.id}
              onClick={() => handleAssigneeToggle(member.id)}
              style={{
                border: isSelected ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                background: isSelected ? 'var(--color-accent-soft)' : 'var(--color-surface-2)',
                borderRadius: '20px',
                padding: '4px 11px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                userSelect: 'none',
                color: isSelected ? 'var(--color-accent)' : 'var(--color-text)',
              }}
            >
              {member.name}
            </div>
          );
        })}
      </div>
      
      <h4 style={{ margin: '0 0 8px', fontSize: '11px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 700 }}>
        Label
      </h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
        {(Object.keys(LABEL_TOKENS) as LabelName[]).map(label => {
          const isSelected = localLabels.has(label);
          const labelToken = LABEL_TOKENS[label];
          return (
            <div
              key={label}
              onClick={() => handleLabelToggle(label)}
              style={{
                border: isSelected ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                background: isSelected ? 'var(--color-accent-soft)' : labelToken.bg,
                borderRadius: '20px',
                padding: '4px 11px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                userSelect: 'none',
                color: isSelected ? 'var(--color-accent)' : labelToken.text,
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
      
      <h4 style={{ margin: '0 0 8px', fontSize: '11px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 700 }}>
        Due Before
      </h4>
      <input
        type="date"
        value={localDate}
        onChange={handleDateChange}
        style={{
          width: '100%',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          padding: '6px',
          background: 'var(--color-surface-2)',
          color: 'var(--color-text)',
        }}
      />
      
      <IonButton
        size="small"
        expand="block"
        style={{ marginTop: '10px' }}
        fill="clear"
        onClick={handleClearFilters}
      >
        Clear filters
      </IonButton>
    </div>
  );
}

export default FilterPanel;
