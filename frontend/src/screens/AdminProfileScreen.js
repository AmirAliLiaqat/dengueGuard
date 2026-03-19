import React, { useCallback } from "react";
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
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  Info,
  Activity,
} from "lucide-react-native";
import { useGetMeQuery, useGetAdminOverviewQuery } from "../services/api";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { createStyles } from "../styles/ProfileScreen.styles";

const AdminProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { t, isRTL } = useLanguage();
  const dispatch = useDispatch();
  const styles = createStyles(theme, isRTL);

  const {
    data: me,
    refetch: refetchMe,
    isFetching: isFetchingMe,
  } = useGetMeQuery();
  const {
    data: overview,
    refetch: refetchOverview,
    isFetching: isFetchingOverview,
  } = useGetAdminOverviewQuery();

  const onRefresh = useCallback(() => {
    refetchMe();
    refetchOverview();
  }, [refetchMe, refetchOverview]);

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace("Login");
  };

  const accountMenuItems = [
    {
      icon: User,
      label: t("edit_profile_btn"),
      onPress: () => navigation.navigate("EditProfile"),
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
            refreshing={isFetchingMe || isFetchingOverview}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            <View style={styles.placeholderImage}>
              {me?.profile_picture ? (
                <Image
                  source={{ uri: me.profile_picture }}
                  style={styles.avatarImage}
                />
              ) : (
                <User color={colors.primary} size={60} />
              )}
            </View>
          </View>
          <Text style={styles.nameText}>{me?.full_name || "Admin"}</Text>
          <Text style={styles.emailText}>{me?.email}</Text>
          <Text style={styles.roleCaption}>Administrator</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{overview?.total_users ?? "—"}</Text>
            <Text style={styles.statLabel}>App users</Text>
          </View>
          <View style={[styles.statBox, styles.statBorder]}>
            <Text style={styles.statValue}>
              {overview?.total_reports ?? "—"}
            </Text>
            <Text style={styles.statLabel}>Reports</Text>
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
                  backgroundColor: me?.is_active ? "#2ECC71" : colors.textMuted,
                  marginRight: isRTL ? 0 : 6,
                  marginLeft: isRTL ? 6 : 0,
                }}
              />
              <Text style={styles.statValue}>
                {me?.is_active ? t("status_active") : t("status_offline")}
              </Text>
            </View>
            <Text style={styles.statLabel}>{t("account_status")}</Text>
          </View>
        </View>

        {overview && (
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {overview?.total_doctors ?? "—"}
              </Text>
              <Text style={styles.statLabel}>Doctors</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("account_section")}</Text>
          {accountMenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <item.icon color={colors.primary} size={22} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {isRTL ? (
                <ChevronLeft color={colors.textMuted} size={20} />
              ) : (
                <ChevronRight color={colors.textMuted} size={20} />
              )}
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
            {isRTL ? (
              <ChevronLeft color={colors.textMuted} size={20} />
            ) : (
              <ChevronRight color={colors.textMuted} size={20} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("HelpSupport")}
          >
            <View style={styles.menuIconContainer}>
              <HelpCircle color={colors.primary} size={22} />
            </View>
            <Text style={styles.menuLabel}>{t("help_faq")}</Text>
            {isRTL ? (
              <ChevronLeft color={colors.textMuted} size={20} />
            ) : (
              <ChevronRight color={colors.textMuted} size={20} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("About")}
          >
            <View style={styles.menuIconContainer}>
              <Info color={colors.primary} size={22} />
            </View>
            <Text style={styles.menuLabel}>{t("about_app")}</Text>
            {isRTL ? (
              <ChevronLeft color={colors.textMuted} size={20} />
            ) : (
              <ChevronRight color={colors.textMuted} size={20} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("DengueInfo")}
          >
            <View style={styles.menuIconContainer}>
              <Activity color={colors.primary} size={22} />
            </View>
            <Text style={styles.menuLabel}>{t("dengue_encyclopedia")}</Text>
            {isRTL ? (
              <ChevronLeft color={colors.textMuted} size={20} />
            ) : (
              <ChevronRight color={colors.textMuted} size={20} />
            )}
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

export default AdminProfileScreen;
