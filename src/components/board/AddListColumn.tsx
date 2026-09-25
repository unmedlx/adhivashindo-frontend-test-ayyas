import { useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { useBoard } from '../../store/BoardProvider';
import { useToast } from '../ui/Toast';

export function AddListColumn() {
  const { addColumn, state } = useBoard();
  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [columnName, setColumnName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (columnName.trim()) {
      addColumn(columnName.trim());
      if (!state.columns.includes(columnName.trim())) {
        showToast(`List "${columnName.trim()}" ditambahkan`);
      }
      setColumnName('');
      setIsFormOpen(false);
    }
  };

  const handleCancel = () => {
    setColumnName('');
    setIsFormOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isFormOpen) {
    return (
      <button
        onClick={() => setIsFormOpen(true)}
        style={{
          flex: '0 0 280px',
          backgroundColor: 'var(--color-surface-2)',
          borderRadius: 'var(--radius-lg)',
          padding: '12px',
          border: '2px dashed var(--color-muted-2)',
          background: 'transparent',
          color: 'var(--color-muted)',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 500,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.borderColor = 'var(--color-muted)';
          e.currentTarget.style.color = 'var(--color-text)';
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.borderColor = 'var(--color-muted-2)';
          e.currentTarget.style.color = 'var(--color-muted)';
        }}
      >
        + Add new list
      </button>
    );
  }

  return (
    <div
      style={{
        flex: '0 0 280px',
        backgroundColor: 'var(--color-surface-2)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px',
      }}
    >
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <input
          type="text"
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          placeholder="List name..."
          autoFocus
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            marginBottom: '8px',
            outline: 'none',
          }}
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
            e.currentTarget.style.borderColor = 'var(--color-accent)';
          }}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
          }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '8px 12px',
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Add List
          </button>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              padding: '8px 12px',
              backgroundColor: 'transparent',
              color: 'var(--color-muted)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddListColumn;