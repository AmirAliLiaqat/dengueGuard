import { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView as RNScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  FileText,
  SortAsc,
  SortDesc,
} from "lucide-react-native";
import { createStyles } from "../styles/HistoryScreen.styles";

import { useGetHistoryQuery } from "../services/api";

const HistoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const [riskFilter, setRiskFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  const { data: historyData, refetch, isFetching } = useGetHistoryQuery(0);

  const processedData = useMemo(() => {
    if (!historyData) return [];

    let filtered = [...historyData];

    if (riskFilter !== "All") {
      filtered = filtered.filter(
        (item) => item.kbs_recommendation?.risk_classification === riskFilter,
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [historyData, riskFilter, sortOrder]);

  const riskLevels = ["All", "Critical", "High", "Moderate", "Low"];

  const renderItem = ({ item }) => {
    const risk = item.kbs_recommendation?.risk_classification || "Unknown";
    const statusColor =
      risk === "High" || risk === "Critical"
        ? colors.error
        : risk === "Low"
          ? colors.success
          : colors.warning;

    const utcString = item.created_at.endsWith("Z")
      ? item.created_at
      : item.created_at + "Z";
    const dateStr = new Date(utcString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("ReportDetails", { reportId: item.id })
        }
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <FileText color={colors.primary} size={24} />
          </View>
          <View style={styles.cardMain}>
            <Text style={styles.cardTitle}>
              {item.kbs_recommendation?.disease_detection || "Diagnosis"}
            </Text>
            <Text style={styles.cardSubtitle}>{dateStr}</Text>
          </View>
          {isRTL ? (
            <ChevronLeft color={colors.textMuted} size={20} />
          ) : (
            <ChevronRight color={colors.textMuted} size={20} />
          )}
        </View>
        <View style={styles.cardFooter}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor + "1A" },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>
              {t(risk.toLowerCase())} {t("risk_label")}
            </Text>
          </View>
          <Text style={styles.scoreText}>
            {t("ml_probability")}:{" "}
            {(item.ml_prediction?.probability * 100).toFixed(0)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("health_history")}</Text>
        <Text style={styles.subtitle}>{t("view_reports")}</Text>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.sortToggleRow}>
          <Text style={styles.filterLabel}>{t("filter_by_risk")}</Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() =>
              setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
            }
          >
            {sortOrder === "newest" ? (
              <SortDesc color={colors.primary} size={18} />
            ) : (
              <SortAsc color={colors.primary} size={18} />
            )}
            <Text style={styles.sortButtonText}>{t(sortOrder)}</Text>
          </TouchableOpacity>
        </View>

        <RNScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {riskLevels.map((risk) => (
            <TouchableOpacity
              key={risk}
              style={[
                styles.filterChip,
                riskFilter === risk && styles.activeFilterChip,
              ]}
              onPress={() => setRiskFilter(risk)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  riskFilter === risk && styles.activeFilterChipText,
                ]}
              >
                {t(risk.toLowerCase())}
              </Text>
            </TouchableOpacity>
          ))}
        </RNScrollView>
      </View>

      <FlatList
        data={processedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isFetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ClipboardList color={colors.textMuted} size={60} />
            <Text style={styles.emptyText}>{t("no_matching_reports")}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default HistoryScreen;
