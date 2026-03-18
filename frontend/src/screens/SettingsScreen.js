import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  ChevronLeft,
  Bell,
  Moon,
  ChevronRight,
  Check,
  AlarmClock,
} from "lucide-react-native";
import { useGetMeQuery, useUpdateProfileMutation } from "../services/api";
import { createStyles } from "../styles/SettingsScreen.styles";

const SettingsScreen = ({ navigation }) => {
  const { isDark, toggleTheme, theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { language, changeLanguage, t, isRTL } = useLanguage();
  const { data: userData } = useGetMeQuery();
  const [updateProfile] = useUpdateProfileMutation();

  // Local state for toggles to avoid "jumpy" UI
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  // Sync local state when userData arrives
  useEffect(() => {
    if (userData) {
      if (userData.notifications_enabled !== undefined) {
        setNotificationsEnabled(userData.notifications_enabled);
      }
      if (userData.daily_reminders !== undefined) {
        setRemindersEnabled(userData.daily_reminders);
      }
    }
  }, [userData]);

  const handleToggleNotifications = async (value) => {
    setNotificationsEnabled(value); // Optimistic UI update
    try {
      await updateProfile({ notifications_enabled: value }).unwrap();
    } catch (err) {
      console.log("Failed to update notifications:", err);
      setNotificationsEnabled(!value); // Revert on failure
    }
  };

  const handleToggleReminders = async (value) => {
    setRemindersEnabled(value); // Optimistic UI update
    try {
      await updateProfile({ daily_reminders: value }).unwrap();
    } catch (err) {
      console.log("Failed to update reminders:", err);
      setRemindersEnabled(!value); // Revert on failure
    }
  };

  const styles = createStyles(theme, isRTL);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft
            color={colors.text}
            size={24}
            style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("settings")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>{t("language")}</Text>
          <View style={styles.languageContainer}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                language === "en" && styles.languageOptionActive,
              ]}
              onPress={() => changeLanguage("en")}
            >
              <Text
                style={[
                  styles.languageText,
                  language === "en" && styles.languageTextActive,
                ]}
              >
                English
              </Text>
              {language === "en" && <Check color={colors.primary} size={16} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageOption,
                language === "ur" && styles.languageOptionActive,
              ]}
              onPress={() => changeLanguage("ur")}
            >
              <Text
                style={[
                  styles.languageText,
                  language === "ur" && styles.languageTextActive,
                ]}
              >
                اردو (Urdu)
              </Text>
              {language === "ur" && <Check color={colors.primary} size={16} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>{t("settings")}</Text>

          <View style={styles.settingItem}>
            <View style={styles.itemIconContainer}>
              <Moon color={colors.primary} size={20} />
            </View>
            <Text style={styles.itemLabel}>{t("dark_mode")}</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.glassBorder, true: colors.primary }}
              thumbColor={isDark ? "#FFFFFF" : colors.textMuted}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.itemIconContainer}>
              <Bell color={colors.primary} size={20} />
            </View>
            <Text style={styles.itemLabel}>{t("notifications_toggle")}</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.glassBorder, true: colors.primary }}
              thumbColor={notificationsEnabled ? "#FFFFFF" : colors.textMuted}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.itemIconContainer}>
              <AlarmClock color={colors.primary} size={20} />
            </View>
            <Text style={styles.itemLabel}>{t("daily_reminders")}</Text>
            <Switch
              value={remindersEnabled}
              onValueChange={handleToggleReminders}
              trackColor={{ false: colors.glassBorder, true: colors.primary }}
              thumbColor={remindersEnabled ? "#FFFFFF" : colors.textMuted}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>
            {t("app_version")}: 1.0.0 (Build 124)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
