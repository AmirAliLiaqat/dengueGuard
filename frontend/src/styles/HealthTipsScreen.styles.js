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
    introText: {
      ...typography.body,
      color: colors.textMuted,
      marginBottom: spacing.xl,
      lineHeight: 24,
      textAlign,
    },
    tipCard: {
      flexDirection,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: spacing.l,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    tipTextContent: {
      flex: 1,
    },
    tipTitle: {
      ...typography.h3,
      color: colors.text,
      marginBottom: 4,
      textAlign,
    },
    tipDescription: {
      ...typography.caption,
      color: colors.textMuted,
      lineHeight: 18,
      textAlign,
    },
    disclaimerBox: {
      marginTop: spacing.xl,
      padding: spacing.m,
      backgroundColor: colors.error + '1A',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.error + '33',
      marginBottom: spacing.xl * 2,
    },
    disclaimerText: {
      ...typography.caption,
      color: colors.error,
      textAlign: 'center',
    },
  });
};

