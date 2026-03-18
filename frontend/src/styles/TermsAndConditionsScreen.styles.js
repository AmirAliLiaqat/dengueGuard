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
      ...typography.caption,
      textAlign: 'center',
      marginBottom: spacing.xl,
      color: colors.textMuted,
    },
    section: {
      marginBottom: spacing.l,
      backgroundColor: colors.card,
      padding: spacing.m,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.primary,
      marginBottom: spacing.s,
      textAlign,
    },
    sectionContent: {
      ...typography.body,
      fontSize: 14,
      lineHeight: 22,
      color: colors.textMuted,
      textAlign,
    },
    footer: {
      marginTop: spacing.m,
      paddingBottom: spacing.xl,
    },
    footerText: {
      ...typography.caption,
      textAlign: 'center',
      lineHeight: 20,
      color: colors.textMuted,
    },
  });
};

