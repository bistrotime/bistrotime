import React from 'react';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { SnackbarProvider } from 'notistack';

import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Bistrotime from './bistrotime';

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  insertionPoint: 'jss-insertion-point',
});

const App = () => ((
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <SnackbarProvider maxSnack={3}>
      <CssBaseline />
      <Bistrotime />
    </SnackbarProvider>
  </JssProvider>
));

export default App;
