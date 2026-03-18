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
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
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
    headerButton: {
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
    resultCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: spacing.xl,
      alignItems: 'center',
      marginBottom: spacing.l,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    dateText: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.xs,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.m,
    },
    percentageText: {
      ...typography.h1,
      color: colors.text,
      fontSize: 48,
    },
    probabilityLabel: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.m,
    },
    badge: {
      paddingHorizontal: spacing.l,
      paddingVertical: spacing.s,
      borderRadius: 20,
    },
    badgeText: {
      fontWeight: 'bold',
      fontSize: 14,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: spacing.l,
      marginBottom: spacing.l,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    sectionHeader: {
      flexDirection,
      alignItems: 'center',
      marginBottom: 0,
    },
    sectionTitle: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      marginLeft: isRTL ? 0 : spacing.s,
      marginRight: isRTL ? spacing.s : 0,
    },
    sectionText: {
      ...typography.body,
      color: colors.textMuted,
      lineHeight: 22,
      textAlign,
      marginRight: 10,
      marginLeft: 10,
    },
    downloadButton: {
      backgroundColor: colors.primary,
      flexDirection,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.xl,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    downloadButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: 'bold',
    },
    reasoningContainer: {
      marginTop: spacing.s,
    },
    reasoningStep: {
      flexDirection,
      marginBottom: 0,
    },
    timelineColumn: {
      alignItems: 'center',
      width: 24,
      marginRight: isRTL ? 0 : spacing.m,
      marginLeft: isRTL ? spacing.m : 0,
    },
    timelineDot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      marginTop: spacing.m + 2,
      borderWidth: 3,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 2,
    },
    timelineLine: {
      width: 2,
      flex: 1,
      minHeight: 20,
      marginTop: 4,
      marginBottom: -16,
    },
    reasoningCard: {
      flex: 1,
      padding: spacing.m,
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: spacing.m,
    },
    reasoningText: {
      ...typography.body,
      color: colors.text,
      fontSize: 13,
      lineHeight: 20,
      textAlign,
    },
  });
};

