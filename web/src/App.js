import React from 'react';
import { SnackbarProvider } from 'notistack';

import { StylesProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Bistrotime from './bistrotime';

const App = () => ((
  <StylesProvider injectFirst>
    <SnackbarProvider maxSnack={3}>
      <CssBaseline />
      <Bistrotime />
    </SnackbarProvider>
  </StylesProvider>
));

export default App;
