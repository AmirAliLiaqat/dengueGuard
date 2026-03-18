import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  PlusCircle,
  History,
  Bell,
  ChevronRight,
  AlertTriangle,
  HeartPulse,
  Globe,
  BookOpen,
  AlarmClock,
} from "lucide-react-native";
import { useState, useEffect } from "react";
import { createStyles } from "../styles/HomeScreen.styles";

import {
  useGetHistoryQuery,
  useGetMeQuery,
  useSyncRemindersMutation,
  useGetNotificationsQuery,
} from "../services/api";
import { scheduleDailyReminder } from "../services/NotificationService";

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);
  const [reminderStatus, setReminderStatus] = useState(null);

  const {
    data: userData,
    refetch: refetchMe,
    isFetching: isFetchingMe,
  } = useGetMeQuery();
  const {
    data: historyData,
    refetch: refetchHistory,
    isFetching: isFetchingHistory,
  } = useGetHistoryQuery(3); // Fetch 3 latest
  const { data: notifications } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000, // Check for new notifications every 30 seconds
  });
  const [syncReminders] = useSyncRemindersMutation();

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  const onRefresh = React.useCallback(() => {
    refetchMe();
    refetchHistory();
  }, [refetchMe, refetchHistory]);

  const handleScheduleReminders = async () => {
    try {
      navigation.navigate('ReminderSettings');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userData) {
      scheduleDailyReminder(userData.daily_reminders);
    }
    syncReminders();
  }, [userData, syncReminders]);

  return (
    <SafeAreaView style={styles.container}>
      {reminderStatus && (
        <View style={[styles.toast, { backgroundColor: colors.primary }]}>
          <Text style={styles.toastText}>{reminderStatus}</Text>
        </View>
      )}
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
          <View style={{ alignItems: isRTL ? "flex-end" : "flex-start" }}>
            <Text style={styles.welcomeText}>{t("welcome_back")}</Text>
            <Text style={styles.nameText}>
              {userData?.full_name || t("patient")}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("Notifications")}
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
            <Text style={styles.statusTitle}>{t("precaution_alert")}</Text>
          </View>
          <Text style={styles.statusDescription}>{t("dengue_alert_desc")}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t("quick_actions")}</Text>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("Diagnose")}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: colors.primary + "1A" },
              ]}
            >
              <PlusCircle color={colors.primary} size={24} />
            </View>
            <Text style={styles.actionTitle}>{t("new_diagnosis")}</Text>
            <Text style={styles.actionSubtitle}>{t("start_kbs_scan")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("History")}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: colors.accent + "1A" },
              ]}
            >
              <History color={colors.accent} size={24} />
            </View>
            <Text style={styles.actionTitle}>{t("health_history")}</Text>
            <Text style={styles.actionSubtitle}>{t("view_reports")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("DengueInfo")}
          >
            <View
              style={[styles.actionIcon, { backgroundColor: "#3498DB" + "1A" }]}
            >
              <BookOpen color={"#3498DB"} size={24} />
            </View>
            <Text style={styles.actionTitle}>{t("dengue_encyclopedia")}</Text>
            <Text style={styles.actionSubtitle}>{t("learn_all_about")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleScheduleReminders}
          >
            <View
              style={[styles.actionIcon, { backgroundColor: "#F39C12" + "1A" }]}
            >
              <AlarmClock color={"#F39C12"} size={24} />
            </View>
            <Text style={styles.actionTitle}>{t("daily_reminders")}</Text>
            <Text style={styles.actionSubtitle}>{t("get_daily_tips")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("HealthTips")}
          >
            <View
              style={[styles.actionIcon, { backgroundColor: "#10B981" + "1A" }]}
            >
              <HeartPulse color={"#10B981"} size={24} />
            </View>
            <Text style={styles.actionTitle}>{t("health_tips")}</Text>
            <Text style={styles.actionSubtitle}>
              {t("preventive_measures")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("WHOGuidelines")}
          >
            <View
              style={[styles.actionIcon, { backgroundColor: "#8E44AD" + "1A" }]}
            >
              <Globe color={"#8E44AD"} size={32} />
            </View>
            <Text style={styles.actionTitle}>{t("who_guidelines")}</Text>
            <Text style={styles.actionSubtitle}>
              {t("official_medical_advice")}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitleWithMargin}>{t("recent_reports")}</Text>

        <View style={styles.reportList}>
          {historyData?.length > 0 ? (
            historyData.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.reportItem}
                onPress={() =>
                  navigation.navigate("ReportDetails", { reportId: report.id })
                }
              >
                <View style={styles.reportInfo}>
                  <Text style={styles.reportTitle}>
                    {t("diagnosis_id_prefix")}
                    {report.id.slice(-4).toUpperCase()}
                  </Text>
                  <Text style={styles.reportSubtitle}>
                    {new Date(report.created_at).toLocaleDateString()} •{" "}
                    {report.kbs_recommendation?.risk_classification ||
                      "Unknown"}
                  </Text>
                </View>
                <ChevronRight
                  color={colors.textMuted}
                  size={20}
                  style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text
              style={[
                styles.statusDescription,
                { textAlign: "center", opacity: 0.6 },
              ]}
            >
              {t("no_recent_reports")}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
