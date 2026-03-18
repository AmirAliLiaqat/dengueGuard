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
    hero: {
      backgroundColor: colors.card,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      padding: spacing.l,
      marginTop: spacing.m,
      marginBottom: spacing.xl,
      overflow: 'hidden',
    },
    heroTop: {
      flexDirection,
      alignItems: 'center',
      gap: spacing.m,
    },
    heroMeta: {
      flex: 1,
    },
    logoCircle: {
      width: 96,
      height: 96,
      borderRadius: 22,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.primary + '33',
      overflow: 'hidden',
    },
    logoImage: {
      width: '100%',
      height: '100%',
    },
    appName: {
      ...typography.h2,
      color: colors.text,
      textAlign,
    },
    version: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: 4,
      textAlign,
    },
    tagline: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: 8,
      lineHeight: 18,
      textAlign,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.text,
      marginBottom: spacing.s,
      textAlign,
    },
    sectionHeaderRow: {
      flexDirection,
      alignItems: 'center',
      gap: spacing.s,
      marginBottom: spacing.s,
    },
    sectionTitleInline: {
      ...typography.h3,
      color: colors.text,
      textAlign,
    },
    description: {
      ...typography.body,
      color: colors.textMuted,
      lineHeight: 24,
      textAlign,
    },
    card: {
      flexDirection,
      backgroundColor: colors.card,
      padding: spacing.l,
      borderRadius: 20,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    grid: {
      gap: spacing.m,
      marginBottom: spacing.xl,
    },
    cardIcon: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
    },
    cardText: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: 4,
      lineHeight: 18,
      textAlign,
    },
    footer: {
      marginTop: spacing.m,
      alignItems: 'center',
      paddingBottom: spacing.m,
    },
    footerText: {
      ...typography.caption,
      color: colors.textMuted,
    },
    benchmarkCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      padding: spacing.l,
      marginTop: spacing.m,
      gap: spacing.l,
    },
    benchmarkItem: {
      gap: 8,
    },
    benchmarkLabel: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
    },
    benchmarkRow: {
      flexDirection,
      flexWrap: 'wrap',
      gap: 10,
      justifyContent: 'space-between',
    },
    benchmarkMetric: {
      ...typography.caption,
      color: colors.text,
      fontWeight: '700',
    },
    benchmarkCitation: {
      ...typography.caption,
      color: colors.textMuted,
      lineHeight: 18,
      textAlign,
    },
  });
};
