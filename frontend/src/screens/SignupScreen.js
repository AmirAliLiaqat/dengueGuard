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
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react-native';

const SignupScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const styles = createStyles(theme, isRTL);

  const handleSignup = () => {
    console.log('Signup data:', formData);
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
                  placeholder="+92 300 0000000"
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
                  secureTextEntry
                  textAlign={isRTL ? 'right' : 'left'}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>{t('signup_btn')}</Text>
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
