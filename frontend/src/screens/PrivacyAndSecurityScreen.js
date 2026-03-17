import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ShieldCheck, Lock, Eye, Fingerprint } from 'lucide-react-native';
import { useAlert } from '../context/AlertContext';
import {
  useGetMeQuery,
  useUpdateProfileMutation,
  useRequest2faOtpMutation,
  useVerifyOtpMutation,
  useLoginMutation
} from '../services/api';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const PrivacyAndSecurityScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const { showAlert } = useAlert();
  const styles = createStyles(theme, isRTL);

  const { data: userData } = useGetMeQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [request2faOtp, { isLoading: isRequestingOtp }] = useRequest2faOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  const [isFaceID, setIsFaceID] = useState(false);
  const [isTwoFactor, setIsTwoFactor] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 2FA Modal States
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Biometric Modal States
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [biometricPassword, setBiometricPassword] = useState('');
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [login] = useLoginMutation();

  useEffect(() => {
    if (userData) {
      setIsFaceID(userData.biometric_enabled ?? false);
      setIsTwoFactor(userData.two_factor_enabled ?? false);
      setIsVisible(userData.is_public ?? false);
      setSecondaryEmail(userData.secondary_email ?? '');
    }
  }, [userData]);

  const handleBiometricToggle = async (currentValue) => {
    const newValue = !currentValue;
    
    if (newValue) {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        
        if (!hasHardware || !isEnrolled) {
          showAlert({
            title: t('biometric_not_available'),
            message: t('biometric_hardware_error'),
            type: 'error'
          });
          return;
        }

        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: t('authenticate_enable_biometric'),
        });

        if (result.success) {
          setShowBiometricModal(true);
          setBiometricPassword('');
        }
      } catch (error) {
        console.error('Biometric Error:', error);
      }
    } else {
      // Disable biometrics - clear stored credentials
      await SecureStore.deleteItemAsync('user_email');
      await SecureStore.deleteItemAsync('user_password');
      processToggle('biometric', true, false);
    }
  };

  const confirmBiometricEnable = async () => {
    if (!biometricPassword) return;
    
    setIsVerifyingPassword(true);
    try {
      // Verify password with backend before storing
      await login({ email: userData.email, password: biometricPassword }).unwrap();
      
      // Store credentials securely
      await SecureStore.setItemAsync('user_email', userData.email);
      await SecureStore.setItemAsync('user_password', biometricPassword);
      
      // Update backend toggle
      await processToggle('biometric', false, true);
      
      setShowBiometricModal(false);
      showAlert({ 
        title: t('success'), 
        message: t('biometric_enabled_msg'), 
        type: 'success' 
      });
    } catch (err) {
      showAlert({ 
        title: t('error'), 
        message: t('invalid_password_biometric'), 
        type: 'error' 
      });
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  const handle2FAToggle = async (currentValue) => {
    if (!currentValue) {
      setShow2FAModal(true);
      setIsOtpSent(false);
      setOtpCode('');
    } else {
      processToggle('2fa', currentValue, false);
    }
  };

  const sendOtpToSecondary = async () => {
    if (!secondaryEmail || !secondaryEmail.includes('@')) {
      showAlert({ title: t('error'), message: t('valid_secondary_email_error'), type: 'error' });
      return;
    }
    try {
      await request2faOtp(secondaryEmail).unwrap();
      setIsOtpSent(true);
      showAlert({ title: t('success'), message: t('verification_code_sent') + secondaryEmail, type: 'success' });
    } catch (err) {
      showAlert({ title: t('failed') || t('error'), message: err.data?.detail || t('otp_failed_msg'), type: 'error' });
    }
  };

  const verifyAndEnable2FA = async () => {
    if (otpCode.length < 4) return;
    try {
      await verifyOtp({
        email: secondaryEmail,
        otp_code: otpCode,
        purpose: '2fa_verify'
      }).unwrap();

      await updateProfile({
        two_factor_enabled: true,
        secondary_email: secondaryEmail
      }).unwrap();

      setShow2FAModal(false);
      setIsTwoFactor(true);
      showAlert({ title: t('enable_2fa'), message: t('two_factor_active_msg'), type: 'success' });
    } catch (err) {
      showAlert({ title: t('invalid_code') || t('error'), message: t('incorrect_otp_msg'), type: 'error' });
    }
  };

  const toggleSetting = async (id, currentValue) => {
    if (id === 'biometric') {
      handleBiometricToggle(currentValue);
      return;
    }

    if (id === '2fa') {
      handle2FAToggle(currentValue);
      return;
    }

    const newValue = !currentValue;

    // Special handling for visibility - confirm when turning OFF
    if (id === 'visibility' && currentValue === true) {
      showAlert({
        title: t('profile_private_title'),
        message: t('profile_private_msg'),
        type: 'warning',
        buttons: [
          { text: t('cancel'), style: "cancel" },
          {
            text: t('yes_make_private'),
            onPress: () => processToggle(id, currentValue, newValue),
          }
        ]
      });
      return;
    }

    processToggle(id, currentValue, newValue);
  };

  const processToggle = async (id, currentValue, newValue) => {
    // Optimistic Update
    if (id === 'biometric') setIsFaceID(newValue);
    if (id === '2fa') setIsTwoFactor(newValue);
    if (id === 'visibility') setIsVisible(newValue);

    try {
      const updateData = {};
      if (id === 'biometric') updateData.biometric_enabled = newValue;
      if (id === '2fa') updateData.two_factor_enabled = newValue;
      if (id === 'visibility') updateData.is_public = newValue;

      await updateProfile(updateData).unwrap();

      if (id === 'visibility' && newValue) {
        showAlert({
          title: t('visibility'),
          message: t('profile_public_msg'),
          type: 'success'
        });
      }
    } catch (err) {
      console.error('Failed to update privacy setting:', err);
      // Revert on error
      if (id === 'biometric') setIsFaceID(currentValue);
      if (id === '2fa') setIsTwoFactor(currentValue);
      if (id === 'visibility') setIsVisible(currentValue);

      showAlert({
        title: t('error'),
        message: t('update_setting_error'),
        type: 'error'
      });
    }
  };

  const securitySettings = [
    {
      id: 'biometric',
      title: t('biometric_access'),
      subtitle: t('biometric_subtitle'),
      icon: Fingerprint,
      value: isFaceID,
      onToggle: () => toggleSetting('biometric', isFaceID)
    },
    {
      id: '2fa',
      title: t('two_factor'),
      subtitle: t('two_factor_subtitle'),
      icon: Lock,
      value: isTwoFactor,
      onToggle: () => toggleSetting('2fa', isTwoFactor)
    },
    {
      id: 'visibility',
      title: t('visibility'),
      subtitle: t('visibility_subtitle'),
      icon: Eye,
      value: isVisible,
      onToggle: () => toggleSetting('visibility', isVisible)
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('privacy_security')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconContainer}>
          <ShieldCheck color={colors.success} size={64} />
        </View>
        <Text style={styles.introText}>
          {t('security_priority')}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('security_settings')}</Text>
          {securitySettings.map((item) => (
            <View key={item.id} style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <item.icon color={colors.primary} size={22} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{ false: colors.glassBorder, true: colors.primary }}
                thumbColor={item.value ? '#FFFFFF' : colors.textMuted}
              />
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{t('data_policy')}</Text>
          <Text style={styles.infoText}>
            {t('data_policy_desc')}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => showAlert({
            title: t('request_sent'),
            message: t('request_deletion_msg'),
            type: 'info'
          })}
        >
          <Text style={styles.deleteText}>{t('request_deletion')}</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={show2FAModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShow2FAModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('enable_2fa')}</Text>
            <Text style={styles.modalSubtitle}>{t('verify_secondary_email_2fa')}</Text>

            <TextInput
              style={styles.modalInput}
              placeholder={t('secondary_email_label')}
              placeholderTextColor={colors.textMuted}
              value={secondaryEmail}
              onChangeText={setSecondaryEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isOtpSent}
            />

            {isOtpSent && (
              <TextInput
                style={styles.modalInput}
                placeholder={t('enter_otp')}
                placeholderTextColor={colors.textMuted}
                value={otpCode}
                onChangeText={setOtpCode}
                keyboardType="number-pad"
                maxLength={4}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.glass }]}
                onPress={() => setShow2FAModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              {!isOtpSent ? (
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.primary }]}
                  onPress={sendOtpToSecondary}
                  disabled={isRequestingOtp}
                >
                  {isRequestingOtp ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.modalButtonText}>{t('send_otp')}</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.success }]}
                  onPress={verifyAndEnable2FA}
                  disabled={isVerifyingOtp}
                >
                  {isVerifyingOtp ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.modalButtonText}>{t('verify_enable')}</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showBiometricModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBiometricModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('secure_biometric_login')}</Text>
            <Text style={styles.modalSubtitle}>{t('enter_password_biometric')}</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder={t('your_password')}
              placeholderTextColor={colors.textMuted}
              value={biometricPassword}
              onChangeText={setBiometricPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.glass }]} 
                onPress={() => setShowBiometricModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.primary }]} 
                onPress={confirmBiometricEnable}
                disabled={isVerifyingPassword}
              >
                {isVerifyingPassword ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.modalButtonText}>{t('enable')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    header: {
      flexDirection,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.m,
      paddingTop: spacing.xl,
      paddingBottom: spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    headerTitle: {
      ...typography.h2,
      color: colors.text,
    },
    scrollContent: {
      padding: spacing.l,
    },
    iconContainer: {
      alignItems: 'center',
      marginVertical: spacing.xl,
    },
    introText: {
      ...typography.body,
      textAlign: 'center',
      marginBottom: spacing.xl,
      color: colors.textMuted,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.h3,
      marginBottom: spacing.m,
      color: colors.text,
      textAlign,
    },
    settingItem: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: spacing.m,
      borderRadius: 16,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    settingText: {
      flex: 1,
    },
    settingTitle: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
    },
    settingSubtitle: {
      ...typography.caption,
      fontSize: 12,
      color: colors.textMuted,
      textAlign,
    },
    infoCard: {
      backgroundColor: colors.glass,
      padding: spacing.m,
      borderRadius: 16,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: colors.glassBorder,
      marginBottom: spacing.xl,
    },
    infoTitle: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 8,
      textAlign,
    },
    infoText: {
      ...typography.caption,
      color: colors.text,
      lineHeight: 20,
      textAlign,
    },
    deleteButton: {
      backgroundColor: colors.error + '1A',
      padding: spacing.m,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: spacing.xl,
      borderWidth: 1,
      borderColor: colors.error + '33',
    },
    deleteText: {
      color: colors.error,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.l,
    },
    modalContent: {
      width: '100%',
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: spacing.l,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    modalTitle: {
      ...typography.h2,
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    modalSubtitle: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.l,
      textAlign: 'center',
    },
    modalInput: {
      backgroundColor: colors.glass,
      borderRadius: 12,
      padding: spacing.m,
      color: colors.text,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      textAlign,
    },
    modalButtons: {
      flexDirection,
      justifyContent: 'space-between',
      marginTop: spacing.s,
    },
    modalButton: {
      flex: 0.48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalButtonText: {
      ...typography.body,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
  });
};

export default PrivacyAndSecurityScreen;
