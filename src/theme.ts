import { createTheme, ThemeOptions } from '@mui/material/styles';

export const getThemeOptions = (): ThemeOptions => ({
  palette: {
    primary: {
      main: '#000000', // Placeholder color
    },
    background: {
      default: '#ffffff', // Placeholder color
      paper: '#f0f0f0', // Placeholder color
    },
    text: {
      primary: '#000000', // Placeholder color
      secondary: '#666666', // Placeholder color
    },
  },
  typography: {
    fontFamily: 'inherit',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: '#cccccc', // Placeholder color
            },
            '&:hover fieldset': {
              borderColor: '#000000', // Placeholder color
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000', // Placeholder color
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
        },
      },
    },
  },
});

export const theme = createTheme(getThemeOptions());