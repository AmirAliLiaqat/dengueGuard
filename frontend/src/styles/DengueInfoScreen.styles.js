import { StyleSheet } from 'react-native';

export const createStyles = (theme, isRTL) => {
  const { colors, typography, spacing } = theme;
  const textAlign = isRTL ? "right" : "left";
  const flexDirection = isRTL ? "row-reverse" : "row";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection,
      alignItems: "center",
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.glass,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    headerTitle: {
      ...typography.h3,
      color: colors.text,
      marginLeft: isRTL ? 0 : spacing.m,
      marginRight: isRTL ? spacing.m : 0,
    },
    scrollContent: {
      padding: spacing.l,
    },
    heroSection: {
      alignItems: "center",
      marginBottom: spacing.xl,
      padding: spacing.l,
      backgroundColor: colors.card,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    heroIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary + "15",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.m,
    },
    heroTitle: {
      ...typography.h2,
      color: colors.text,
      textAlign: "center",
    },
    heroSubtitle: {
      ...typography.body,
      color: colors.primary,
      fontWeight: "bold",
      marginTop: 4,
    },
    sectionCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      marginBottom: spacing.l,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      overflow: "hidden",
    },
    sectionHeader: {
      flexDirection,
      alignItems: "center",
      padding: spacing.m,
      backgroundColor: colors.glass,
      borderLeftWidth: 4,
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginRight: isRTL ? 0 : spacing.m,
      marginLeft: isRTL ? spacing.m : 0,
    },
    sectionTitle: {
      ...typography.h3,
      fontSize: 18,
      color: colors.text,
      flex: 1,
      textAlign,
    },
    sectionBody: {
      padding: spacing.l,
    },
    sectionText: {
      ...typography.body,
      color: colors.textMuted,
      lineHeight: 24,
      textAlign,
    },
    footer: {
      alignItems: "center",
    },
    footerText: {
      ...typography.caption,
      color: colors.textMuted,
    },
  });
};

