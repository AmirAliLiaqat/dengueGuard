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
    deleteButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.error + '1A',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.error + '1A',
    },
    headerTitle: {
      ...typography.h2,
      color: colors.text,
    },
    content: {
      padding: spacing.l,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      alignItems: 'center',
    },
    iconWrapper: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.l,
    },
    title: {
      ...typography.h2,
      color: colors.text,
      textAlign: 'center',
      marginBottom: spacing.m,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: spacing.l,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacing.s,
      marginBottom: 4,
    },
    metaText: {
      ...typography.caption,
      color: colors.textMuted,
      marginLeft: 6,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: colors.glassBorder,
      marginVertical: spacing.l,
    },
    message: {
      ...typography.body,
      color: colors.text,
      lineHeight: 24,
      textAlign: 'center',
    },
    actionButton: {
      marginTop: spacing.xl,
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: spacing.l,
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
};

