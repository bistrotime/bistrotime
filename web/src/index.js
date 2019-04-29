import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';


import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render((
  <SnackbarProvider maxSnack={3}>
    <App />
  </SnackbarProvider>
), document.getElementById('app'));

serviceWorker.unregister();
