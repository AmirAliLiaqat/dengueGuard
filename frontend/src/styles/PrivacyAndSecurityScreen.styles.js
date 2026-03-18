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
    iconContainer: {
      alignItems: 'center',
      marginVertical: spacing.xl,
    },
    introText: {
      ...typography.body,
      textAlign: 'center',
      marginBottom: spacing.xl,
      color: colors.textMuted,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.h3,
      marginBottom: spacing.m,
      color: colors.text,
      textAlign,
    },
    settingItem: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: spacing.m,
      borderRadius: 16,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    settingText: {
      flex: 1,
    },
    settingTitle: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
    },
    settingSubtitle: {
      ...typography.caption,
      fontSize: 12,
      color: colors.textMuted,
      textAlign,
    },
    infoCard: {
      backgroundColor: colors.glass,
      padding: spacing.m,
      borderRadius: 16,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: colors.glassBorder,
      marginBottom: spacing.xl,
    },
    infoTitle: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 8,
      textAlign,
    },
    infoText: {
      ...typography.caption,
      color: colors.text,
      lineHeight: 20,
      textAlign,
    },
    deleteButton: {
      backgroundColor: colors.error + '1A',
      padding: spacing.m,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: spacing.xl,
      borderWidth: 1,
      borderColor: colors.error + '33',
    },
    deleteText: {
      color: colors.error,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.l,
    },
    modalContent: {
      width: '100%',
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: spacing.l,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    modalTitle: {
      ...typography.h2,
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    modalSubtitle: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.l,
      textAlign: 'center',
    },
    modalInput: {
      backgroundColor: colors.glass,
      borderRadius: 12,
      padding: spacing.m,
      color: colors.text,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      textAlign,
    },
    modalPasswordRow: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.glass,
      borderRadius: 12,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      paddingLeft: spacing.m,
      paddingRight: spacing.s,
    },
    modalPasswordInput: {
      flex: 1,
      paddingVertical: spacing.m,
      color: colors.text,
      textAlign,
    },
    passwordToggle: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalButtons: {
      flexDirection,
      justifyContent: 'space-between',
      marginTop: spacing.s,
    },
    modalButton: {
      flex: 0.48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalButtonText: {
      ...typography.body,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
  });
};

