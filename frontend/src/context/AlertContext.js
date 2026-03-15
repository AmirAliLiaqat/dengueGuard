import React, { createContext, useContext, useState, useCallback } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState(null);

  const showAlert = useCallback(({ title, message, type = 'info', buttons = [] }) => {
    setAlertConfig({
      title,
      message,
      type,
      buttons,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig(null);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, alertConfig }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
