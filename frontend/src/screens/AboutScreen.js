import { useState } from "react";
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
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
  LineChart,
  Brain,
  Lock,
  File,
  Database,
  Cpu,
  Target,
  Activity,
  Layers,
  BarChart3,
  Zap,
  GitBranch,
  BookOpen,
  AlertTriangle,
  CheckCircle,
} from "lucide-react-native";
import { createStyles } from "../styles/AboutScreen.styles";
import { useGetBenchmarksQuery } from "../services/api";

// ---------------------------------------------------------------------------
// Model training report data (from Model_Training_Report.md)
// ---------------------------------------------------------------------------
const MODEL_VERSION = "2.0.0";
const TRAINING_DATE = "2026-04-22";
const DATASET_SIZE = "1,000,000";
const MODEL_TYPE = "Calibrated Ensemble (XGBoost + Random Forest)";
const LABEL_STRATEGY = "WHO Clinical Knowledge-Driven Labels";

const PERFORMANCE_METRICS = [
  { label: "Accuracy", value: "81.59%", color: "#2ECC71" },
  { label: "AUC-ROC", value: "0.9097", color: "#3498DB" },
  { label: "Precision", value: "85.00%", color: "#9B59B6" },
  { label: "Recall", value: "79.59%", color: "#E67E22" },
  { label: "F1-Score", value: "82.20%", color: "#E74C3C" },
  { label: "CV Accuracy", value: "81.47% ± 0.20%", color: "#16A085" },
];

const CONFUSION_MATRIX = {
  tn: "78,128",
  fp: "15,012",
  fn: "21,810",
  tp: "85,050",
};

const FEATURES_LIST = [
  { name: "Fever", type: "Base" },
  { name: "Headache", type: "Base" },
  { name: "JointPain", type: "Base" },
  { name: "Bleeding", type: "Base" },
  { name: "symptom_count", type: "Aggregate" },
  { name: "Fever_AND_Headache", type: "Interaction" },
  { name: "Fever_AND_JointPain", type: "Interaction" },
  { name: "Fever_AND_Bleeding", type: "Interaction" },
  { name: "Headache_AND_JointPain", type: "Interaction" },
  { name: "Headache_AND_Bleeding", type: "Interaction" },
  { name: "JointPain_AND_Bleeding", type: "Interaction" },
  { name: "fever_bleeding_combo", type: "Aggregate" },
  { name: "all_symptoms", type: "Aggregate" },
  { name: "no_symptoms", type: "Aggregate" },
];

const SYMPTOM_WEIGHTS = [
  { name: "Skin Rash", weight: 0.56 },
  { name: "Fever", weight: 0.44 },
  { name: "Vomiting", weight: 0.38 },
  { name: "Chills", weight: 0.32 },
  { name: "Body Pain", weight: 0.30 },
  { name: "Eye Pain", weight: 0.28 },
  { name: "Appetite Loss", weight: 0.28 },
  { name: "Bleeding", weight: 0.28 },
  { name: "Headache", weight: 0.26 },
  { name: "Fatigue", weight: 0.24 },
  { name: "Itching", weight: 0.16 },
  { name: "Joint Pain", weight: 0.14 },
];

const WHO_LABEL_RULES = [
  { pattern: "All 4 symptoms (Fever + Headache + JointPain + Bleeding)", prob: "95%" },
  { pattern: "Fever + 2 other symptoms", prob: "~100%" },
  { pattern: "Fever + 1 other symptom", prob: "70%" },
  { pattern: "3 symptoms (no fever)", prob: "75%" },
  { pattern: "2 symptoms (no fever)", prob: "40%" },
  { pattern: "Bleeding alone", prob: "50%" },
  { pattern: "No symptoms", prob: "5%" },
];

