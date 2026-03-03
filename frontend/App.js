import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  const { isDark } = useTheme();
  return (
    <>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style={isDark ? "light" : "dark"} />
      </NavigationContainer>
    </>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <LanguageProvider>
          <SafeAreaProvider>
            <AppContent />
          </SafeAreaProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
}

registerRootComponent(App);
