import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, ArrowRight } from 'lucide-react-native';
import { useAlert } from '../context/AlertContext';
import { useVerifyOtpMutation } from '../services/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';

const VerificationScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const { showAlert } = useAlert();
  
  const email = route.params?.email || '';
  const purpose = route.params?.purpose || 'signup';

  const styles = createStyles(theme, isRTL);

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      showAlert({
        title: "Error",
        message: "Please enter the complete 6-digit code.",
        type: "error"
      });
      return;
    }

    try {
      const result = await verifyOtp({ email, otp_code: otpString, purpose }).unwrap();
      
      showAlert({
        title: "Success",
        message: "Email verified successfully!",
        type: "success"
      });

      if (result.access_token) {
        dispatch(setCredentials({ 
          access_token: result.access_token,
          user: { email } 
        }));
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log('Verification error details:', error);
      let errorMessage = "Invalid code.";
      
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
        title: "Verification Failed",
        message: errorMessage,
        type: "error"
      });
    }
  };

  const handleOtpChange = (value, index) => {
    // Only allow numbers
    if (value && isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
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
            <View style={styles.iconContainer}>
              <Mail color={colors.primary} size={40} />
            </View>
            <Text style={styles.title}>Email Verification</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit verification code to{"\n"}
              <Text style={{ color: colors.text, fontWeight: 'bold' }}>{email}</Text>
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.otpInputsContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={inputRefs[index]}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  placeholder="-"
                  placeholderTextColor={colors.textMuted}
                />
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.verifyButton, isLoading && { opacity: 0.7 }]} 
              onPress={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <>
                  <Text style={styles.verifyButtonText}>Verify & Continue</Text>
                  <ArrowRight color={colors.background} size={20} style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resendButton}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme, isRTL) => {
  const { colors, typography, spacing } = theme;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { flexGrow: 1, padding: spacing.xl, justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: spacing.xl * 2 },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.l,
    },
    title: { ...typography.h1, color: colors.text, marginBottom: spacing.s },
    subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center', lineHeight: 24 },
    form: { width: '100%' },
    otpInputsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xl,
    },
    otpInput: {
      width: 48,
      height: 58,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      color: colors.text,
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 0,
    },
    verifyButton: {
      backgroundColor: colors.primary,
      height: 56,
      borderRadius: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    verifyButtonText: { color: colors.background, fontSize: 18, fontWeight: 'bold' },
    resendButton: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
    resendText: { ...typography.body, color: colors.textMuted },
    resendLink: { ...typography.body, color: colors.primary, fontWeight: 'bold' },
  });
};

export default VerificationScreen;
