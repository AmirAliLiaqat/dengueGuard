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
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitleText: {
      ...typography.caption,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginBottom: spacing.m,
      letterSpacing: 1,
      color: colors.textMuted,
      textAlign,
    },
    settingItem: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: spacing.m,
      borderRadius: 16,
      marginBottom: spacing.s,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    itemIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    itemLabel: {
      flex: 1,
      ...typography.body,
      textAlign,
      color: colors.text,
    },
    languageContainer: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      overflow: 'hidden',
    },
    languageOption: {
      flexDirection,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder,
    },
    languageOptionActive: {
      backgroundColor: colors.primary + '0D',
    },
    languageText: {
      ...typography.body,
      color: colors.text,
    },
    languageTextActive: {
      color: colors.primary,
      fontWeight: 'bold',
    },
    footer: {
      paddingVertical: spacing.m,
      alignItems: 'center',
    },
    versionText: {
      ...typography.caption,
      color: colors.textMuted,
    },
  });
};

