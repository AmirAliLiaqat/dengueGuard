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
    searchContainer: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      margin: spacing.l,
      paddingHorizontal: spacing.m,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    searchIcon: {
      marginRight: isRTL ? 0 : spacing.s,
      marginLeft: isRTL ? spacing.s : 0,
    },
    searchInput: {
      flex: 1,
      height: 50,
      color: colors.text,
      ...typography.body,
    },
    listContent: {
      paddingHorizontal: spacing.l,
      paddingBottom: spacing.xl,
    },
    profileCard: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: spacing.m,
      borderRadius: 16,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    avatarContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      overflow: 'hidden',
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: isRTL ? 0 : spacing.m,
      marginLeft: isRTL ? spacing.m : 0,
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    avatarPlaceholder: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
    },
    profileEmail: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 100,
    },
    emptyText: {
      ...typography.body,
      color: colors.textMuted,
      marginTop: spacing.m,
    },
  });
};

