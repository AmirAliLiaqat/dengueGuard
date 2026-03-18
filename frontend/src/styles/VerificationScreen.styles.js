import { StyleSheet } from 'react-native';

export const createStyles = (theme, isRTL) => {
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

