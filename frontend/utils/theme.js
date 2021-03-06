import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2585D9',
    },
    secondary: {
      main: '#F2CE1B',
    },
  },
  status: {
    error: '#f44336',
  },
});
export default theme;
