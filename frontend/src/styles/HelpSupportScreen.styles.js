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
    sectionTitle: {
      ...typography.h3,
      color: colors.text,
      marginBottom: spacing.m,
      textAlign,
    },
    faqList: {
      marginBottom: spacing.l,
    },
    faqItem: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.m,
      marginBottom: spacing.s,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    faqHeader: {
      flexDirection,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    faqQuestion: {
      flex: 1,
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
      marginRight: isRTL ? 0 : 10,
      marginLeft: isRTL ? 10 : 0,
    },
    faqAnswer: {
      ...typography.body,
      color: colors.textMuted,
      marginTop: spacing.m,
      lineHeight: 22,
      textAlign,
    },
    contactItem: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: spacing.m,
      borderRadius: 16,
      marginBottom: spacing.s,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    contactIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    contactContent: {
      flex: 1,
    },
    contactLabel: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign,
    },
    contactInfo: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
    },
    helpCard: {
      backgroundColor: colors.primary + '1A',
      borderRadius: 24,
      padding: spacing.xl,
      marginVertical: spacing.xl,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.primary + '33',
    },
    helpCardTitle: {
      ...typography.h3,
      color: colors.primary,
      marginBottom: 4,
    },
    helpCardSub: {
      ...typography.caption,
      color: colors.text,
      textAlign: 'center',
      marginBottom: spacing.m,
    },
    chatButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.m,
      borderRadius: 12,
    },
    chatButtonText: {
      color: colors.background,
      fontWeight: 'bold',
    },
  });
};

