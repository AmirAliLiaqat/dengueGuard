import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  ChevronLeft,
  User,
  Phone,
  Mail,
  FileText,
  Calendar,
} from "lucide-react-native";
import { useGetPublicProfileDetailQuery } from "../services/api";
import { createStyles } from "../styles/UserProfileDetailScreen.styles";

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
        <Text style={styles.headerTitle}>{t("profile_details")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user?.profile_picture ? (
              <Image
                source={{ uri: user.profile_picture }}
                style={styles.avatar}
              />
            ) : (
              <User color={colors.primary} size={48} />
            )}
          </View>
          <Text style={styles.userName}>{user?.full_name || "Anonymous"}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Public Member</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Mail color={colors.primary} size={20} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>{t("email")}</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>
          {user?.phone && (
            <View style={styles.infoRow}>
              <Phone color={colors.primary} size={20} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>{t("phone")}</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.reportSection}>
          <Text style={styles.sectionTitle}>{t("user_reports")}</Text>
          {reports && reports.length > 0 ? (
            reports.map((report, index) => (
              <View
                key={report._id || index.toString()}
                style={styles.reportCard}
              >
                <View style={styles.reportHeader}>
                  <FileText color={colors.accent} size={20} />
                  <Text style={styles.reportTitle}>
                    {report.kbs_recommendation?.disease_detection || "Analysis"}
                  </Text>
                </View>
                <View style={styles.reportMeta}>
                  <Calendar color={colors.textMuted} size={14} />
                  <Text style={styles.reportDate}>
                    {new Date(report.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.reportSummary}>
                  Risk:{" "}
                  {report.kbs_recommendation?.risk_classification || "N/A"}
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

export default UserProfileDetailScreen;
