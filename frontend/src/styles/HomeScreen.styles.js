import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

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
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.xl,
      paddingHorizontal: spacing.l,
      paddingBottom: spacing.m,
    },
    welcomeText: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign,
    },
    nameText: {
      ...typography.h2,
      color: colors.text,
      textAlign,
    },
    iconButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    badge: {
      position: 'absolute',
      top: 10,
      right: 10,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: colors.accent,
      borderWidth: 2,
      borderColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 2,
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 8,
      fontWeight: 'bold',
    },
    statusCard: {
      margin: spacing.l,
      padding: spacing.m,
      backgroundColor: colors.warning + '1A',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.warning + '33',
    },
    statusHeader: {
      flexDirection,
      alignItems: 'center',
    },
    statusTitle: {
      ...typography.body,
      color: colors.warning,
      marginLeft: isRTL ? 0 : 8,
      marginRight: isRTL ? 8 : 0,
      fontWeight: 'bold',
    },
    statusDescription: {
      ...typography.caption,
      color: colors.text,
      marginTop: 4,
      textAlign,
    },
    sectionTitle: {
      ...typography.h3,
      paddingHorizontal: spacing.l,
      marginBottom: spacing.m,
      color: colors.text,
      textAlign,
    },
    sectionTitleWithMargin: {
      ...typography.h3,
      paddingHorizontal: spacing.l,
      marginVertical: spacing.m,
      color: colors.text,
      textAlign,
    },
    actionGrid: {
      flexDirection,
      flexWrap: 'wrap',
      paddingHorizontal: spacing.l,
      justifyContent: 'space-between',
    },
    actionCard: {
      width: (width - spacing.l * 3) / 2,
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: spacing.s + 4,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    actionIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    actionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
    },
    actionSubtitle: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign,
    },
    reportList: {
      paddingHorizontal: spacing.l,
      paddingBottom: spacing.xl,
    },
    reportItem: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.m,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    reportInfo: {
      flex: 1,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    reportTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      textAlign,
    },
    reportSubtitle: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign,
    },
    toast: {
      position: 'absolute',
      top: 100,
      left: 20,
      right: 20,
      padding: spacing.m,
      borderRadius: 12,
      zIndex: 1000,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    toastText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
};

