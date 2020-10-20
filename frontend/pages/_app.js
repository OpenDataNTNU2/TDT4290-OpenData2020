import '../styles/globals.css';
import { ThemeProvider } from '@material-ui/core/styles';
import Header from '../Components/Header';
import { theme } from '../utils/theme';

// This will always render everything, so we can have the header (with the navbar here)
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Header {...pageProps} />
        <Component {...pageProps} />
      </ThemeProvider>
    </div>
  );
}

export default MyApp;
