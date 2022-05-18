import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';

const rgb = 'rgb(252, 181, 3)';
const theme = createTheme({
  palette: {
    primary: {
      light: rgb,
      main: rgb,
      dark: rgb
    },
    secondary: {
      main: rgb,
    },
  },
  typography: {
    useNextVariants: true
  }
});


ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
