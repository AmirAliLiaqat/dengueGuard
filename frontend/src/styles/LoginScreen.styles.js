import { StyleSheet } from 'react-native';

export const createStyles = (theme, isRTL) => {
  const { colors, typography, spacing } = theme;
  const textAlign = isRTL ? 'right' : 'left';
  const flexDirection = isRTL ? 'row-reverse' : 'row';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flex: 1,
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
      flex: 1,
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
    loginButtonWithBiometric: {
      flex: 1,
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
      marginLeft: isRTL ? 0 : spacing.m,
      marginRight: isRTL ? spacing.m : 0,
    },
    demoButton: {
      flexDirection,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.primary,
      borderRadius: 16,
      height: 56,
      marginTop: spacing.l,
      width: '100%',
    },
    demoButtonText: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: 'bold',
    },
    demoIcon: {
      marginRight: isRTL ? 0 : spacing.s,
      marginLeft: isRTL ? spacing.s : 0,
    },
    footer: {
      flexDirection,
      justifyContent: 'center',
      alignItems: 'center',
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
      marginLeft: isRTL ? 0 : spacing.xs,
      marginRight: isRTL ? spacing.xs : 0,
    },
  });
};

