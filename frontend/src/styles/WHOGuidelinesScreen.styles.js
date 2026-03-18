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
    content: {
      padding: spacing.l,
    },
    heroCard: {
      backgroundColor: colors.primary,
      borderRadius: 24,
      padding: spacing.xl,
      alignItems: 'center',
      marginBottom: spacing.xl,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 15,
      elevation: 10,
    },
    heroTitle: {
      ...typography.h2,
      color: '#FFFFFF',
      marginTop: spacing.m,
      textAlign: 'center',
    },
    heroSubtitle: {
      ...typography.caption,
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      marginTop: 4,
    },
    sectionCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: spacing.l,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    sectionHeader: {
      flexDirection,
      alignItems: 'center',
      marginBottom: spacing.s,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.s : 0,
      marginRight: isRTL ? 0 : spacing.s,
    },
    sectionTitle: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
    },
    sectionContent: {
      ...typography.caption,
      color: colors.textMuted,
      lineHeight: 20,
      textAlign,
    },
    externalLink: {
      marginTop: spacing.m,
      padding: spacing.m,
      borderWidth: 1,
      borderColor: colors.primary + '4D',
      borderRadius: 12,
      backgroundColor: colors.primary + '0D',
    },
    linkContent: {
      flexDirection,
      alignItems: 'center',
      justifyContent: 'center',
    },
    linkText: {
      ...typography.body,
      color: colors.primary,
      fontWeight: 'bold',
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
    },
  });
};

