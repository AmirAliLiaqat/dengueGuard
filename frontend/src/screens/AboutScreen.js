import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import Constants from "expo-constants";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  ShieldCheck,
  LineChart,
  Brain,
  Lock,
  File,
} from "lucide-react-native";
import { createStyles } from "../styles/AboutScreen.styles";
import { useGetBenchmarksQuery } from "../services/api";

const AboutScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);
  const { data: benchmarks = [] } = useGetBenchmarksQuery();

  const appVersion =
    Constants?.expoConfig?.version || Constants?.manifest?.version || "1.0.0";

  const formatPct = (v) => {
    if (typeof v !== "number" || Number.isNaN(v)) return "—";
    return `${Math.round(v * 100)}%`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          {isRTL ? (
            <ChevronRight color={colors.text} size={24} />
          ) : (
            <ChevronLeft color={colors.text} size={24} />
          )}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("about_app")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.logoCircle}>
              <Image
                source={require("../assets/icon.png")}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.heroMeta}>
              <Text style={styles.appName}>{t("app_name")}</Text>
              <Text style={styles.version}>
                {t("app_version")}: {appVersion}
              </Text>
              <Text style={styles.tagline}>{t("about_tagline")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("app_info")}</Text>
          <Text style={styles.description}>{t("app_desc")}</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <ShieldCheck color={colors.success} size={24} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                {t("medical_grade_accuracy")}
              </Text>
              <Text style={styles.cardText}>{t("medical_grade_desc")}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <Brain color={colors.primary} size={24} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{t("about_how_it_works")}</Text>
              <Text style={styles.cardText}>
                {t("about_how_it_works_desc")}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <File color={colors.info} size={24} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{t("about_data_used")}</Text>
              <Text style={styles.cardText}>{t("about_data_used_desc")}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <Lock color={colors.warning || colors.primary} size={24} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{t("about_privacy")}</Text>
              <Text style={styles.cardText}>{t("about_privacy_desc")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <LineChart color={colors.primary} size={18} />
            <Text style={styles.sectionTitleInline}>
              {t("system_comparison")}
            </Text>
          </View>
          <Text style={styles.description}>{t("system_comparison_note")}</Text>

          {Array.isArray(benchmarks) && benchmarks.length ? (
            <View style={styles.benchmarkCard}>
              {benchmarks.slice(0, 3).map((b) => (
                <View key={b.key} style={styles.benchmarkItem}>
                  <Text style={styles.benchmarkLabel}>{b.label}</Text>
                  <View style={styles.benchmarkRow}>
                    <Text style={styles.benchmarkMetric}>
                      AUC: {formatPct(b.metrics?.auc)}
                    </Text>
                    <Text style={styles.benchmarkMetric}>
                      {t("sensitivity")}: {formatPct(b.metrics?.sensitivity)}
                    </Text>
                    <Text style={styles.benchmarkMetric}>
                      {t("specificity")}: {formatPct(b.metrics?.specificity)}
                    </Text>
                  </View>
                  {!!b.citation && (
                    <Text style={styles.benchmarkCitation}>{b.citation}</Text>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.description}>{t("about_no_benchmarks")}</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Info color={colors.info} size={18} />
            <Text style={styles.sectionTitleInline}>
              {t("about_disclaimer")}
            </Text>
          </View>
          <Text style={styles.description}>{t("about_disclaimer_desc")}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t("about_footer_brand")}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;
