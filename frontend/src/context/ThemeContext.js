import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';
import { getTheme } from '../theme/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Default to light mode as requested
  const [isDark, setIsDark] = useState(false);

  const theme = getTheme(isDark);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  /* // Commenting out system listener to prioritize user default/choice
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Logic for system theme is disabled for now
    });
    return () => subscription.remove();
  }, []); */

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
