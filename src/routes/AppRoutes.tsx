import { IonReactRouter } from '@ionic/react-router';
import { Route, Switch, Redirect } from 'react-router-dom';
import BoardPage from '../pages/BoardPage';
import NotFoundPage from '../pages/NotFoundPage';

function AppRoutes() {
  return (
    <IonReactRouter>
      <Switch>
        <Route exact path="/" component={BoardPage} />
        <Route path="/404" component={NotFoundPage} />
        <Redirect from="*" to="/404" />
      </Switch>
    </IonReactRouter>
  );
}

export default AppRoutes;