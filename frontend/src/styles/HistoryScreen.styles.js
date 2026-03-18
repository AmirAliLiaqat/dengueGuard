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
      paddingHorizontal: spacing.l,
      paddingTop: spacing.xl,
      paddingBottom: spacing.l,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    title: {
      ...typography.h1,
      color: colors.text,
      textAlign,
    },
    subtitle: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign,
    },
    listContent: {
      padding: spacing.l,
      paddingTop: 0,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.m,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    cardHeader: {
      flexDirection,
      alignItems: 'center',
      marginBottom: spacing.m,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    cardMain: {
      flex: 1,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    filterSection: {
      marginBottom: spacing.m,
    },
    sortToggleRow: {
      flexDirection,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.l,
      marginBottom: spacing.s,
    },
    filterLabel: {
      ...typography.caption,
      color: colors.textMuted,
      fontWeight: 'bold',
    },
    sortButton: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.glass,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    sortButtonText: {
      ...typography.caption,
      color: colors.primary,
      fontWeight: 'bold',
      marginLeft: isRTL ? 0 : 6,
      marginRight: isRTL ? 6 : 0,
    },
    filterScrollContent: {
      paddingHorizontal: spacing.l,
      paddingVertical: 4,
    },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.card,
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    activeFilterChip: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterChipText: {
      fontSize: 12,
      color: colors.textMuted,
      fontWeight: '600',
    },
    activeFilterChipText: {
      color: colors.background,
    },
    cardTitle: {
      ...typography.h3,
      color: colors.text,
      textAlign,
    },
    cardSubtitle: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign,
    },
    cardFooter: {
      flexDirection,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.m,
      borderTopWidth: 1,
      borderTopColor: colors.glassBorder,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    scoreText: {
      ...typography.caption,
      color: colors.text,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 100,
    },
    emptyText: {
      ...typography.body,
      color: colors.textMuted,
      marginTop: spacing.m,
      textAlign,
    },
  });
};

