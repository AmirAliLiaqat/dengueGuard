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
    saveText: {
      ...typography.body,
      color: colors.primary,
      fontWeight: 'bold',
    },
    scrollContent: {
      padding: spacing.l,
    },
    imageSection: {
      alignItems: 'center',
      marginVertical: spacing.xl,
    },
    imageContainer: {
      position: 'relative',
    },
    placeholderImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.glassBorder,
    },
    cameraButton: {
      position: 'absolute',
      bottom: 0,
      right: isRTL ? undefined : 0,
      left: isRTL ? 0 : undefined,
      backgroundColor: colors.primary,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.background,
    },
    form: {
      marginTop: spacing.xl,
    },
    label: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.s,
      marginLeft: isRTL ? 0 : 4,
      marginRight: isRTL ? 4 : 0,
      textAlign,
    },
    inputGroup: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: spacing.m,
      paddingHorizontal: spacing.m,
      height: 56,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    inputIcon: {
      marginLeft: isRTL ? spacing.s : 0,
      marginRight: isRTL ? 0 : spacing.s,
    },
    input: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
      textAlign,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    modalTitle: {
      ...typography.h2,
      color: colors.text,
    },
    modalOptions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: spacing.l,
    },
    modalOption: {
      alignItems: 'center',
    },
    optionIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.s,
    },
    optionText: {
      ...typography.body,
      color: colors.text,
      fontWeight: '600',
    },
  });
};

