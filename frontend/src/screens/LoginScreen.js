import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, Eye, EyeOff, Fingerprint } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useAlert } from '../context/AlertContext';

import { useLoginMutation, useGetMeQuery } from '../services/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [hasStoredCredentials, setHasStoredCredentials] = useState(false);

  React.useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const storedEmail = await SecureStore.getItemAsync('user_email');
    const storedPass = await SecureStore.getItemAsync('user_password');

    setIsBiometricSupported(hasHardware && isEnrolled);
    setHasStoredCredentials(!!(storedEmail && storedPass));
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login with Biometrics',
        fallbackLabel: 'Use Password',
      });

      if (result.success) {
        const storedEmail = await SecureStore.getItemAsync('user_email');
        const storedPass = await SecureStore.getItemAsync('user_password');

        if (storedEmail && storedPass) {
          // Fill form and trigger login
          setEmail(storedEmail);
          setPassword(storedPass);
          
          const loginResult = await login({ email: storedEmail, password: storedPass }).unwrap();
          dispatch(setCredentials({ 
            access_token: loginResult.access_token,
            user: { email: storedEmail }
          }));
        }
      }
    } catch (error) {
      console.error('Biometric Login Error:', error);
    }
  };

  const styles = createStyles(theme, isRTL);

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert({
        title: "Error",
        message: "Please enter email and password",
        type: "error"
      });
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      
      // After login, we need to fetch user profile to populate Redux
      // But for now, we'll store the token and navigate. 
      // Ideally, the backend should return user info with token.
      dispatch(setCredentials({ 
        access_token: result.access_token,
        user: { email } // Placeholder, will be updated by getMe
      }));
    } catch (error) {
      if (error.status === 401) {
        showAlert({
          title: "Not Verified",
          message: "Please verify your email first.",
          type: "warning",
          buttons: [
            { text: "Verify Now", onPress: () => navigation.navigate('Verification', { email }) },
            { text: "Cancel", style: "cancel" }
          ]
        });
      } else {
        console.log('Login error details:', error);
        let errorMessage = "Invalid credentials";
        
        if (error.data?.detail) {
          if (Array.isArray(error.data.detail)) {
            errorMessage = error.data.detail.map(err => err.msg).join(', ');
          } else {
            errorMessage = error.data.detail;
          }
        } else if (error.error) {
          errorMessage = "Network error. Check your connection or server.";
        } else if (error.status === 'FETCH_ERROR') {
          errorMessage = "Server unreachable. Make sure the backend is running.";
        }

        showAlert({
          title: "Login Failed",
          message: errorMessage,
          type: "error"
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image source={require('../assets/icon.png')} style={styles.appLogo} />
            </View>
            <Text style={styles.title}>{t('welcome_back')}</Text>
            <Text style={styles.subtitle}>{t('login_subtitle')}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('email')}</Text>
              <View style={styles.inputWrapper}>
                <Mail color={colors.textMuted} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textAlign={isRTL ? 'right' : 'left'}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('password')}</Text>
              <View style={styles.inputWrapper}>
                <Lock color={colors.textMuted} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  textAlign={isRTL ? 'right' : 'left'}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff color={colors.textMuted} size={20} />
                  ) : (
                    <Eye color={colors.textMuted} size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>{t('forgot_password')}</Text>
            </TouchableOpacity> */}

            <View style={styles.loginActions}>
              <TouchableOpacity 
                style={[styles.loginButton, isLoading && { opacity: 0.8 }, isBiometricSupported && hasStoredCredentials && { flex: 0.8 }]} 
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text style={styles.loginButtonText}>{t('login_btn')}</Text>
                )}
              </TouchableOpacity>

              {isBiometricSupported && hasStoredCredentials && (
                <TouchableOpacity 
                  style={styles.biometricButton} 
                  onPress={handleBiometricLogin}
                  disabled={isLoading}
                >
                  <Fingerprint color={colors.primary} size={32} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('no_account')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupText}>{t('signup_btn')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme, isRTL) => {
  const { colors, typography, spacing } = theme;
  const textAlign = isRTL ? 'right' : 'left';
  const flexDirection = isRTL ? 'row-reverse' : 'row';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: spacing.xl,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginTop: spacing.xl,
      marginBottom: spacing.xl * 2,
    },
    logoContainer: {
      width: 100,
      height: 100,
      // borderRadius: 50,
      // backgroundColor: colors.glass,
      // justifyContent: 'center',
      // alignItems: 'center',
      // marginBottom: spacing.m,
      // borderWidth: 1,
      // borderColor: colors.glassBorder,
      // overflow: 'hidden',
    },
    appLogo: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
    },
    title: {
      ...typography.h1,
      color: colors.text,
      marginBottom: spacing.s,
    },
    subtitle: {
      ...typography.body,
      color: colors.textMuted,
      textAlign: 'center',
    },
    form: {
      width: '100%',
    },
    inputGroup: {
      marginBottom: spacing.l,
    },
    label: {
      ...typography.caption,
      color: colors.text,
      fontWeight: 'bold',
      marginBottom: spacing.s,
      textAlign,
    },
    inputWrapper: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      paddingHorizontal: spacing.m,
    },
    inputIcon: {
      marginLeft: isRTL ? spacing.s : 0,
      marginRight: isRTL ? 0 : spacing.s,
    },
    input: {
      flex: 1,
      height: 56,
      color: colors.text,
      ...typography.body,
    },
    eyeIcon: {
      padding: spacing.s,
    },
    forgotPassword: {
      alignSelf: isRTL ? 'flex-start' : 'flex-end',
      marginBottom: spacing.xl,
    },
    forgotPasswordText: {
      ...typography.caption,
      color: colors.primary,
      fontWeight: 'bold',
    },
    loginButton: {
      backgroundColor: colors.primary,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    loginButtonText: {
      color: colors.background,
      fontSize: 18,
      fontWeight: 'bold',
    },
    loginActions: {
      flexDirection,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    biometricButton: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.primary + '33',
    },
    footer: {
      flexDirection,
      justifyContent: 'center',
      marginTop: spacing.xl,
    },
    footerText: {
      ...typography.body,
      color: colors.textMuted,
    },
    signupText: {
      ...typography.body,
      color: colors.primary,
      fontWeight: 'bold',
    },
  });
};

export default LoginScreen;
