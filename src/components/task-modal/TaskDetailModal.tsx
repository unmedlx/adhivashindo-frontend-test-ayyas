import { useState, useEffect } from 'react';
import { IonModal, IonButton, IonIcon, IonContent } from '@ionic/react';
import { closeOutline, imageOutline } from 'ionicons/icons';
import type { Task, ColumnId, LabelName, Priority } from '../../types/board.types';
import { useBoard } from '../../store/BoardProvider';
import { useToast } from '../ui/Toast';
import { MEMBERS } from '../../data/members';
import { newId } from '../../lib/id';

interface TaskDetailModalProps {
  isOpen: boolean;
  onDidDismiss: () => void;
  task?: Task; // If provided, edit mode; if not, create mode
  columnId?: ColumnId; // For create mode
}

export function TaskDetailModal({ isOpen, onDidDismiss, task, columnId }: TaskDetailModalProps) {
  const { state, addTask, updateTask, deleteTask } = useBoard();
  const { showToast } = useToast();

  // Local edit buffer - only commits to store on Save
  const [editBuffer, setEditBuffer] = useState<Partial<Task>>(() => ({
    id: task?.id || newId(),
    title: task?.title || '',
    columnId: task?.columnId || columnId || 'To Do',
    label: task?.label || 'Undefined',
    assignees: task?.assignees || [],
    dueDate: task?.dueDate ?? null,
    description: task?.description || '',
    checklist: task?.checklist || [],
    attachments: task?.attachments || [],
    cover: task?.cover ?? null,
    priority: task?.priority || '',
    completed: task?.completed || false,
    activity: task?.activity || [],
  }));

  const [isAssigneePopoverOpen, setIsAssigneePopoverOpen] = useState(false);

  // Reset edit buffer when modal opens with different task
  useEffect(() => {
    if (isOpen) {
      setEditBuffer({
        id: task?.id || newId(),
        title: task?.title || '',
        columnId: task?.columnId || columnId || 'To Do',
        label: task?.label || 'Undefined',
        assignees: task?.assignees || [],
        dueDate: task?.dueDate ?? null,
        description: task?.description || '',
        checklist: task?.checklist || [],
        attachments: task?.attachments || [],
        cover: task?.cover ?? null,
        priority: task?.priority || '',
        completed: task?.completed || false,
        activity: task?.activity || [],
      });
    }
  }, [isOpen, task, columnId]);

  const handleSave = () => {
    // Validate non-empty title
    if (!editBuffer.title?.trim()) {
      showToast('Title tidak boleh kosong');
      return;
    }

    const taskToSave: Task = {
      id: editBuffer.id!,
      title: editBuffer.title,
      columnId: editBuffer.columnId!,
      label: editBuffer.label!,
      assignees: editBuffer.assignees!,
      dueDate: editBuffer.dueDate ?? null,
      description: editBuffer.description || '',
      checklist: editBuffer.checklist || [],
      attachments: editBuffer.attachments || [],
      cover: editBuffer.cover ?? null,
      priority: editBuffer.priority || '',
      completed: editBuffer.completed || false,
      activity: editBuffer.activity || [],
    };

    if (task) {
      // Update existing task
      updateTask(task.id, taskToSave);
      showToast('Task diperbarui');
    } else {
      // Create new task
      addTask(taskToSave);
      showToast('Task dibuat');
    }

    onDidDismiss();
  };

  const handleDiscard = () => {
    onDidDismiss();
  };

  const handleDelete = () => {
    if (task) {
      deleteTask(task.id);
      showToast('Task dihapus');
      onDidDismiss();
    }
  };

  const toggleComplete = () => {
    setEditBuffer(prev => ({
      ...prev,
      completed: !prev.completed,
    }));
  };

  const updateField = <K extends keyof Task>(field: K, value: Task[K]) => {
    setEditBuffer(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isEditMode = !!task;

  return (
    <>
      <style>{`
        .det-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--color-border); }
        .det-body { padding: 18px 20px 6px; overflow-y: auto; }
        ion-modal#taskModal { --border-radius: 20px; --width: 560px; --height: 88%; --box-shadow: var(--shadow-pop); }
        ion-modal#taskModal ion-content { --background: var(--color-surface); --color: var(--color-text); }
        @media (max-width: 768px) {
          ion-modal#taskModal { --width: 100%; --height: 100%; --border-radius: 0; }
        }
        .cover-drop { height: 150px; border: 1.5px dashed var(--color-border); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; color: var(--color-muted); font-size: 13px; font-weight: 600; cursor: pointer; background-size: cover; background-position: center; background-color: var(--color-surface-2); margin-bottom: 18px; transition: border-color 0.12s; }
        .cover-drop:hover { border-color: var(--color-accent); color: var(--color-accent); }
        .field-title { font-size: 12px; color: var(--color-text); margin-bottom: 5px; font-weight: 700; letter-spacing: 0.3px; }
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 5px; }
        .grid2 > div { background: var(--color-surface-1); border-radius: var(--radius-sm); padding: 5px 2px; border: 1px solid transparent; transition: border-color 0.12s; }
        .grid2 select, .grid2 input:focus-within { border-color: var(--color-accent); }
        .grid2 select, .grid2 input { width: 100%; border: none; background: var(--color-surface-2); color: var(--color-text); font-size: 13px; font-weight: 500; outline: none; font-family: inherit; border-radius: 5px; padding: 6px 8px; }
        .assignee-row { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
        .add-av { width: 26px; height: 26px; border-radius: 50%; border: 1.5px dashed var(--color-muted-2); display: flex; align-items: center; justify-content: center; color: var(--color-muted); cursor: pointer; background: none; font-size: 15px; }
        .add-av:hover { border-color: var(--color-accent); color: var(--color-accent); }
        .member-pop { position: relative; }
        .member-list { position: absolute; top: 32px; left: 0; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); box-shadow: var(--shadow-pop); padding: 6px; z-index: 40; display: none; width: 170px; }
        .member-list.open { display: block; }
        .member-list label { display: flex; align-items: center; gap: 8px; padding: 7px 8px; font-size: 12.5px; font-weight: 500; border-radius: var(--radius-sm); cursor: pointer; }
        .member-list label:hover { background: var(--color-surface-2); }
        .section { margin-bottom: 20px; }
        .section h4 { font-size: 13px; font-weight: 700; margin: 0 0 9px; color: var(--color-text); }
        textarea { width: 100%; min-height: 74px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface-2); color: var(--color-text); padding: 10px 12px; font-family: inherit; font-size: 13px; resize: vertical; outline: none; }
        textarea:focus { border-color: var(--color-accent); background: var(--color-surface); }
        .att-item, .sub-item { display: flex; align-items: center; gap: 9px; padding: 8px 2px; font-size: 13px; border-bottom: 1px solid var(--color-border); }
        .att-item:last-child, .sub-item:last-child { border-bottom: none; }
        .att-item .rm, .sub-item .rm { margin-left: auto; background: none; border: none; color: var(--color-muted); cursor: pointer; font-size: 15px; }
        .att-item .rm:hover, .sub-item .rm:hover { color: var(--color-danger); }
        .att-add { display: flex; gap: 6px; margin-top: 8px; }
        .att-add input { flex: 1; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 7px 10px; background: var(--color-surface-2); color: var(--color-text); font-size: 12.5px; outline: none; }
        .dropzone { border: 1.5px dashed var(--color-border); border-radius: var(--radius-md); padding: 16px; text-align: center; font-size: 12.5px; color: var(--color-muted); cursor: pointer; background: var(--color-surface-2); transition: border-color 0.12s; }
        .dropzone:hover { border-color: var(--color-accent); color: var(--color-accent); }
        .chk-progress { height: 6px; border-radius: 3px; background: var(--color-surface-2); overflow: hidden; margin: 2px 0 10px; }
        .chk-progress > div { height: 100%; background: var(--color-success); transition: width 0.2s; }
        .act-item { font-size: 12px; color: var(--color-muted); padding: 6px 0; border-bottom: 1px dashed var(--color-border); }
        .act-item:last-child { border-bottom: none; }
        .det-foot { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-top: 1px solid var(--color-border); background: var(--color-surface); }
        .danger-btn { --background: transparent; --color: var(--color-danger); font-weight: 600; text-transform: none; }
        #discardBtn { --border-radius: var(--radius-sm); --border-color: var(--color-border); --color: var(--color-muted); text-transform: none; font-weight: 600; }
        #saveBtn { --border-radius: var(--radius-sm); --background: var(--color-accent); --background-hover: var(--color-accent-2); text-transform: none; font-weight: 700; }
        .av { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 700; flex: none; box-shadow: 0 1px 2px rgba(0,0,0,0.15); }
        .priority-Low { color: var(--color-success); }
        .priority-Medium { color: var(--color-warn); }
        .priority-High { color: var(--color-danger); }
      `}</style>
      <IonModal
        isOpen={isOpen}
        onDidDismiss={onDidDismiss}
        id="taskModal"
      >
      <IonContent>
        {/* Modal Header */}
        <div className="det-head">
          <IonButton
            onClick={toggleComplete}
            id="completeBtn"
            fill="solid"
            size="small"
            className={editBuffer.completed ? 'is-done' : ''}
            style={{
              '--border-radius': '8px',
              '--background': editBuffer.completed ? 'var(--color-text)' : 'var(--color-surface-2)',
              '--color': editBuffer.completed ? 'var(--color-surface)' : 'var(--color-text)',
              '--box-shadow': 'none',
              '--padding-start': '12px',
              '--padding-end': '12px',
              fontWeight: 600,
              fontSize: '12.5px',
              textTransform: 'none',
              height: '30px',
            }}
            onMouseEnter={(e) => {
              if (!editBuffer.completed) {
                e.currentTarget.style.setProperty('--background', 'var(--color-accent-soft)');
              }
            }}
            onMouseLeave={(e) => {
              if (!editBuffer.completed) {
                e.currentTarget.style.setProperty('--background', 'var(--color-surface-2)');
              }
            }}
          >
            {editBuffer.completed ? '✓ Mark Complete' : '✓ Mark Complete'}
          </IonButton>
          <IonButton
            onClick={onDidDismiss}
            id="closeModalBtn"
            fill="solid"
            style={{
              '--border-radius': '8px',
              '--background': 'var(--color-surface-1)',
              '--color': 'var(--color-text)',
              '--box-shadow': 'none',
              '--padding-start': '12px',
              '--padding-end': '12px',
              fontWeight: 600,
              fontSize: '12.5px',
              textTransform: 'none',
              height: '30px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.setProperty('--background', 'var(--color-accent-soft)');
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.setProperty('--background', 'var(--color-surface-1)');
            }}
          >
            <IonIcon icon={closeOutline} />
          </IonButton>
        </div>

        {/* Modal Body */}
        <div className="det-body">
          {/* Cover Image */}
          <input type="file" id="coverInput" accept="image/*" style={{ display: 'none' }} />
          {editBuffer.cover ? (
            <div
              className="cover-drop"
              style={{
                backgroundImage: `url(${editBuffer.cover})`,
                position: 'relative',
              }}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      updateField('cover', e.target?.result as string || null);
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateField('cover', null);
                }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Remove
              </button>
            </div>
          ) : (
            <div
              className="cover-drop"
              id="coverDrop"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      updateField('cover', e.target?.result as string || null);
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
            > 
            <div className='flex flex-col justify-center items-center gap-2'>
              <IonIcon icon={imageOutline} className='text-4xl' />
              + Add Cover Image
            </div>
            </div>
          )}

          {/* Title */}
          <input
            id="titleInput"
            type="text"
            value={editBuffer.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Judul task"
            style={{
              width: '100%',
              fontSize: '19px',
              fontWeight: 700,
              padding: '8px 0',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text)',
              outline: 'none',
              marginBottom: '14px',
              fontFamily: 'inherit',
            }}
          />

          {/* Grid Fields */}
          <div className="grid2">
            {/* Assignees */}
            <div style={{ backgroundColor: 'var(--color-surface-1' }}>
              <div className="field-title">Assignee</div>
              <div className="assignee-row member-pop">
                <div id="assigneeAvs" className="assignee-row">
                  {editBuffer.assignees?.map((assigneeId) => {
                    const member = MEMBERS.find(m => m.id === assigneeId);
                    if (!member) return null;
                    return (
                      <div
                        key={member.id}
                        className="av"
                        style={{ backgroundColor: member.color }}
                        onClick={() => {
                          updateField('assignees', editBuffer.assignees?.filter(id => id !== member.id) || []);
                        }}
                        title={member.name}
                      >
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                    );
                  })}
                </div>
                <button
                  className="add-av"
                  id="addAssigneeBtn"
                  onClick={() => setIsAssigneePopoverOpen(!isAssigneePopoverOpen)}
                >
                  +
                </button>

                {/* Assignee Popover */}
                {isAssigneePopoverOpen && (
                  <div className="member-list open">
                    {MEMBERS.map((member) => (
                      <label
                        key={member.id}
                        onClick={(e) => {
                          e.preventDefault();
                          const isAssigned = editBuffer.assignees?.includes(member.id);
                          updateField(
                            'assignees',
                            isAssigned
                              ? editBuffer.assignees?.filter(id => id !== member.id) || []
                              : [...(editBuffer.assignees || []), member.id]
                          );
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={editBuffer.assignees?.includes(member.id)}
                          onChange={() => {}}
                        />
                        <div className="av" style={{ backgroundColor: member.color, width: '24px', height: '24px', fontSize: '10px' }}>
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <span>{member.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <div className="field-title">Due Date</div>
              <input
                id="dueInput"
                type="date"
                value={editBuffer.dueDate || ''}
                onChange={(e) => updateField('dueDate', e.target.value || null)}
              />
            </div>

            {/* Board */}
            <div>
              <div className="field-title">Board</div>
              <input type="text" value="Northern Light" disabled />
            </div>

            {/* Column */}
            <div>
              <div className="field-title">Column</div>
              <select
                id="columnInput"
                value={editBuffer.columnId}
                onChange={(e) => updateField('columnId', e.target.value as ColumnId)}
              >
                {state.columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            {/* Label */}
            <div>
              <div className="field-title">Label</div>
              <select
                id="labelInput"
                value={editBuffer.label}
                onChange={(e) => updateField('label', e.target.value as LabelName)}
              >
                <option value="Feature">Feature</option>
                <option value="Bug">Bug</option>
                <option value="Issue">Issue</option>
                <option value="Undefined">Undefined</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <div className="field-title">Priority</div>
              <select
                id="priorityInput"
                value={editBuffer.priority}
                onChange={(e) => updateField('priority', e.target.value as Priority)}
              >
                <option value=""></option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <br style={{ backgroundColor: 'var(--color-text)', height: '2px', width: '100%' }} />

          {/* Description */}
          <div className="section">
            <h4>Description</h4>
            <textarea
              id="descInput"
              value={editBuffer.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Tulis deskripsi task..."
            />
          </div>

          {/* Attachments */}
          <div className="section">
            <h4>Attachments</h4>
            <input type="file" id="attInput" style={{ display: 'none' }} />
            <div
              className="dropzone flex justify-center items-center gap-2"
              id="attDrop"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    updateField('attachments', [
                      ...(editBuffer.attachments || []),
                      { id: newId(), filename: file.name },
                    ]);
                  }
                };
                input.click();
              }}
            >
              <IonIcon icon={imageOutline} className='text-xl' />
              Drag & Drop files here or <b>browse from device</b>
            </div>

            {editBuffer.attachments && editBuffer.attachments.length > 0 && (
              <div id="attList">
                {editBuffer.attachments.map((attachment) => (
                  <div key={attachment.id} className="att-item">
                    <span>{attachment.filename}</span>
                    <button
                      className="rm"
                      onClick={() => {
                        updateField('attachments', editBuffer.attachments?.filter(a => a.id !== attachment.id) || []);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checklist */}
          <div className="section">
            <h4>Check List</h4>
            
            {/* Progress Bar */}
            {editBuffer.checklist && editBuffer.checklist.length > 0 && (
              <div className="chk-progress">
                <div
                  id="chkBar"
                  style={{
                    width: `${(editBuffer.checklist.filter(item => item.done).length / editBuffer.checklist.length) * 100}%`,
                  }}
                />
              </div>
            )}

            {/* Checklist Items */}
            {editBuffer.checklist && editBuffer.checklist.length > 0 && (
              <div id="subList">
                {editBuffer.checklist.map((item) => (
                  <div key={item.id} className="sub-item">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => {
                        updateField('checklist',
                          editBuffer.checklist?.map(i =>
                            i.id === item.id ? { ...i, done: !i.done } : i
                          ) || []
                        );
                      }}
                    />
                    <span
                      style={{
                        textDecoration: item.done ? 'line-through' : 'none',
                        opacity: item.done ? 0.6 : 1,
                      }}
                    >
                      {item.text}
                    </span>
                    <button
                      className="rm"
                      onClick={() => {
                        updateField('checklist', editBuffer.checklist?.filter(i => i.id !== item.id) || []);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Subtask Input */}
            <div className="att-add">
              <input
                id="subInput"
                type="text"
                placeholder="Tambah subtask..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    updateField('checklist', [
                      ...(editBuffer.checklist || []),
                      { id: newId(), text: e.currentTarget.value.trim(), done: false },
                    ]);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <IonButton size="small" id="addSubBtn" onClick={() => {
                const input = document.getElementById('subInput') as HTMLInputElement;
                if (input?.value.trim()) {
                  updateField('checklist', [
                    ...(editBuffer.checklist || []),
                    { id: newId(), text: input.value.trim(), done: false },
                  ]);
                  input.value = '';
                }
              }}>
                Add
              </IonButton>
            </div>
          </div>

          {/* Activity Log */}
          <div className="section">
            <h4>Activity</h4>
            <div id="actList">
              {editBuffer.activity && editBuffer.activity.length > 0 ? (
                [...editBuffer.activity].reverse().map((entry) => (
                  <div key={entry.ts} className="act-item">
                    <div>{entry.text}</div>
                    <div style={{ fontSize: '11px' }}>
                      {new Date(entry.ts).toLocaleString('id-ID', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="act-item">No activity yet</div>
              )}
            </div>
          </div>
        </div>
      </IonContent>

      {/* Footer */}
      <div className="det-foot">
        {isEditMode && (
          <IonButton
            onClick={handleDelete}
            className="danger-btn"
            fill="clear"
          >
            Delete
          </IonButton>
        )}
        {!isEditMode && <div />}
        <div style={{ display: 'flex', gap: '8px' }}>
          <IonButton
            onClick={handleDiscard}
            id="discardBtn"
            fill="outline"
          >
            Discard
          </IonButton>
          <IonButton
            onClick={handleSave}
            id="saveBtn"
          >
            Save
          </IonButton>
        </div>
      </div>
    </IonModal>
    </>
  );
}

export default TaskDetailModal;