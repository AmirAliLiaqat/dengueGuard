import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { AlertProvider } from './src/context/AlertContext';
import CustomAlert from './src/components/CustomAlert';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  const { isDark } = useTheme();
  return (
    <>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style={isDark ? "light" : "dark"} />
        <CustomAlert />
      </NavigationContainer>
    </>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <LanguageProvider>
            <SafeAreaProvider>
              <AlertProvider>
                <AppContent />
              </AlertProvider>
            </SafeAreaProvider>
          </LanguageProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

registerRootComponent(App);
