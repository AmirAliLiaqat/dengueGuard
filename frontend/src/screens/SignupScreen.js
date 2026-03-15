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
import { Mail, Lock, User, Phone, UserPlus, Eye, EyeOff } from 'lucide-react-native';
import { useAlert } from '../context/AlertContext';

import { useSignupMutation } from '../services/api';

const SignupScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const [signup, { isLoading }] = useSignupMutation();
  const { showAlert } = useAlert();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const styles = createStyles(theme, isRTL);

  const handleSignup = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      showAlert({
        title: "Error",
        message: "Please fill all fields",
        type: "error"
      });
      return;
    }
    
    try {
      await signup({
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        phone: formData.phone,
      }).unwrap();
      
      navigation.navigate('Verification', { email: formData.email });
    } catch (error) {
      console.log('Signup error details:', error);
      let errorMessage = "Something went wrong";
      
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
        title: "Signup Failed",
        message: errorMessage,
        type: "error"
      });
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
            <Text style={styles.title}>{t('signup_btn')}</Text>
            <Text style={styles.subtitle}>{t('signup_subtitle')}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('name')}</Text>
              <View style={styles.inputWrapper}>
                <User color={colors.textMuted} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('full_name')}
                  placeholderTextColor={colors.textMuted}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  textAlign={isRTL ? 'right' : 'left'}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('email')}</Text>
              <View style={styles.inputWrapper}>
                <Mail color={colors.textMuted} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor={colors.textMuted}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textAlign={isRTL ? 'right' : 'left'}
                />
              </View>
            </View>


            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('phone_number')}</Text>
              <View style={styles.inputWrapper}>
                <Phone color={colors.textMuted} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="+1 234 567 890"
                  placeholderTextColor={colors.textMuted}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  keyboardType="phone-pad"
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
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
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

            <TouchableOpacity 
              style={[styles.signupButton, isLoading && { opacity: 0.8 }]} 
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.signupButtonText}>{t('signup_btn')}</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('have_account')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>{t('login_btn')}</Text>
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
      marginBottom: spacing.xl,
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
    signupButton: {
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
      marginTop: spacing.m,
    },
    signupButtonText: {
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
    loginText: {
      ...typography.body,
      color: colors.primary,
      fontWeight: 'bold',
    },
  });
};

export default SignupScreen;
