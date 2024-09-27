import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getThemeOptions } from './theme';

export const getCSSVariableValue = (variable: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(createTheme(getThemeOptions()));

  useEffect(() => {
    const updatedThemeOptions = getThemeOptions();
    updatedThemeOptions.palette = {
      ...updatedThemeOptions.palette,
      primary: {
        main: getCSSVariableValue('--button-color'),
      },
      secondary: {
        main: getCSSVariableValue('--header-bg-color'),
        contrastText: getCSSVariableValue('--header-text-color'),
      },
      background: {
        default: getCSSVariableValue('--secondary-bg-color'),
        paper: getCSSVariableValue('--section-bg-color'),
      },
      text: {
        primary: getCSSVariableValue('--text-color'),
        secondary: getCSSVariableValue('--subtitle-text-color'),
      },
    };

    if (updatedThemeOptions.components?.MuiTextField?.styleOverrides?.root) {
      const root = updatedThemeOptions.components.MuiTextField.styleOverrides.root as Record<string, any>;
      root['& .MuiOutlinedInput-root']['& fieldset'].borderColor = getCSSVariableValue('--hint-color');
      root['& .MuiOutlinedInput-root']['&:hover fieldset'].borderColor = getCSSVariableValue('--button-color');
      root['& .MuiOutlinedInput-root']['&.Mui-focused fieldset'].borderColor = getCSSVariableValue('--button-color');
    }

    setTheme(createTheme(updatedThemeOptions));
  }, []);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};