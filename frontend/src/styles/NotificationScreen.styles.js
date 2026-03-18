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
    headerActions: {
      flexDirection,
      alignItems: 'center',
      gap: 10,
    },
    listContent: {
      padding: spacing.l,
    },
    notificationItem: {
      flexDirection,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.m,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    unreadItem: {
      backgroundColor: colors.primary + '0A',
      borderColor: colors.primary + '33',
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    contentContainer: {
      flex: 1,
    },
    itemHeader: {
      flexDirection,
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    itemTitle: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
    },
    itemDate: {
      ...typography.caption,
      color: colors.textMuted,
    },
    itemMessage: {
      ...typography.caption,
      color: colors.text,
      lineHeight: 18,
      textAlign,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 100,
    },
    emptyText: {
      ...typography.body,
      color: colors.textMuted,
      marginTop: spacing.m,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.l,
    },
    confirmCard: {
      width: '100%',
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: spacing.l,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    confirmIconWrap: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: colors.error + '14',
      borderWidth: 1,
      borderColor: colors.error + '33',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: spacing.m,
    },
    confirmTitle: {
      ...typography.h3,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    confirmMessage: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 18,
      marginBottom: spacing.l,
    },
    confirmButtonsRow: {
      flexDirection,
      justifyContent: 'space-between',
      gap: 12,
    },
    confirmButton: {
      flex: 1,
      height: 48,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
    },
    confirmCancelButton: {
      backgroundColor: colors.glass,
      borderColor: colors.glassBorder,
    },
    confirmDeleteButton: {
      backgroundColor: colors.error,
      borderColor: colors.error,
    },
    confirmButtonText: {
      ...typography.body,
      fontWeight: 'bold',
    },
    confirmDeleteText: {
      ...typography.body,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
  });
};

