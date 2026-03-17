import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, User, Phone, Mail, FileText, Calendar } from 'lucide-react-native';
import { useGetPublicProfileDetailQuery } from '../services/api';

const UserProfileDetailScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const { data, isLoading } = useGetPublicProfileDetailQuery(userId);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const { user, reports } = data || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile_details')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user?.profile_picture ? (
              <Image source={{ uri: user.profile_picture }} style={styles.avatar} />
            ) : (
              <User color={colors.primary} size={48} />
            )}
          </View>
          <Text style={styles.userName}>{user?.full_name || 'Anonymous'}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Public Member</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Mail color={colors.primary} size={20} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>{t('email')}</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>
          {user?.phone && (
            <View style={styles.infoRow}>
              <Phone color={colors.primary} size={20} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>{t('phone')}</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.reportSection}>
          <Text style={styles.sectionTitle}>{t('user_reports')}</Text>
          {reports && reports.length > 0 ? (
            reports.map((report, index) => (
              <View key={report._id || index.toString()} style={styles.reportCard}>
                <View style={styles.reportHeader}>
                  <FileText color={colors.accent} size={20} />
                  <Text style={styles.reportTitle}>
                    {report.kbs_recommendation?.disease_detection || 'Analysis'}
                  </Text>
                </View>
                <View style={styles.reportMeta}>
                  <Calendar color={colors.textMuted} size={14} />
                  <Text style={styles.reportDate}>
                    {new Date(report.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.reportSummary}>
                  Risk: {report.kbs_recommendation?.risk_classification || 'N/A'}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyReports}>
              <Text style={styles.emptyText}>No reports shared yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme, isRTL) => {
  const { colors, typography, spacing } = theme;
  const textAlign = isRTL ? 'right' : 'left';
  const flexDirection = isRTL ? 'row-reverse' : 'row';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    profileHeader: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    avatarContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.m,
      borderWidth: 2,
      borderColor: colors.primary + '40',
      overflow: 'hidden',
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    userName: {
      ...typography.h2,
      color: colors.text,
    },
    badge: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      marginTop: 8,
    },
    badgeText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: 'bold',
    },
    infoSection: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.m,
      marginBottom: spacing.xl,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    infoRow: {
      flexDirection,
      alignItems: 'center',
      marginBottom: spacing.m,
    },
    infoTextContainer: {
      flex: 1,
      marginLeft: isRTL ? 0 : spacing.m,
      marginRight: isRTL ? spacing.m : 0,
    },
    infoLabel: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign,
    },
    infoValue: {
      ...typography.body,
      color: colors.text,
      fontWeight: '500',
      textAlign,
    },
    reportSection: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.text,
      marginBottom: spacing.m,
      textAlign,
    },
    reportCard: {
      backgroundColor: colors.card,
      padding: spacing.m,
      borderRadius: 16,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    reportHeader: {
      flexDirection,
      alignItems: 'center',
      marginBottom: 8,
    },
    reportTitle: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      marginLeft: isRTL ? 0 : 8,
      marginRight: isRTL ? 8 : 0,
      flex: 1,
      textAlign,
    },
    reportMeta: {
      flexDirection,
      alignItems: 'center',
      marginBottom: 8,
    },
    reportDate: {
      ...typography.caption,
      color: colors.textMuted,
      marginLeft: 4,
    },
    reportSummary: {
      ...typography.caption,
      color: colors.accent,
      fontWeight: 'bold',
      textAlign,
    },
    emptyReports: {
      padding: spacing.xl,
      alignItems: 'center',
    },
    emptyText: {
      ...typography.body,
      color: colors.textMuted,
    },
  });
};

export default UserProfileDetailScreen;
