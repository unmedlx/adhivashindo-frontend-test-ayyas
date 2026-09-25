import { useState, useEffect } from 'react';
import { IonToolbar, IonButton, IonSearchbar, IonIcon } from '@ionic/react';
import { chevronDownOutline, filterOutline, swapVerticalOutline, lockClosedOutline, personAddOutline } from 'ionicons/icons';
import { useBoard } from '../../store/BoardProvider';
import { useToast } from '../ui/Toast';
import { MEMBERS } from '../../data/members';
import AvatarStack from '../ui/AvatarStack';
import FilterPanel from '../filters/FilterPanel';

export function TopNavbar() {
  const { setSearch } = useBoard();
  const { showToast } = useToast();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, setSearch]);

  const handleInviteClick = () => {
    showToast('Fitur invite anggota akan segera hadir');
  };

  const handleExportImportClick = () => {
    showToast('Fitur export/import akan segera hadir');
  };

  const handleFilterClick = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const handleSearchChange = (e: CustomEvent) => {
    setSearchValue(e.detail.value as string);
  };

  return (
    <IonToolbar
      style={{
        '--background': 'var(--color-surface)',
        '--color': 'var(--color-text)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        borderBottom: '1px solid var(--color-border)',
        '--min-height': '52px',
        '--padding-top': '8px',
        '--padding-bottom': '8px',
      } as React.CSSProperties}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {/* Left cluster */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {/* Brand */}
          <div
            style={{
              fontWeight: 500,
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              cursor: 'default',
            }}
          >
            <IonIcon
              icon={lockClosedOutline}
              style={{
                fontSize: '16px',
                fontWeight: 700,
              }}
            />
            Adhivasindo
            <IonIcon icon={chevronDownOutline} style={{ color: 'var(--color-muted)', fontSize: '10px', marginLeft: '1px' }} />
          </div>

          {/* Avatar stack */}
          <AvatarStack members={MEMBERS} maxVisible={4} />

          {/* Invite button */}
          <IonButton
            fill="solid"
            onClick={handleInviteClick}
            style={{
              '--border-radius': '8px',
              '--background': 'var(--color-surface-2)',
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
              e.currentTarget.style.setProperty('--background', 'var(--color-surface-2)');
            }}
          >
            <IonIcon icon={personAddOutline} slot="start" style={{ marginRight: '6px', fontSize: '15px'}} />
            Invite
          </IonButton>
        </div>

        {/* Right cluster */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {/* Filter button */}
          <div style={{ position: 'relative' }}>
            <IonButton
              fill="solid"
              onClick={handleFilterClick}
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
              <IonIcon icon={filterOutline} slot="start" style={{ marginRight: '6px' }} />
              Filter
            </IonButton>
            
            <FilterPanel isOpen={isFilterPanelOpen} onClose={() => setIsFilterPanelOpen(false)} />
          </div>

          {/* Export/Import button */}
          <IonButton
            fill="solid"
            onClick={handleExportImportClick}
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
            <IonIcon icon={swapVerticalOutline} slot="start" style={{ marginRight: '6px' }} />
            Export / Import
          </IonButton>

          {/* Search bar */}
          <IonSearchbar
            placeholder="Search Tasks"
            debounce={150}
            onIonInput={handleSearchChange}
            style={{
              maxWidth: '250px',
              '--background': 'var(--color-surface-2)',
              '--border-radius': 'var(--radius-sm)',
              '--box-shadow': 'none',
              '--color': 'var(--color-text)',
              '--placeholder-color': 'var(--color-muted)',
              '--icon-color': 'var(--color-muted)',
              padding: '0',
            } as React.CSSProperties}
          />
        </div>
      </div>
    </IonToolbar>
  );
}

export default TopNavbar;