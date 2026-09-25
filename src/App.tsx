import { IonApp } from '@ionic/react'
import { BoardProvider } from './store/BoardProvider'
import { ToastProvider } from './components/ui/Toast'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <IonApp>
      <ToastProvider>
        <BoardProvider>
          <AppRoutes />
        </BoardProvider>
      </ToastProvider>
    </IonApp>
  )
}

export default App