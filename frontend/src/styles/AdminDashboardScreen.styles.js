import { StyleSheet } from "react-native";

export const createStyles = (theme) => {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: spacing.l,
      paddingTop: spacing.xl,
      paddingBottom: spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder,
    },
    headerTitle: {
      ...typography.h2,
      color: colors.text,
    },
    content: {
      padding: spacing.l,
    },
    placeholderText: {
      ...typography.body,
      color: colors.textMuted,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.text,
      marginBottom: spacing.m,
    },
    chartCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      padding: spacing.m,
    },
    cardRow: {
      flexDirection: "row",
      gap: spacing.m,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    statLabel: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.s,
    },
    statValue: {
      ...typography.h2,
      color: colors.text,
    },
    chartRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.s,
    },
    chartLabel: {
      flexBasis: 80,
      ...typography.caption,
      color: colors.text,
    },
    chartBarBackground: {
      flex: 1,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.glass,
      marginHorizontal: spacing.s,
      flexDirection: "row",
      overflow: "hidden",
    },
    chartBarFill: {
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    chartValue: {
      width: 40,
      textAlign: "right",
      ...typography.caption,
      color: colors.textMuted,
    },
    userRow: {
      paddingVertical: spacing.s,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder,
    },
    userName: {
      ...typography.body,
      color: colors.text,
    },
    userMeta: {
      ...typography.caption,
      color: colors.textMuted,
    },
  });
};

