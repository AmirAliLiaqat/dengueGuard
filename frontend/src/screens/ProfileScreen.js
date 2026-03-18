import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  User,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  Bell,
  FileText,
  HelpCircle,
  Info,
  Stethoscope,
  Activity,
  Globe,
} from "lucide-react-native";
import { useGetMeQuery, useGetStatsQuery } from "../services/api";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { createStyles } from "../styles/ProfileScreen.styles";

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const dispatch = useDispatch();

  const {
    data: userData,
    refetch: refetchMe,
    isFetching: isFetchingMe,
  } = useGetMeQuery();
  const {
    data: statsData,
    refetch: refetchStats,
    isFetching: isFetchingStats,
  } = useGetStatsQuery();

  const onRefresh = React.useCallback(() => {
    refetchMe();
    refetchStats();
  }, [refetchMe, refetchStats]);

  const styles = createStyles(theme, isRTL);

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace("Login");
  };

  const menuItems = [
    {
      icon: User,
      label: t("edit_profile_btn"),
      onPress: () => navigation.navigate("EditProfile"),
    },
    {
      icon: Bell,
      label: t("notifications_toggle"),
      onPress: () => navigation.navigate("Notifications"),
    },
    {
      icon: Shield,
      label: t("privacy_security"),
      onPress: () => navigation.navigate("PrivacyAndSecurity"),
    },
    {
      icon: Globe,
      label: t("public_profiles_gallery") || "Public Profiles Gallery",
      onPress: () => navigation.navigate("PublicProfiles"),
    },
    {
      icon: Settings,
      label: t("settings"),
      onPress: () => navigation.navigate("Settings"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingMe || isFetchingStats}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            <View style={styles.placeholderImage}>
              {userData?.profile_picture ? (
                <Image
                  source={{ uri: userData.profile_picture }}
                  style={styles.avatarImage}
                />
              ) : (
                <User color={colors.primary} size={60} />
              )}
            </View>
          </View>
          <Text style={styles.nameText}>{userData?.full_name || "User"}</Text>
          <Text style={styles.emailText}>{userData?.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {statsData?.total_diagnoses || 0}
            </Text>
            <Text style={styles.statLabel}>{t("stats_tests")}</Text>
          </View>
          <View style={[styles.statBox, styles.statBorder]}>
            <View
              style={{
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: userData?.is_active
                    ? "#2ECC71"
                    : colors.textMuted,
                  marginRight: isRTL ? 0 : 6,
                  marginLeft: isRTL ? 6 : 0,
                }}
              />
              <Text style={styles.statValue}>
                {userData?.is_active ? t("status_active") : t("status_offline")}
              </Text>
            </View>
            <Text style={styles.statLabel}>{t("account_status")}</Text>
          </View>
          <View style={styles.statBox}>
            <Text
              style={[
                styles.statValue,
                {
                  color:
                    Object.keys(statsData?.risk_summary || {}).filter(
                      (k) => k !== "Low",
                    ).length > 0
                      ? colors.accent
                      : colors.primary,
                },
              ]}
            >
              {Object.keys(statsData?.risk_summary || {}).filter(
                (k) => k !== "Low",
              ).length > 0
                ? t("status_at_risk")
                : t("status_safe")}
            </Text>
            <Text style={styles.statLabel}>{t("health_status")}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("account_section")}</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <item.icon color={colors.primary} size={22} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRight
                color={colors.textMuted}
                size={20}
                style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("support")}</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("TermsAndConditions")}
          >
            <View style={styles.menuIconContainer}>
              <FileText color={colors.primary} size={22} />
            </View>
            <Text style={styles.menuLabel}>{t("terms_conditions")}</Text>
            <ChevronRight
              color={colors.textMuted}
              size={20}
              style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("HelpSupport")}
          >
            <View style={styles.menuIconContainer}>
              <HelpCircle color={colors.primary} size={22} />
            </View>
            <Text style={styles.menuLabel}>{t("help_faq")}</Text>
            <ChevronRight
              color={colors.textMuted}
              size={20}
              style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("About")}
          >
            <View style={styles.menuIconContainer}>
              <Info color={colors.primary} size={22} />
            </View>
            <Text style={styles.menuLabel}>{t("about_app")}</Text>
            <ChevronRight
              color={colors.textMuted}
              size={20}
              style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("DengueInfo")}
          >
            <View style={styles.menuIconContainer}>
              <Activity color={colors.primary} size={22} />
            </View>
            <Text style={styles.menuLabel}>{t("dengue_encyclopedia")}</Text>
            <ChevronRight
              color={colors.textMuted}
              size={20}
              style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color={colors.error} size={22} />
          <Text style={styles.logoutText}>{t("logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
