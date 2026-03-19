import { StyleSheet } from 'react-native';

export const createStyles = (theme) => {
  const { colors, typography, spacing } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: spacing.xl,
      paddingHorizontal: spacing.l,
      paddingBottom: spacing.m,
    },
    headerTitle: {
      ...typography.h2,
      color: colors.text,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: spacing.m,
      marginTop: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    searchText: {
      color: colors.textMuted,
      marginLeft: 8,
    },
    patientCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.m,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      gap: spacing.m,
    },
    avatarWrap: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    avatarImage: {
      width: 52,
      height: 52,
      borderRadius: 26,
    },
    patientInfo: {
      flex: 1,
    },
    patientName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    patientPlatelets: {
      ...typography.caption,
      color: colors.textMuted,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    fab: {
      position: 'absolute',
      right: 24,
      bottom: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    }
  });
};

