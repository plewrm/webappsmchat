import React, { createContext, useContext, useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import usePrefersColorScheme from '../themehook/usePrefersColorScheme';
import { useMediaQuery } from '@mui/material';

if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const prefersColorScheme = usePrefersColorScheme();

  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem('isDarkMode');
    if (storedTheme !== null) {
      return JSON.parse(storedTheme);
    }
    return prefersColorScheme === 'dark';
  };

  const [isDarkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    const newMode = prefersColorScheme !== 'dark';
    setDarkMode(newMode);
    localStorage.setItem('isDarkMode', JSON.stringify(newMode));
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
  }, [prefersColorScheme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // console.log('Show value of dark light', isDarkMode);

  return <ThemeContext.Provider value={{ isDarkMode }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
