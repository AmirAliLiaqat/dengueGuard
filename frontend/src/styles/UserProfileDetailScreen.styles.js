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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    profileHeader: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    avatarContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.m,
      borderWidth: 2,
      borderColor: colors.primary + '40',
      overflow: 'hidden',
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    userName: {
      ...typography.h2,
      color: colors.text,
    },
    badge: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      marginTop: 8,
    },
    badgeText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: 'bold',
    },
    infoSection: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.m,
      marginBottom: spacing.xl,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    infoRow: {
      flexDirection,
      alignItems: 'center',
      marginBottom: spacing.m,
    },
    infoTextContainer: {
      flex: 1,
      marginLeft: isRTL ? 0 : spacing.m,
      marginRight: isRTL ? spacing.m : 0,
    },
    infoLabel: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign,
    },
    infoValue: {
      ...typography.body,
      color: colors.text,
      fontWeight: '500',
      textAlign,
    },
    reportSection: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.text,
      marginBottom: spacing.m,
      textAlign,
    },
    reportCard: {
      backgroundColor: colors.card,
      padding: spacing.m,
      borderRadius: 16,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    reportHeader: {
      flexDirection,
      alignItems: 'center',
      marginBottom: 8,
    },
    reportTitle: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      marginLeft: isRTL ? 0 : 8,
      marginRight: isRTL ? 8 : 0,
      flex: 1,
      textAlign,
    },
    reportMeta: {
      flexDirection,
      alignItems: 'center',
      marginBottom: 8,
    },
    reportDate: {
      ...typography.caption,
      color: colors.textMuted,
      marginLeft: 4,
    },
    reportSummary: {
      ...typography.caption,
      color: colors.accent,
      fontWeight: 'bold',
      textAlign,
    },
    emptyReports: {
      padding: spacing.xl,
      alignItems: 'center',
    },
    emptyText: {
      ...typography.body,
      color: colors.textMuted,
    },
  });
};

