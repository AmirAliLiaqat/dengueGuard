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
  SafeAreaView,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react-native';

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const styles = createStyles(theme, isRTL);

  const handleLogin = () => {
    // Navigate to main app (tabs)
    navigation.replace('Main');
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
                  secureTextEntry
                  textAlign={isRTL ? 'right' : 'left'}
                />
              </View>
            </View>

            {/* <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>{t('forgot_password')}</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>{t('login_btn')}</Text>
            </TouchableOpacity>
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
      borderRadius: 50,
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      overflow: 'hidden',
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
