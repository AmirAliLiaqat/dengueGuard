import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Share, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  AlertCircle,
  CheckCircle,
  Info,
  List,
  Brain,
  Share2,
} from "lucide-react-native";
import { generateAndSavePDF } from "../utils/pdfGenerator";
import { useGetMeQuery, useRecordActionMutation } from "../services/api";
import { createStyles } from "../styles/ResultScreen.styles";
import { useGetBenchmarksQuery } from "../services/api";

const ResultScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);

  const styles = createStyles(theme, isRTL);

  const reportData = route.params?.data || {};
  const diagnosis = reportData.kbs_recommendation || {};
  const { data: me } = useGetMeQuery();
  const { data: benchmarks } = useGetBenchmarksQuery();

  const stage = diagnosis.disease_detection || t("analysis_complete");
  const risk = diagnosis.risk_classification || t("unknown");
  const recommendation = diagnosis.clinical_recommendations || t("consult_doctor");
  const alertText = diagnosis.alert_system;
  let probability = 0;
  if (
    reportData.ml_prediction &&
    typeof reportData.ml_prediction.probability === "number"
  ) {
    probability = (reportData.ml_prediction.probability * 100).toFixed(0);
  } else if (
    reportData.ml_model_result &&
    typeof reportData.ml_model_result.probability === "number"
  ) {
    // fallback for old format if any
    probability = (reportData.ml_model_result.probability * 100).toFixed(0);
  }

  // Determine colors based on risk
  let riskColor = colors.primary;
  if (risk === "Moderate") riskColor = colors.warning || "#FFA500";
  if (risk === "High") riskColor = colors.accent || "#FF6B6B";
  if (risk === "Critical") riskColor = "#D32F2F";

  const formatList = (text) => {
    if (Array.isArray(text)) return text;
    if (!text) return [];
    if (typeof text === "string" && text.includes("\n")) {
      return text.split("\n").filter((i) => i.trim().length > 0);
    }
    return String(text)
      .split(/\.\s+/)
      .filter((i) => i.trim().length > 0)
      .map((i) => (i.endsWith(".") ? i : i + "."));
  };

  const getSymptomsList = () => {
    if (!reportData.symptoms) return [];
    return Object.entries(reportData.symptoms)
      .filter(([_, val]) => val === true || val === "true")
      .map(([key, _]) =>
        key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      );
  };

  const getReasoningList = () => {
    const r = diagnosis.explainable_reasoning;
    if (!Array.isArray(r)) return [];
    return r;
  };

  const renderReasoningString = (text) => {
    const m = /^Rule\s+([^:]+):\s*([\s\S]*)$/i.exec(String(text || ""));
    if (!m) return <Text style={styles.reasoningText}>{String(text)}</Text>;
    const ruleId = m[1].trim();
    const rest = m[2]?.trim();
    return (
      <Text style={styles.reasoningText}>
        <Text style={styles.ruleIdBold}>{ruleId}</Text>
        {rest ? `: ${rest}` : ""}
      </Text>
    );
  };

  const formatKeyLabel = (key) =>
    t(key) ||
    key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const formatValue = (val) => {
    if (val === null || val === undefined || val === "") return "—";
    if (val === true) return t("yes") || "Yes";
    if (val === false) return t("no") || "No";
    return String(val);
  };

  const formatPct = (v) => {
    if (typeof v !== "number" || Number.isNaN(v)) return "—";
    return `${Math.round(v * 100)}%`;
  };

  const pickBenchmark = (key) =>
    Array.isArray(benchmarks) ? benchmarks.find((b) => b.key === key) : null;
  const exampleBenchmark = pickBenchmark("example_ann_diagnosis");

  const pickSymptomValue = (key) => reportData?.symptoms?.[key];

  const sections = [
    {
      key: "vital_signs",
      items: ["body_temperature", "blood_pressure", "heart_rate"],
    },
    {
      key: "laboratory_tests",
      items: ["platelet_count", "white_blood_cell_count", "hematocrit_level"],
    },
    {
      key: "warning_signs",
      items: [
        "abdominal_pain",
        "persistent_vomiting",
        "clinical_fluid_accumulation",
        "mucosal_bleeding",
        "lethargy_or_restlessness",
        "liver_enlargement",
        "hematocrit_increases",
        "platelet_decreases",
      ],
    },
    {
      key: "severe_criteria",
      items: [
        "severe_plasma_leakage",
        "shock_dss",
        "respiratory_distress",
        "severe_bleeding",
        "ast_alt_1000",
        "impaired_consciousness",
        "heart_involvement",
      ],
    },
    {
      key: "phase_home_care_criteria",
      items: ["tolerates_oral_fluids", "urinating_regularly", "fever_drops"],
    },
  ];

  const [recordAction] = useRecordActionMutation();

  const handleShare = async () => {
    try {
      const stageMessage =
        reportData.kbs_recommendation?.disease_detection || t("dengue_analysis");
      const riskLevel =
        reportData.kbs_recommendation?.risk_classification || t("unknown");
      const probValue = (reportData.ml_prediction?.probability * 100).toFixed(
        0,
      );
      const recsList = formatList(
        reportData.kbs_recommendation?.clinical_recommendations || "",
      ).join("\n- ");

      const userLine = me
        ? `${t("patient")}: ${me.full_name || "—"}\n${t("email")}: ${me.email || "—"}\n${t("phone")}: ${me.phone_number || me.phone || "—"}\n`
        : "";

      const vitalsLines = ["body_temperature", "blood_pressure", "heart_rate"]
        .map((k) => `- ${formatKeyLabel(k)}: ${formatValue(pickSymptomValue(k))}`)
        .join("\n");
      const labsLines = ["platelet_count", "white_blood_cell_count", "hematocrit_level"]
        .map((k) => `- ${formatKeyLabel(k)}: ${formatValue(pickSymptomValue(k))}`)
        .join("\n");

      const ruleLines = getReasoningList()
        .map((r) => {
          if (typeof r === "string") return `- ${r}`;
          const rid = r?.id ? `**${r.id}**` : "**Rule**";
          const desc = r?.description ? `: ${r.description}` : "";
          const why = r?.matched
            ? Object.entries(r.matched)
                .map(([k, v]) => `${formatKeyLabel(k)}=${formatValue(v?.actual)}`)
                .join(", ")
            : "";
          return `${rid}${desc}${why ? `\n  - Why: ${why}` : ""}`;
        })
        .join("\n");

      const message =
        `📋 ${t("diagnosis_report")}\n\n` +
        (userLine ? `${userLine}\n` : "") +
        `${t("result")}: ${stageMessage}\n` +
        `${t("risk_label")}: ${t(riskLevel.toLowerCase())}\n` +
        `${t("probability")}: ${probValue}%\n\n` +
        `${t("vital_signs")}:\n${vitalsLines}\n\n` +
        `${t("laboratory_tests")}:\n${labsLines}\n\n` +
        `${t("recommendations")}:\n- ${recsList || "—"}\n\n` +
        `${t("logic_reasoning")}:\n${ruleLines || "—"}\n\n` +
        `${t("generated_by")}`;

      const result = await Share.share({
        message,
        title: t("health_report"),
      });

      if (result.action === Share.sharedAction) {
        await recordAction({
          action_type: "share",
          report_id: reportData.id,
        }).unwrap();
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const pdfData = {
        ...reportData,
        date: new Date(reportData.created_at).toLocaleDateString(),
        time: new Date(reportData.created_at).toLocaleTimeString(),
        result: risk,
        status: stage,
        score: probability,
        alertText: alertText,
        symptoms: getSymptomsList(),
        recommendations: formatList(recommendation),
        reasoning: getReasoningList(),
        user: me
          ? {
              full_name: me.full_name,
              email: me.email,
              phone_number: me.phone_number || me.phone,
              profile_picture: me.profile_picture,
            }
          : null,
        details: {
          vitals: {
            body_temperature: pickSymptomValue("body_temperature"),
            blood_pressure: pickSymptomValue("blood_pressure"),
            heart_rate: pickSymptomValue("heart_rate"),
          },
          labs: {
            platelet_count: pickSymptomValue("platelet_count"),
            white_blood_cell_count: pickSymptomValue("white_blood_cell_count"),
            hematocrit_level: pickSymptomValue("hematocrit_level"),
          },
          warning_signs: {
            abdominal_pain: pickSymptomValue("abdominal_pain"),
            persistent_vomiting: pickSymptomValue("persistent_vomiting"),
            clinical_fluid_accumulation: pickSymptomValue("clinical_fluid_accumulation"),
            mucosal_bleeding: pickSymptomValue("mucosal_bleeding"),
            lethargy_or_restlessness: pickSymptomValue("lethargy_or_restlessness"),
            liver_enlargement: pickSymptomValue("liver_enlargement"),
            hematocrit_increases: pickSymptomValue("hematocrit_increases"),
            platelet_decreases: pickSymptomValue("platelet_decreases"),
          },
          severe_criteria: {
            severe_plasma_leakage: pickSymptomValue("severe_plasma_leakage"),
            shock_dss: pickSymptomValue("shock_dss"),
            respiratory_distress: pickSymptomValue("respiratory_distress"),
            severe_bleeding: pickSymptomValue("severe_bleeding"),
            ast_alt_1000: pickSymptomValue("ast_alt_1000"),
            impaired_consciousness: pickSymptomValue("impaired_consciousness"),
            heart_involvement: pickSymptomValue("heart_involvement"),
          },
          home_care: {
            tolerates_oral_fluids: pickSymptomValue("tolerates_oral_fluids"),
            urinating_regularly: pickSymptomValue("urinating_regularly"),
            fever_drops: pickSymptomValue("fever_drops"),
          },
        },
      };

      await generateAndSavePDF(pdfData);
      await recordAction({
        action_type: "download",
        report_id: reportData.id,
      }).unwrap();
    } catch (err) {
      console.log("Error downloading PDF:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Main")}
        >
          {isRTL ? (
            <ChevronRight color={colors.text} size={24} />
          ) : (
            <ChevronLeft color={colors.text} size={24} />
          )}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("diagnosis_result")}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Share2 color={colors.primary} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleDownload}
            disabled={isDownloading}
          >
            <Download color={colors.primary} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {(me?.full_name || me?.email || me?.profile_picture || me?.phone_number || me?.phone) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Info color={colors.info} size={20} />
              <Text style={styles.sectionTitle}>{t("user_details")}</Text>
            </View>
            <View style={styles.userRow}>
              {me?.profile_picture ? (
                <Image source={{ uri: me.profile_picture }} style={styles.userAvatar} />
              ) : (
                <View style={styles.userAvatarPlaceholder} />
              )}
              <View style={styles.userMeta}>
                <Text style={styles.userName}>{me?.full_name || t("patient")}</Text>
                {!!me?.email && <Text style={styles.userSub}>{me.email}</Text>}
                {!!(me?.phone_number || me?.phone) && (
                  <Text style={styles.userSub}>{me.phone_number || me.phone}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {alertText && (
          <View
            style={[
              styles.alertBanner,
              { borderColor: riskColor, backgroundColor: riskColor + "12" },
            ]}
          >
            <View style={styles.alertRow}>
              <View style={[styles.alertIconWrap, { backgroundColor: riskColor + "1A" }]}>
                <AlertCircle color={riskColor} size={18} />
              </View>
              <View style={styles.alertBody}>
                <Text style={[styles.alertTitle, { color: riskColor }]}>
                  {t("alert")}
                </Text>
                <Text style={[styles.alertText, { color: riskColor }]}>
                  {alertText}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.resultCard}>
          {reportData.created_at && (
            <Text style={styles.dateText}>
              {(() => {
                const utcString = reportData.created_at.endsWith("Z")
                  ? reportData.created_at
                  : reportData.created_at + "Z";
                const date = new Date(utcString);
                return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
              })()}
            </Text>
          )}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: riskColor + "1A" },
            ]}
          >
            <CheckCircle color={riskColor} size={64} />
          </View>
          <Text style={styles.percentageText}>{probability}%</Text>
          <Text style={styles.probabilityLabel}>{t("ml_probability")}</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: riskColor + "1A", marginTop: 10 },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: riskColor, fontSize: 16, textAlign: "center" },
              ]}
            >
              {stage}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              { backgroundColor: "#E0E0E0", marginTop: 10 },
            ]}
          >
            <Text style={[styles.badgeText, { color: "#555" }]}>
              {t("risk_label")}: {t(risk.toLowerCase())}
            </Text>
          </View>
        </View>

        {getSymptomsList().length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <List color={colors.warning} size={20} />
              <Text style={styles.sectionTitle}>{t("detected_symptoms")}</Text>
            </View>
            {getSymptomsList().map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  marginBottom: 10,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: colors.warning,
                    marginRight: isRTL ? 0 : 10,
                    marginLeft: isRTL ? 10 : 0,
                  }}
                />
                <Text
                  style={[styles.sectionText, { flex: 1, marginBottom: 0 }]}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info color={colors.info} size={20} />
            <Text style={styles.sectionTitle}>{t("recommendations")}</Text>
          </View>
          {formatList(recommendation).map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: isRTL ? "row-reverse" : "row",
                marginBottom: 10,
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.primary,
                  marginTop: 8,
                  marginRight: isRTL ? 0 : 10,
                  marginLeft: isRTL ? 10 : 0,
                }}
              />
              <Text style={[styles.sectionText, { flex: 1, marginBottom: 0 }]}>
                {item.replace(/^[-*•]\s*/, "").trim()}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Brain color={colors.primary} size={20} />
            <Text style={styles.sectionTitle}>{t("logic_reasoning")}</Text>
          </View>
          {getReasoningList().length > 0 ? (
            <View style={styles.reasoningContainer}>
              {getReasoningList().map((reason, index) => {
                const isObj = typeof reason === "object" && reason !== null;
                const ruleId = isObj ? reason.id : null;
                const ruleDesc = isObj ? reason.description : null;
                const matched = isObj ? reason.matched : null;
                const results = isObj ? reason.results : null;

                const whyText = matched
                  ? Object.entries(matched)
                      .map(([k, v]) => `${formatKeyLabel(k)} = ${formatValue(v?.actual)}`)
                      .join(" • ")
                  : null;

                const outText = results
                  ? Object.entries(results)
                      .map(([k, v]) => `${formatKeyLabel(k)}: ${formatValue(v)}`)
                      .join(" • ")
                  : null;

                return (
                <View key={index} style={styles.reasoningStep}>
                  <View style={styles.timelineColumn}>
                    <View
                      style={[
                        styles.timelineDot,
                        {
                          backgroundColor: colors.primary,
                          borderColor: colors.primary + "40",
                        },
                      ]}
                    />
                    {index < getReasoningList().length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          { backgroundColor: colors.primary + "30" },
                        ]}
                      />
                    )}
                  </View>
                  <View
                    style={[
                      styles.reasoningCard,
                      {
                        backgroundColor: colors.primary + "0D",
                        borderColor: colors.primary + "26",
                      },
                    ]}
                  >
                    {ruleId ? (
                      <Text style={styles.ruleTitle}>
                        {ruleId}: {ruleDesc || ""}
                      </Text>
                    ) : null}
                    {!isObj ? renderReasoningString(reason) : null}
                    {whyText ? <Text style={styles.ruleMeta}>{t("why_selected") + ": " + whyText}</Text> : null}
                    {outText ? <Text style={styles.ruleMeta}>{t("rule_output") + ": " + outText}</Text> : null}
                  </View>
                </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.sectionText}>{t("no_reasoning")}</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info color={colors.info} size={20} />
            <Text style={styles.sectionTitle}>
              {t("system_comparison")}
            </Text>
          </View>

          <Text style={styles.sectionText}>
            {t("system_comparison_note")}
          </Text>

          <View style={styles.kvGrid}>
            <View style={styles.kvRow}>
              <Text style={styles.kvLabel}>{t("this_report_confidence")}</Text>
              <Text style={styles.kvValue}>{typeof probability === "string" ? `${probability}%` : `${probability}%`}</Text>
            </View>
            {exampleBenchmark && (
              <>
                <View style={styles.kvRow}>
                  <Text style={styles.kvLabel}>
                    {exampleBenchmark.label} (AUC)
                  </Text>
                  <Text style={styles.kvValue}>{formatPct(exampleBenchmark.metrics?.auc)}</Text>
                </View>
                <View style={styles.kvRow}>
                  <Text style={styles.kvLabel}>
                    {exampleBenchmark.label} ({t("sensitivity")})
                  </Text>
                  <Text style={styles.kvValue}>{formatPct(exampleBenchmark.metrics?.sensitivity)}</Text>
                </View>
                <View style={styles.kvRow}>
                  <Text style={styles.kvLabel}>
                    {exampleBenchmark.label} ({t("specificity")})
                  </Text>
                  <Text style={styles.kvValue}>{formatPct(exampleBenchmark.metrics?.specificity)}</Text>
                </View>
              </>
            )}
          </View>

          {!!exampleBenchmark?.citation && (
            <Text style={styles.benchmarkCitation}>{exampleBenchmark.citation}</Text>
          )}
        </View>

        {sections.map((sec) => {
          const rows = sec.items
            .map((k) => ({ k, v: pickSymptomValue(k) }))
            .filter((r) => r.v !== null && r.v !== undefined && r.v !== "");
          if (!rows.length) return null;
          return (
            <View key={sec.key} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Info color={colors.info} size={20} />
                <Text style={styles.sectionTitle}>{t(sec.key) || sec.key}</Text>
              </View>
              <View style={styles.kvGrid}>
                {rows.map((r) => (
                  <View key={r.k} style={styles.kvRow}>
                    <Text style={styles.kvLabel}>{formatKeyLabel(r.k)}</Text>
                    <Text style={styles.kvValue}>{formatValue(r.v)}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={[styles.downloadButton, isDownloading && { opacity: 0.7 }]}
          onPress={handleDownload}
          disabled={isDownloading}
        >
          <FileText
            color={colors.background}
            size={20}
            style={{ marginHorizontal: 8 }}
          />
          <Text style={styles.downloadButtonText}>
            {isDownloading ? t("wait") : t("download_pdf")}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultScreen;
