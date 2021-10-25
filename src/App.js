import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AuthProvider from './contexts/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cyan } from '@mui/material/colors';

import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';

const mdTheme = createTheme({
  palette: {
    primary: cyan,
  },
}
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={mdTheme}>
          <CssBaseline />
          <ToastContainer autoClose={3000} />
          <Routes />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
