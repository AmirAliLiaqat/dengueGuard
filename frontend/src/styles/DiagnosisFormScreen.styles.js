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
      ...typography.h3,
      color: colors.text,
      marginLeft: isRTL ? 0 : spacing.s,
      marginRight: isRTL ? spacing.s : 0,
      textTransform: 'capitalize',
    },
    inputGroup: {
      marginBottom: spacing.m,
    },
    label: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: 8,
      textAlign,
      textTransform: 'capitalize',
    },
    textInput: {
      height: 52,
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: spacing.m,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      ...typography.body,
    },
    checkboxItem: {
      flexDirection,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.s,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder + '1A',
    },
    checkboxLabel: {
      ...typography.body,
      color: colors.text,
      textTransform: 'capitalize',
      flex: 1,
      textAlign,
    },
    analyzeButton: {
      backgroundColor: colors.primary,
      flexDirection,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    analyzeButtonText: {
      color: colors.background,
      fontSize: 18,
      fontWeight: 'bold',
      marginHorizontal: 8,
    },
  });
};

