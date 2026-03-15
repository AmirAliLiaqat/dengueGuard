import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';
import { Home, ClipboardList, User } from 'lucide-react-native';
import { useSelector } from 'react-redux';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import VerificationScreen from '../screens/VerificationScreen';
import HomeScreen from '../screens/HomeScreen';
import DiagnosisFormScreen from '../screens/DiagnosisFormScreen';
import ResultScreen from '../screens/ResultScreen';
import DoctorPanel from '../screens/DoctorPanel';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ReportDetailsScreen from '../screens/ReportDetailsScreen';
import TermsAndConditionsScreen from '../screens/TermsAndConditionsScreen';
import PrivacyAndSecurityScreen from '../screens/PrivacyAndSecurityScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import AboutScreen from '../screens/AboutScreen';
import HealthTipsScreen from '../screens/HealthTipsScreen';
import WHOGuidelinesScreen from '../screens/WHOGuidelinesScreen';
import NotificationDetailScreen from '../screens/NotificationDetailScreen';
import DengueInfoScreen from '../screens/DengueInfoScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.glassBorder,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={24} />
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color }) => <ClipboardList color={color} size={24} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={24} />
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Verification" component={VerificationScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Diagnose" component={DiagnosisFormScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="Notifications" component={NotificationScreen} />
          <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} />
          <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
          <Stack.Screen name="PrivacyAndSecurity" component={PrivacyAndSecurityScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="Doctor" component={DoctorPanel} />
          <Stack.Screen name="HealthTips" component={HealthTipsScreen} />
          <Stack.Screen name="WHOGuidelines" component={WHOGuidelinesScreen} />
          <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
          <Stack.Screen name="DengueInfo" component={DengueInfoScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
