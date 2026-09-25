import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

function NotFoundPage() {
  const history = useHistory();

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>404 - Page Not Found</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-4xl font-bold text-muted mb-4">404</h1>
          <p className="text-lg mb-6">The page you're looking for doesn't exist.</p>
          <IonButton onClick={() => history.push('/')}>
            Go to Board
          </IonButton>
        </div>
      </IonContent>
    </>
  );
}

export default NotFoundPage;