const EXAMPLE_DIAGNOSES = [
  {
    title: "Fever + Headache + JointPain + MusclePain",
    ml_prob: "100%",
    detection: "Dengue Warning Stage (AI High Confidence)",
    risk: "High",
    alert: "AMBER ALERT",
    alertColor: "#E67E22",
  },
  {
    title: "No Symptoms Selected",
    ml_prob: "5%",
    detection: "Dengue Unlikely (AI Predicted)",
    risk: "Low",
    alert: "Routine Evaluation",
    alertColor: "#2ECC71",
  },
  {
    title: "Severe Bleeding + Shock + Impaired Consciousness",
    ml_prob: "70%",
    detection: "Severe Dengue (KBS Override)",
    risk: "Critical",
    alert: "RED ALERT",
    alertColor: "#D32F2F",
  },
];

const PIPELINE_STEPS = [
  { step: "1", label: "User submits symptoms via the form", icon: "input" },
  { step: "2", label: "Feature Engineering (14 features created)", icon: "features" },
  { step: "3", label: "XGBoost + Random Forest Ensemble prediction", icon: "ml" },
  { step: "4", label: "Isotonic Probability Calibration", icon: "calibration" },
  { step: "5", label: "Symptom Severity Scoring (knowledge weights)", icon: "severity" },
  { step: "6", label: "4-Class Staging (No Dengue / Mild / Warning / Severe)", icon: "staging" },
  { step: "7", label: "KBS Forward Chaining Engine (12 WHO rules)", icon: "kbs" },
  { step: "8", label: "Final Diagnosis + Recommendations + Alert", icon: "result" },
];

const VERSION_COMPARISON = [
  { aspect: "Training Data", v1: "2,000 synthetic", v2: "1,000,000 real patients" },
  { aspect: "Model", v1: "Single Random Forest", v2: "XGBoost + RF Ensemble" },
  { aspect: "Features", v1: "9", v2: "14 (with interactions)" },
  { aspect: "Accuracy", v1: "~50%", v2: "81.59%" },
  { aspect: "AUC-ROC", v1: "N/A", v2: "0.9097" },
  { aspect: "Knowledge Base", v1: "None", v2: "50 symptom descriptions" },
  { aspect: "Label Strategy", v1: "Random", v2: "WHO Clinical Rules" },
];

const AboutScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);
  const { data: benchmarks = [] } = useGetBenchmarksQuery();

  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const appVersion =
    Constants?.expoConfig?.version || Constants?.manifest?.version || "1.0.0";

  const formatPct = (v) => {
    if (typeof v !== "number" || Number.isNaN(v)) return "—";
    return `${Math.round(v * 100)}%`;
  };

  const textAlign = isRTL ? "right" : "left";
  const flexDir = isRTL ? "row-reverse" : "row";

  // Reusable collapsible section
  const CollapsibleSection = ({ sectionKey, icon: Icon, iconColor, title, children }) => (
    <View style={styles.section}>
      <TouchableOpacity
        style={[styles.sectionHeaderRow, { justifyContent: "space-between" }]}
        onPress={() => toggleSection(sectionKey)}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: flexDir, alignItems: "center", gap: spacing.s, flex: 1 }}>
          <Icon color={iconColor} size={18} />
          <Text style={[styles.sectionTitleInline, { flex: 1 }]}>{title}</Text>
        </View>
        {expandedSections[sectionKey] ? (
          <ChevronUp color={colors.textMuted} size={18} />
        ) : (
          <ChevronDown color={colors.textMuted} size={18} />
        )}
      </TouchableOpacity>
      {expandedSections[sectionKey] && children}
    </View>
  );

  // Reusable key-value row
  const KVRow = ({ label, value, valueColor }) => (
    <View
      style={{
        flexDirection: flexDir,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.glassBorder,
      }}
    >
      <Text style={{ ...typography.caption, color: colors.textMuted, flex: 1, textAlign }}>
        {label}
      </Text>
      <Text
        style={{
          ...typography.body,
          color: valueColor || colors.text,
          fontWeight: "700",
          textAlign: isRTL ? "left" : "right",
        }}
      >
        {value}
      </Text>
    </View>
  );

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
        {/* Hero */}
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
          {/* Model version badge */}
          <View
            style={{
              flexDirection: flexDir,
              marginTop: spacing.m,
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <View
              style={{
                backgroundColor: colors.primary + "18",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  ...typography.caption,
                  color: colors.primary,
                  fontWeight: "bold",
                }}
              >
                AI Model v{MODEL_VERSION}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#2ECC7118",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  ...typography.caption,
                  color: "#2ECC71",
                  fontWeight: "bold",
                }}
              >
                {DATASET_SIZE} Patients
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#9B59B618",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  ...typography.caption,
                  color: "#9B59B6",
                  fontWeight: "bold",
                }}
              >
                {LABEL_STRATEGY}
              </Text>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("app_info")}</Text>
          <Text style={styles.description}>{t("app_desc")}</Text>
        </View>

        {/* Quick Feature Cards */}
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

        {/* ============================================================ */}
        {/*  MODEL TRAINING REPORT DETAILS                               */}
        {/* ============================================================ */}

        {/* 1. Model Performance Metrics */}
        <CollapsibleSection
          sectionKey="performance"
          icon={BarChart3}
          iconColor="#2ECC71"
          title="Model Performance Metrics"
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.glassBorder,
              padding: spacing.m,
              marginTop: spacing.s,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "space-between",
              }}
            >
              {PERFORMANCE_METRICS.map((m) => (
                <View
                  key={m.label}
                  style={{
                    width: "47%",
                    backgroundColor: m.color + "12",
                    borderRadius: 12,
                    padding: 12,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: m.color + "30",
                  }}
                >
                  <Text
                    style={{
                      ...typography.h2,
                      color: m.color,
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    {m.value}
                  </Text>
                  <Text
                    style={{
                      ...typography.caption,
                      color: colors.textMuted,
                      marginTop: 4,
                    }}
                  >
                    {m.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* Confusion Matrix */}
            <Text
              style={{
                ...typography.body,
                color: colors.text,
                fontWeight: "700",
                marginTop: spacing.l,
                marginBottom: spacing.s,
                textAlign,
              }}
            >
              Confusion Matrix (200K Test Set)
            </Text>
            <View
              style={{
                borderRadius: 12,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: colors.glassBorder,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#2ECC7118",
                    padding: 12,
                    alignItems: "center",
                    borderRightWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: colors.glassBorder,
                  }}
                >
                  <Text style={{ ...typography.caption, color: colors.textMuted }}>
                    True Negative
                  </Text>
                  <Text
                    style={{
                      ...typography.body,
                      color: "#2ECC71",
                      fontWeight: "bold",
                      marginTop: 4,
                    }}
                  >
                    {CONFUSION_MATRIX.tn}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#E74C3C12",
                    padding: 12,
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderColor: colors.glassBorder,
                  }}
                >
                  <Text style={{ ...typography.caption, color: colors.textMuted }}>
                    False Positive
                  </Text>
                  <Text
                    style={{
                      ...typography.body,
                      color: "#E74C3C",
                      fontWeight: "bold",
                      marginTop: 4,
                    }}
                  >
                    {CONFUSION_MATRIX.fp}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#E67E2212",
                    padding: 12,
                    alignItems: "center",
                    borderRightWidth: 1,
                    borderColor: colors.glassBorder,
                  }}
                >
                  <Text style={{ ...typography.caption, color: colors.textMuted }}>
                    False Negative
                  </Text>
                  <Text
                    style={{
                      ...typography.body,
                      color: "#E67E22",
                      fontWeight: "bold",
                      marginTop: 4,
                    }}
                  >
                    {CONFUSION_MATRIX.fn}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#3498DB12",
                    padding: 12,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ ...typography.caption, color: colors.textMuted }}>
                    True Positive
                  </Text>
                  <Text
                    style={{
                      ...typography.body,
                      color: "#3498DB",
                      fontWeight: "bold",
                      marginTop: 4,
                    }}
                  >
                    {CONFUSION_MATRIX.tp}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </CollapsibleSection>

        {/* 2. Model Architecture */}
        <CollapsibleSection
          sectionKey="architecture"
          icon={Cpu}
          iconColor="#3498DB"
          title="Model Architecture"
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.glassBorder,
              padding: spacing.m,
              marginTop: spacing.s,
            }}
          >
            <KVRow label="Model Type" value={MODEL_TYPE} />
            <KVRow label="Trained On" value={TRAINING_DATE} />
            <KVRow label="Dataset Size" value={`${DATASET_SIZE} patients`} />
            <KVRow label="Label Strategy" value={LABEL_STRATEGY} />

            <Text
              style={{
                ...typography.body,
                color: colors.text,
                fontWeight: "700",
                marginTop: spacing.l,
                marginBottom: spacing.s,
                textAlign,
              }}
            >
              Ensemble Components
            </Text>

            {/* XGBoost card */}
            <View
              style={{
                backgroundColor: "#3498DB10",
                borderRadius: 12,
                padding: spacing.m,
                borderWidth: 1,
                borderColor: "#3498DB30",
                marginBottom: spacing.s,
              }}
            >
              <Text
                style={{
                  ...typography.body,
                  color: "#3498DB",
                  fontWeight: "bold",
                  textAlign,
                }}
              >
                XGBoost (Weight: 2)
              </Text>
              <Text
                style={{
                  ...typography.caption,
                  color: colors.textMuted,
                  marginTop: 4,
                  lineHeight: 20,
                  textAlign,
                }}
              >
                300 estimators {"\u2022"} Max depth 6 {"\u2022"} LR 0.1{"\n"}
                Subsample 80% {"\u2022"} Col-sample 80%{"\n"}
                L1 (alpha) 0.1 {"\u2022"} L2 (lambda) 1.0
              </Text>
            </View>

            {/* Random Forest card */}
            <View
              style={{
                backgroundColor: "#2ECC7110",
                borderRadius: 12,
                padding: spacing.m,
                borderWidth: 1,
                borderColor: "#2ECC7130",
                marginBottom: spacing.s,
              }}
            >
              <Text
                style={{
                  ...typography.body,
                  color: "#2ECC71",
                  fontWeight: "bold",
                  textAlign,
                }}
              >
                Random Forest (Weight: 1)
              </Text>
              <Text
                style={{
                  ...typography.caption,
                  color: colors.textMuted,
                  marginTop: 4,
                  lineHeight: 20,
                  textAlign,
                }}
              >
                200 estimators {"\u2022"} Max depth 10{"\n"}
                Min samples split 5 {"\u2022"} Min samples leaf 2
              </Text>
            </View>

            {/* Calibration card */}
            <View
              style={{
                backgroundColor: "#9B59B610",
                borderRadius: 12,
                padding: spacing.m,
                borderWidth: 1,
                borderColor: "#9B59B630",
              }}
            >
              <Text
                style={{
                  ...typography.body,
                  color: "#9B59B6",
                  fontWeight: "bold",
                  textAlign,
                }}
              >
                Isotonic Calibration
              </Text>
              <Text
                style={{
                  ...typography.caption,
                  color: colors.textMuted,
                  marginTop: 4,
                  lineHeight: 20,
                  textAlign,
                }}
              >
                3-fold cross-validation {"\u2022"} Ensures a 70% prediction
                truly means ~70% of such cases are dengue
              </Text>
            </View>
          </View>
        </CollapsibleSection>

        {/* 3. Feature Engineering */}
        <CollapsibleSection
          sectionKey="features"
          icon={Layers}
          iconColor="#E67E22"
          title={`Feature Engineering (${FEATURES_LIST.length} Features)`}
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.glassBorder,
              padding: spacing.m,
              marginTop: spacing.s,
            }}
          >
            {FEATURES_LIST.map((f, i) => {
              const typeColor =
                f.type === "Base"
                  ? "#3498DB"
                  : f.type === "Interaction"
                  ? "#E67E22"
                  : "#2ECC71";
              return (
                <View
                  key={i}
                  style={{
                    flexDirection: flexDir,
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 8,
                    borderBottomWidth: i < FEATURES_LIST.length - 1 ? 1 : 0,
                    borderBottomColor: colors.glassBorder,
                  }}
                >
                  <Text
                    style={{
                      ...typography.body,
                      color: colors.text,
                      fontSize: 13,
                      fontWeight: "600",
                      textAlign,
                    }}
                  >
                    {f.name}
                  </Text>
                  <View
                    style={{
                      backgroundColor: typeColor + "18",
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        ...typography.caption,
                        color: typeColor,
                        fontWeight: "700",
                        fontSize: 10,
                      }}
                    >
                      {f.type}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </CollapsibleSection>

        {/* 4. Symptom Knowledge Weights */}
        <CollapsibleSection
          sectionKey="weights"
          icon={BookOpen}
          iconColor="#9B59B6"
          title="Symptom Knowledge Weights"
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.glassBorder,
              padding: spacing.m,
              marginTop: spacing.s,
            }}
          >
            <Text
              style={{
                ...typography.caption,
                color: colors.textMuted,
                lineHeight: 20,
                marginBottom: spacing.m,
                textAlign,
              }}
            >
              Extracted from 50 documented dengue case descriptions via NLP
              keyword matching. Used for severity scoring at inference time.
            </Text>
            {SYMPTOM_WEIGHTS.map((s, i) => (
              <View
                key={i}
                style={{
                  flexDirection: flexDir,
                  alignItems: "center",
                  paddingVertical: 8,
                  borderBottomWidth: i < SYMPTOM_WEIGHTS.length - 1 ? 1 : 0,
                  borderBottomColor: colors.glassBorder,
                }}
              >
                <Text
                  style={{
                    ...typography.body,
                    color: colors.text,
                    flex: 1,
                    fontSize: 13,
                    fontWeight: "600",
                    textAlign,
                  }}
                >
                  {s.name}
                </Text>
                {/* Weight bar */}
                <View style={{ flexDirection: flexDir, alignItems: "center", gap: 8 }}>
                  <View
                    style={{
                      width: 80,
                      height: 8,
                      backgroundColor: colors.glassBorder,
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        width: `${Math.round(s.weight * 100)}%`,
                        height: "100%",
                        backgroundColor: "#9B59B6",
                        borderRadius: 4,
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      ...typography.caption,
                      color: "#9B59B6",
                      fontWeight: "bold",
                      width: 36,
                      textAlign: "right",
                    }}
                  >
                    {(s.weight * 100).toFixed(0)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </CollapsibleSection>

        {/* 5. WHO Label Strategy */}
        <CollapsibleSection
          sectionKey="labels"
          icon={Target}
          iconColor="#E74C3C"
          title="WHO Clinical Label Strategy"
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.glassBorder,
              padding: spacing.m,
              marginTop: spacing.s,
            }}
          >
            <Text
              style={{
                ...typography.caption,
                color: colors.textMuted,
                lineHeight: 20,
                marginBottom: spacing.m,
                textAlign,
              }}
            >
              The raw dataset had randomly assigned labels. We replaced them with
              clinically-meaningful labels based on WHO 2009 dengue
              classification guidelines.
            </Text>
            {WHO_LABEL_RULES.map((rule, i) => (
              <View
                key={i}
                style={{
                  flexDirection: flexDir,
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: i < WHO_LABEL_RULES.length - 1 ? 1 : 0,
                  borderBottomColor: colors.glassBorder,
                }}
              >
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.text,
                    flex: 1,
                    fontSize: 12,
                    textAlign,
                  }}
                >
                  {rule.pattern}
                </Text>
                <View
                  style={{
                    backgroundColor: "#E74C3C18",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                    marginLeft: isRTL ? 0 : 8,
                    marginRight: isRTL ? 8 : 0,
                  }}
                >
                  <Text
                    style={{
                      ...typography.caption,
                      color: "#E74C3C",
                      fontWeight: "bold",
                    }}
                  >
                    {rule.prob}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </CollapsibleSection>

        {/* 6. Diagnosis Pipeline */}
        <CollapsibleSection
          sectionKey="pipeline"
          icon={GitBranch}
          iconColor="#16A085"
          title="Diagnosis Pipeline (End-to-End)"
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.glassBorder,
              padding: spacing.m,
              marginTop: spacing.s,
            }}
          >
            {PIPELINE_STEPS.map((step, i) => (
              <View
                key={i}
                style={{
                  flexDirection: flexDir,
                  alignItems: "flex-start",
                  marginBottom: i < PIPELINE_STEPS.length - 1 ? 0 : 0,
                }}
              >
                {/* Timeline */}
                <View
                  style={{
                    alignItems: "center",
                    marginRight: isRTL ? 0 : 14,
                    marginLeft: isRTL ? 14 : 0,
                  }}
                >
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: "#16A08520",
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: "#16A085",
                    }}
                  >
                    <Text
                      style={{
                        ...typography.caption,
                        color: "#16A085",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      {step.step}
                    </Text>
                  </View>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <View
                      style={{
                        width: 2,
                        height: 20,
                        backgroundColor: "#16A08530",
                      }}
                    />
                  )}
                </View>
                <Text
                  style={{
                    ...typography.body,
                    color: colors.text,
                    fontSize: 13,
                    flex: 1,
                    paddingTop: 4,
                    paddingBottom: 16,
                    textAlign,
                  }}
                >
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </CollapsibleSection>

        {/* 7. Two-System Safety Design */}
        <CollapsibleSection
          sectionKey="safety"
          icon={ShieldCheck}
          iconColor="#D32F2F"
          title="Two-System Safety Design"
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.glassBorder,
              padding: spacing.m,
              marginTop: spacing.s,
            }}
          >
            <Text
              style={{
                ...typography.caption,
                color: colors.textMuted,
                lineHeight: 20,
                marginBottom: spacing.m,
                textAlign,
              }}
            >
              The system uses a dual-layer approach where clinical rules can
              override AI predictions. Even if the AI predicts "Mild Dengue",
              the KBS will override to "Severe Dengue - Critical" if
              life-threatening clinical signs are present.
            </Text>

            <View
              style={{
                flexDirection: flexDir,
                gap: 8,
                marginBottom: spacing.m,
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#3498DB10",
                  borderRadius: 12,
                  padding: 12,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#3498DB30",
                }}
              >
                <Brain color="#3498DB" size={22} />
                <Text
                  style={{
                    ...typography.caption,
                    color: "#3498DB",
                    fontWeight: "bold",
                    marginTop: 6,
                  }}
                >
                  ML Model
                </Text>
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.textMuted,
                    fontSize: 10,
                    textAlign: "center",
                    marginTop: 2,
                  }}
                >
                  Probability + Severity
                </Text>
              </View>
              <View style={{ justifyContent: "center" }}>
                <Text style={{ fontSize: 20 }}>+</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#E74C3C10",
                  borderRadius: 12,
                  padding: 12,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#E74C3C30",
                }}
              >
                <ShieldCheck color="#E74C3C" size={22} />
                <Text
                  style={{
                    ...typography.caption,
                    color: "#E74C3C",
                    fontWeight: "bold",
                    marginTop: 6,
                  }}
                >
                  KBS Engine
                </Text>
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.textMuted,
                    fontSize: 10,
                    textAlign: "center",
                    marginTop: 2,
                  }}
                >
                  12 WHO Rules
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "#D32F2F10",
                borderRadius: 12,
                padding: spacing.m,
                borderWidth: 1,
                borderColor: "#D32F2F25",
              }}
            >
              <View style={{ flexDirection: flexDir, alignItems: "center", gap: 8 }}>
                <AlertTriangle color="#D32F2F" size={16} />
                <Text
                  style={{
                    ...typography.caption,
                    color: "#D32F2F",
                    fontWeight: "bold",
                    flex: 1,
                    textAlign,
                  }}
                >
                  Safety Override Example
                </Text>
              </View>
              <Text
                style={{
                  ...typography.caption,
                  color: colors.textMuted,
                  lineHeight: 20,
                  marginTop: 6,
                  textAlign,
                }}
              >
                If AI predicts "Mild Dengue" at 70%, but patient shows severe
                bleeding + shock, the KBS engine forces "Critical - RED ALERT"
                with immediate ICU recommendation.
              </Text>
            </View>
          </View>
        </CollapsibleSection>

        {/* 8. Example Diagnosis Results */}
        <CollapsibleSection
          sectionKey="examples"
          icon={CheckCircle}
          iconColor="#2ECC71"
          title="Example Diagnosis Results"
        >
          <View style={{ marginTop: spacing.s, gap: spacing.s }}>
            {EXAMPLE_DIAGNOSES.map((ex, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.glassBorder,
                  padding: spacing.m,
                  borderLeftWidth: 4,
                  borderLeftColor: ex.alertColor,
                }}
              >
                <Text
                  style={{
                    ...typography.body,
                    color: colors.text,
                    fontWeight: "bold",
                    marginBottom: 8,
                    textAlign,
                  }}
                >
                  {ex.title}
                </Text>
                <KVRow label="ML Probability" value={ex.ml_prob} valueColor={ex.alertColor} />
                <KVRow label="Detection" value={ex.detection} />
                <KVRow label="Risk" value={ex.risk} valueColor={ex.alertColor} />
                <View
                  style={{
                    flexDirection: flexDir,
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 8,
                  }}
                >
                  <Text
                    style={{ ...typography.caption, color: colors.textMuted, textAlign }}
                  >
                    Alert
                  </Text>
                  <View
                    style={{
                      backgroundColor: ex.alertColor + "18",
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        ...typography.caption,
                        color: ex.alertColor,
                        fontWeight: "bold",
                      }}
                    >
                      {ex.alert}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </CollapsibleSection>

        {/* 9. Version Comparison (v1.0 vs v2.0) */}
        <CollapsibleSection
          sectionKey="comparison"
          icon={Zap}
          iconColor="#E67E22"
          title="Version Comparison (v1.0 vs v2.0)"
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.glassBorder,
              padding: spacing.m,
              marginTop: spacing.s,
            }}
          >
            {/* Column headers */}
            <View
              style={{
                flexDirection: "row",
                paddingBottom: 10,
                borderBottomWidth: 2,
                borderBottomColor: colors.glassBorder,
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  ...typography.caption,
                  color: colors.textMuted,
                  flex: 1.2,
                  fontWeight: "bold",
                }}
              >
                Aspect
              </Text>
              <Text
                style={{
                  ...typography.caption,
                  color: "#E74C3C",
                  flex: 1,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                v1.0 (Old)
              </Text>
              <Text
                style={{
                  ...typography.caption,
                  color: "#2ECC71",
                  flex: 1,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                v2.0 (New)
              </Text>
            </View>
            {VERSION_COMPARISON.map((row, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  paddingVertical: 8,
                  borderBottomWidth: i < VERSION_COMPARISON.length - 1 ? 1 : 0,
                  borderBottomColor: colors.glassBorder,
                }}
              >
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.text,
                    flex: 1.2,
                    fontWeight: "600",
                    fontSize: 11,
                  }}
                >
                  {row.aspect}
                </Text>
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.textMuted,
                    flex: 1,
                    textAlign: "center",
                    fontSize: 11,
                  }}
                >
                  {row.v1}
                </Text>
                <Text
                  style={{
                    ...typography.caption,
                    color: "#2ECC71",
                    flex: 1,
                    textAlign: "center",
                    fontWeight: "700",
                    fontSize: 11,
                  }}
                >
                  {row.v2}
                </Text>
              </View>
            ))}
          </View>
        </CollapsibleSection>

        {/* System Comparison (original benchmark section) */}
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

        {/* Disclaimer */}
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
          <Text
            style={{
              ...typography.caption,
              color: colors.textMuted,
              marginTop: 4,
              fontSize: 10,
            }}
          >
            Model v{MODEL_VERSION} {"\u2022"} Trained {TRAINING_DATE} {"\u2022"}{" "}
            {DATASET_SIZE} patients
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;
