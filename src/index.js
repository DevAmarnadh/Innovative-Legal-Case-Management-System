import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a custom theme with enhanced 3D effects
let theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
      light: '#534bae',
      dark: '#000051',
    },
    secondary: {
      main: '#c5cae9',
      light: '#f8fdff',
      dark: '#9499b7',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 10px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
        elevation2: {
          boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
        },
        elevation3: {
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        },
        elevation4: {
          boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            },
          },
        },
      },
    },
  },
});

// Make the theme responsive
theme = responsiveFontSizes(theme);

// Add global styles
const globalStyles = `
  body {
    margin: 0;
    padding: 0;
    background: ${theme.palette.background.default};
    min-height: 100vh;
    font-family: ${theme.typography.fontFamily};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.palette.background.default};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.palette.primary.main}40;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.palette.primary.main}80;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Better focus outline */
  *:focus {
    outline: 2px solid ${theme.palette.primary.main}40 !important;
    outline-offset: 2px !important;
  }

  /* Animation classes */
  .fade-enter {
    opacity: 0;
    transform: translateY(20px);
  }

  .fade-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 300ms ease-in, transform 300ms ease-out;
  }

  .fade-exit {
    opacity: 1;
    transform: translateY(0);
  }

  .fade-exit-active {
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 300ms ease-in, transform 300ms ease-out;
  }
`;

// Create style element
const styleElement = document.createElement('style');
styleElement.innerHTML = globalStyles;
document.head.appendChild(styleElement);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
