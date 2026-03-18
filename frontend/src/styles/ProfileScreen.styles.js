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
    scrollContent: {
      padding: spacing.l,
    },
    header: {
      alignItems: 'center',
      marginTop: spacing.xl,
      marginBottom: spacing.l,
    },
    imageContainer: {
      marginBottom: spacing.m,
    },
    placeholderImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.glassBorder,
      overflow: 'hidden',
    },
    avatarImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    nameText: {
      ...typography.h2,
      color: colors.text,
      textAlign: 'center',
    },
    emailText: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign: 'center',
    },
    statsContainer: {
      flexDirection,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.m,
      marginBottom: spacing.xl,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    statBox: {
      flex: 1,
      alignItems: 'center',
    },
    statBorder: {
      borderLeftWidth: isRTL ? 0 : 1,
      borderRightWidth: isRTL ? 1 : 0,
      borderColor: colors.glassBorder,
    },
    statValue: {
      ...typography.h3,
      color: colors.primary,
    },
    statLabel: {
      ...typography.caption,
      marginTop: 4,
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
    menuItem: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: spacing.m,
      borderRadius: 12,
      marginBottom: spacing.s,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    menuIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    menuLabel: {
      flex: 1,
      ...typography.body,
      color: colors.text,
      textAlign,
    },
    logoutButton: {
      flexDirection,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.glass,
      padding: spacing.m,
      borderRadius: 12,
      marginBottom: spacing.xl,
      borderWidth: 1,
      borderColor: colors.error + '40',
    },
    logoutText: {
      ...typography.body,
      color: colors.error,
      fontWeight: 'bold',
      marginLeft: isRTL ? 0 : spacing.s,
      marginRight: isRTL ? spacing.s : 0,
    },
  });
};

