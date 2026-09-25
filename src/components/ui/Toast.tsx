import { createContext, useContext, useState, useCallback } from 'react';
import { IonToast } from '@ionic/react';
import type { ReactNode } from 'react';

interface ToastState {
  message: string;
  color: string;
  isOpen: boolean;
}

interface ToastContextValue {
  showToast: (message: string, color?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastState, setToastState] = useState<ToastState>({
    message: '',
    color: 'success',
    isOpen: false,
  });

  const showToast = useCallback((message: string, color: string = 'success') => {
    setToastState({ message, color, isOpen: true });
  }, []);

  const onDidDismiss = () => {
    setToastState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <IonToast
        isOpen={toastState.isOpen}
        message={toastState.message}
        color={toastState.color}
        position="top"
        duration={2000}
        onDidDismiss={onDidDismiss}
      />
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { useToast };

function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
