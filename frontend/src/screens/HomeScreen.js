import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { PlusCircle, History, Bell, ChevronRight, AlertTriangle, HeartPulse, Globe } from 'lucide-react-native';

const { width } = Dimensions.get('window');

import { useGetHistoryQuery, useGetMeQuery, useSyncRemindersMutation, useGetNotificationsQuery } from '../services/api';
import { scheduleDailyReminder } from '../services/NotificationService';
import { useEffect } from 'react';

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const { data: userData, refetch: refetchMe, isFetching: isFetchingMe } = useGetMeQuery();
  const { data: historyData, refetch: refetchHistory, isFetching: isFetchingHistory } = useGetHistoryQuery(3); // Fetch 3 latest
  const { data: notifications } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000, // Check for new notifications every 30 seconds
  });
  const [syncReminders] = useSyncRemindersMutation();

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  const onRefresh = React.useCallback(() => {
    refetchMe();
    refetchHistory();
  }, [refetchMe, refetchHistory]);

  useEffect(() => {
    scheduleDailyReminder();
    syncReminders();
  }, [syncReminders]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingMe || isFetchingHistory}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
      <View style={styles.header}>
        <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          <Text style={styles.welcomeText}>{t('welcome_back')}</Text>
          <Text style={styles.nameText}>{userData?.full_name || 'Patient'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Bell color={colors.text} size={24} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <AlertTriangle color={colors.warning} size={20} />
          <Text style={styles.statusTitle}>
            {t('precaution_alert')}
          </Text>
        </View>
        <Text style={styles.statusDescription}>
          {t('dengue_alert_desc')}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        {t('quick_actions')}
      </Text>

      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Diagnose')}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.primary + '1A' }]}>
            <PlusCircle color={colors.primary} size={32} />
          </View>
          <Text style={styles.actionTitle}>{t('new_diagnosis')}</Text>
          <Text style={styles.actionSubtitle}>{t('start_kbs_scan')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('History')}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.accent + '1A' }]}>
            <History color={colors.accent} size={32} />
          </View>
          <Text style={styles.actionTitle}>{t('health_history')}</Text>
          <Text style={styles.actionSubtitle}>{t('view_reports')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('HealthTips')} 
        >
          <View style={[styles.actionIcon, { backgroundColor: '#10B981' + '1A' }]}>
            <HeartPulse color={'#10B981'} size={32} />
          </View>
          <Text style={styles.actionTitle}>{t('health_tips')}</Text>
          <Text style={styles.actionSubtitle}>{t('preventive_measures')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('WHOGuidelines')} 
        >
          <View style={[styles.actionIcon, { backgroundColor: '#8E44AD' + '1A' }]}>
            <Globe color={'#8E44AD'} size={32} />
          </View>
          <Text style={styles.actionTitle}>{t('who_guidelines')}</Text>
          <Text style={styles.actionSubtitle}>{t('official_medical_advice')}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitleWithMargin}>
        {t('recent_reports')}
      </Text>

      <View style={styles.reportList}>
        {historyData?.length > 0 ? (
          historyData.map((report) => (
            <TouchableOpacity 
              key={report.id} 
              style={styles.reportItem}
              onPress={() => navigation.navigate('ReportDetails', { reportId: report.id })}
            >
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>Diagnosis #{report.id.slice(-4).toUpperCase()}</Text>
                <Text style={styles.reportSubtitle}>
                  {new Date(report.created_at).toLocaleDateString()} • {report.kbs_recommendation?.risk_classification || "Unknown"}
                </Text>
              </View>
              <ChevronRight color={colors.textMuted} size={20} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={[styles.statusDescription, { textAlign: 'center', opacity: 0.6 }]}>
            No recent reports found. Start a new diagnosis!
          </Text>
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
      borderRadius: 20,
      padding: spacing.m,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    actionIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.m,
    },
    actionTitle: {
      fontSize: 16,
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
    }
  });
};

export default HomeScreen;
