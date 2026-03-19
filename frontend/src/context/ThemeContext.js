import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTheme } from '../theme/theme';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = 'app_theme_is_dark_v1';

export const ThemeProvider = ({ children }) => {
  // Default to light mode; hydrate from storage on mount.
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (!mounted) return;
        if (stored === 'true') setIsDark(true);
        if (stored === 'false') setIsDark(false);
      } catch {
        // ignore and keep default
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const theme = getTheme(isDark);

  const toggleTheme = async () => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(THEME_STORAGE_KEY, next ? 'true' : 'false').catch(
        () => {
          // ignore
        }
      );
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
