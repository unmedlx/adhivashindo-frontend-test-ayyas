import { useState } from 'react';
import { IonContent, IonHeader, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import BoardCanvas from '../components/board/BoardCanvas';
import TopNavbar from '../components/layout/TopNavbar';
import TaskDetailModal from '../components/task-modal/TaskDetailModal';
import FilterPanel from '../components/filters/FilterPanel';
import type { Task, ColumnId } from '../types/board.types';

function BoardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [newTaskColumnId, setNewTaskColumnId] = useState<ColumnId | undefined>();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filterPanelPosition, setFilterPanelPosition] = useState({ top: 70, left: 100 });

  const openTaskModal = (task?: Task | ColumnId, columnId?: ColumnId) => {
    // Handle both task object and columnId string
    if (typeof task === 'string') {
      // It's a columnId string, treat as add task
      setEditingTask(undefined);
      setNewTaskColumnId(task);
    } else {
      // It's a task object or undefined
      setEditingTask(task);
      setNewTaskColumnId(columnId);
    }
    setIsModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
    setNewTaskColumnId(undefined);
  };

  return (
    <>
      <IonHeader className="ion-no-border" style={{overflow: 'visible'}}>
        <TopNavbar
          isFilterPanelOpen={isFilterPanelOpen}
          setIsFilterPanelOpen={setIsFilterPanelOpen}
          onFilterButtonPosition={setFilterPanelPosition}
        />
      </IonHeader>
      <IonContent className="ion-no-padding" scrollY={true}>
        <div style={{ marginTop: '5px', zIndex: 0 }}>
          <BoardCanvas onTaskClick={openTaskModal} onAddTask={openTaskModal} />
        </div>
      </IonContent>

      <TaskDetailModal
        isOpen={isModalOpen}
        onDidDismiss={closeTaskModal}
        task={editingTask}
        columnId={newTaskColumnId}
      />

      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton
          onClick={() => openTaskModal('To Do')}
          style={{ '--background': 'var(--color-accent)' }}
        >
          <IonIcon icon={addOutline} />
        </IonFabButton>
      </IonFab>

      {/* FilterPanel at page level to avoid Ionic component stacking issues */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        position={filterPanelPosition}
      />
    </>
  );
}

export default BoardPage;