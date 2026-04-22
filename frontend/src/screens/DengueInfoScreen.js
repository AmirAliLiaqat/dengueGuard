import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Activity,
  Heart,
  Thermometer,
  Eye,
  Frown,
  Zap,
  Droplets,
  Bug,
  BookOpen,
} from "lucide-react-native";
import { createStyles } from "../styles/DengueInfoScreen.styles";

// ---------------------------------------------------------------------------
// Symptom data extracted from Dengue_Systoms.md knowledge base
// Each entry represents a real patient's dengue presentation.
// ---------------------------------------------------------------------------
const REAL_PATIENT_SYMPTOMS = [
  {
    id: 250,
    text: "Severe joint pain and vomiting. Skin rash covering entire body with intense itching.",
  },
  {
    id: 251,
    text: "Chills and shivering despite warm environment. Constant back pain and red spots on arms.",
  },
  {
    id: 252,
    text: "Severe joint pain making daily activities difficult. Lost appetite causing weakness.",
  },
  {
    id: 253,
    text: "Frequent vomiting and appetite loss. Constant joint and back pain.",
  },
  {
    id: 254,
    text: "High fever with severe headache and body pain. Chills every night. Pain behind the eyes.",
  },
  {
    id: 255,
    text: "Extreme tiredness and fatigue with no energy. Rashes on the neck with itching.",
  },
  {
    id: 256,
    text: "Severe headache with pain behind the eyes. Appetite loss and chills every night.",
  },
  {
    id: 257,
    text: "Nausea with constant urge to vomit. Pain behind eyes and red spots on arms.",
  },
  {
    id: 258,
    text: "Red spots on body that are itchy and inflamed. High fever with chills and shivering.",
  },
  {
    id: 259,
    text: "Muscle pain making movement difficult. Appetite loss, vomiting. Legs and back pain.",
  },
  {
    id: 260,
    text: "Back pain worse when sitting or standing. Rashes all over body. Pain behind eyes.",
  },
  {
    id: 261,
    text: "Skin rash with redness and swelling. Severe fever with body pain.",
  },
  {
    id: 262,
    text: "Chills with coldness and high fever. Rashes on arms and red spots on neck.",
  },
  {
    id: 263,
    text: "Severe joint ache like a constant pain. Headache with mild fever and chills.",
  },
  {
    id: 264,
    text: "Vomiting with stomach cramps and dizziness. Appetite loss and weakness. Pain behind eyes.",
  },
  {
    id: 265,
    text: "High fever with sweating and weakness. Muscle pain preventing daily work.",
  },
  {
    id: 266,
    text: "Extreme fatigue making basic tasks difficult. Vomiting and rashes on arms, neck and legs.",
  },
  {
    id: 267,
    text: "Severe headache with pressure in head. Mild fever and red spots on back.",
  },
  {
    id: 268,
    text: "Nausea with appetite loss and unease. Back and muscle pain.",
  },
  {
    id: 269,
    text: "Severe muscle pain like a constant ache. Red spots all over body with itching.",
  },
  {
    id: 270,
    text: "Skin rash covering entire body with itching. Body pain, mild fever, headache and chills.",
  },
  {
    id: 271,
    text: "Extreme body pain, headache and vomiting. Red spots covering entire body with itching.",
  },
  {
    id: 272,
    text: "Constant back pain with rashes on arms and neck. Eye pain behind eyes. Fever causing worry.",
  },
  {
    id: 273,
    text: "Significant joint pain making it difficult to walk. Appetite loss causing weakness and vomiting.",
  },
  {
    id: 274,
    text: "Constant pain behind eyes. Red spots on neck and face. Arms and legs ache. Itchy spots.",
  },
  {
    id: 275,
    text: "Feeling sick with a strong need to vomit. Sharp ache behind eyes and red dots on back.",
  },
  {
    id: 276,
    text: "Shivers and shivering with coldness and very high fever. Rashes on arms and red patches on neck.",
  },
  {
    id: 277,
    text: "Severe joint ache with constant vomiting. Developing moderate fever with chills.",
  },
  {
    id: 278,
    text: "Vomiting with stomach pains and dizziness. Appetite loss. Arms, back, neck pain most of the time.",
  },
  {
    id: 279,
    text: "Red spots on arms and legs that are itchy and inflamed. Nausea with vomiting. Mild fever.",
  },
  {
    id: 280,
    text: "Skin rash covering entire body. Red and swollen rash worse on arms and legs. Appetite loss.",
  },
  {
    id: 281,
    text: "Chills and shivering. Strong backpain and pain behind eyes. Red spots on back and neck.",
  },
  {
    id: 282,
    text: "Severe joint pain making the day difficult. Vomiting and mild headache.",
  },
  {
    id: 283,
    text: "Frequent vomiting and appetite loss. Skin rashes and eye pain causing sleep problems.",
  },
  {
    id: 284,
    text: "High fever with severe headache. Extreme body pain and chills causing health worry.",
  },
  {
    id: 285,
    text: "Extreme tiredness and fatigue. Struggling to get out of bed. Red spots on arms and legs.",
  },
  {
    id: 286,
    text: "Severe headache with eye pain. Tiredness and fatigue preventing daily work.",
  },
  {
    id: 287,
    text: "Nausea with constant urge to vomit. Mild fever and headache.",
  },
  {
    id: 288,
    text: "Rashes on body that are itchy. Appetite loss and feeling tired all day.",
  },
  {
    id: 289,
    text: "Muscle pain and headache. Constant ache worse when using affected muscles. Red spots on face, neck and arms.",
  },
  {
    id: 290,
    text: "Back pain with rashes on arms and armpits. Eye pain behind eyeballs. Mild fever.",
  },
  {
    id: 291,
    text: "Very high fever and chills every night. No appetite. Back, arms, legs pain. Strange eye pain. Can't do physical activities.",
  },
  {
    id: 292,
    text: "Regular vomiting causing appetite loss. Constant muscle, joint and back pain. Starting to have fever.",
  },
  {
    id: 293,
    text: "Severe fever with pain behind eyes and headache. Tired and exhausted, unable to work.",
  },
  {
    id: 294,
    text: "Whole body pain with no appetite. Mild fever and chills at night. Red spots on back and neck.",
  },
  {
    id: 295,
    text: "Daily joint and back pain. Vomiting causing weakness. Unable to focus on work.",
  },
  {
    id: 296,
    text: "Extreme body pain. Appetite loss with rashes on arms and face. Eye pain behind eyes.",
  },
  {
    id: 297,
    text: "Body rashes with high fever, chills and headache. Joints and back hurt. Eye pain.",
  },
  {
    id: 298,
    text: "Nausea with constant urge to vomit. High fever and chills every night. Appetite loss.",
  },
  {
    id: 299,
    text: "Itchy skin rashes. Joint pain all day. Mild fever and chills at night preventing sleep.",
  },
];

// ---------------------------------------------------------------------------
// Dengue symptom categories (clinical classification)
// ---------------------------------------------------------------------------
const SYMPTOM_CATEGORIES = [
  {
    title: "Fever & Temperature",
    icon: Thermometer,
    color: "#E74C3C",
    symptoms: [
      { name: "High Fever (40°C / 104°F)", frequency: "Very Common", severity: "Primary Indicator" },
      { name: "Mild to Moderate Fever", frequency: "Common", severity: "Early Sign" },
      { name: "Chills & Shivering", frequency: "Common (32%)", severity: "Moderate" },
      { name: "Night Sweats", frequency: "Occasional", severity: "Mild" },
    ],
  },
  {
    title: "Pain Symptoms",
    icon: Zap,
    color: "#E67E22",
    symptoms: [
      { name: "Severe Headache", frequency: "Common (26%)", severity: "Moderate" },
      { name: "Pain Behind the Eyes (Retro-orbital)", frequency: "Common (28%)", severity: "Dengue-Specific" },
      { name: "Joint Pain (Arthralgia)", frequency: "Common (14%)", severity: "Moderate" },
      { name: "Muscle Pain (Myalgia)", frequency: "Common (30%)", severity: "Moderate" },
      { name: "Back Pain", frequency: "Common (30%)", severity: "Moderate" },
      { name: "Body Pain (Generalized)", frequency: "Common (30%)", severity: "Moderate" },
    ],
  },
  {
    title: "Skin Manifestations",
    icon: Droplets,
    color: "#9B59B6",
    symptoms: [
      { name: "Skin Rash (Maculopapular)", frequency: "Very Common (56%)", severity: "Characteristic" },
      { name: "Red Spots (Petechiae)", frequency: "Common (28%)", severity: "Warning Sign" },
      { name: "Itching / Pruritus", frequency: "Occasional (16%)", severity: "Mild" },
      { name: "Redness & Swelling", frequency: "Occasional", severity: "Moderate" },
    ],
  },
  {
    title: "Gastrointestinal",
    icon: Frown,
    color: "#2ECC71",
    symptoms: [
      { name: "Nausea & Vomiting", frequency: "Common (38%)", severity: "Moderate" },
      { name: "Appetite Loss / Anorexia", frequency: "Common (28%)", severity: "Moderate" },
      { name: "Abdominal / Stomach Pain", frequency: "Occasional", severity: "Warning Sign" },
      { name: "Dizziness", frequency: "Occasional", severity: "Moderate" },
    ],
  },
  {
    title: "General / Constitutional",
    icon: Activity,
    color: "#3498DB",
    symptoms: [
      { name: "Fatigue & Exhaustion", frequency: "Common (24%)", severity: "Moderate" },
      { name: "Weakness / Lethargy", frequency: "Common", severity: "Moderate" },
      { name: "Inability to Perform Daily Tasks", frequency: "Common", severity: "Moderate" },
      { name: "Sleep Disturbance", frequency: "Occasional", severity: "Mild" },
    ],
  },
  {
    title: "Severe / Emergency Signs",
    icon: AlertTriangle,
    color: "#C0392B",
    symptoms: [
      { name: "Severe Bleeding (Gums, Nose, Internal)", frequency: "Rare", severity: "Critical" },
      { name: "Persistent Vomiting (>3 times/day)", frequency: "Uncommon", severity: "Warning Sign" },
      { name: "Severe Abdominal Pain", frequency: "Uncommon", severity: "Warning Sign" },
      { name: "Rapid Breathing / Respiratory Distress", frequency: "Rare", severity: "Critical" },
      { name: "Impaired Consciousness", frequency: "Rare", severity: "Critical" },
      { name: "Shock (DSS)", frequency: "Rare", severity: "Life-Threatening" },
    ],
  },
];

const DengueInfoScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showMorePatients, setShowMorePatients] = useState(false);

  const toggleCategory = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
      case "Life-Threatening":
        return "#D32F2F";
      case "Warning Sign":
        return "#E67E22";
      case "Primary Indicator":
      case "Dengue-Specific":
      case "Characteristic":
        return "#E74C3C";
      case "Moderate":
        return colors.warning || "#FFA500";
      default:
        return colors.primary;
    }
  };

  const infoSections = [
    {
      title: "What is Dengue?",
      icon: Info,
      color: "#3498DB",
      content:
        "Dengue is a viral infection transmitted to humans through the bite of infected mosquitoes. It is found in tropical and sub-tropical climates worldwide, mostly in urban and semi-urban areas.",
    },
    {
      title: "Why does it occur?",
      icon: Activity,
      color: "#E67E22",
      content:
        "Dengue is caused by one of four dengue viruses (DENV-1, DENV-2, DENV-3, and DENV-4). When a mosquito bites an infected person, the virus enters the mosquito. When the infected mosquito then bites another person, the virus enters that person's bloodstream and causes an infection.",
    },
    {
      title: "Where does it spread?",
      icon: MapPin,
      color: "#2ECC71",
      content:
        "The primary vectors that transmit the disease are Aedes aegypti mosquitoes and, to a lesser extent, Ae. albopictus. These mosquitoes typically breed in stagnant water found in containers, old tires, and flower pots near human habitations.",
    },
  ];

  const displayedPatients = showMorePatients
    ? REAL_PATIENT_SYMPTOMS
    : REAL_PATIENT_SYMPTOMS.slice(0, 8);

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
        <Text style={styles.headerTitle}>Dengue Encyclopedia</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <Activity color={colors.primary} size={48} />
          </View>
          <Text style={styles.heroTitle}>Everything About Dengue</Text>
          <Text style={styles.heroSubtitle}>Learn. Prevent. Protect.</Text>
        </View>

        {/* General Info Sections */}
        {infoSections.map((section, index) => (
          <View key={index} style={styles.sectionCard}>
            <View
              style={[styles.sectionHeader, { borderLeftColor: section.color }]}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: section.color + "20" },
                ]}
              >
                <section.icon color={section.color} size={20} />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.sectionBody}>
              <Text style={styles.sectionText}>{section.content}</Text>
            </View>
          </View>
        ))}

        {/* ============================================================ */}
        {/*  SYMPTOM CATEGORIES — from Dengue_Systoms.md knowledge base  */}
        {/* ============================================================ */}
        <View style={styles.sectionCard}>
          <View
            style={[styles.sectionHeader, { borderLeftColor: "#E74C3C" }]}
          >
            <View
              style={[styles.iconBox, { backgroundColor: "#E74C3C20" }]}
            >
              <AlertTriangle color="#E74C3C" size={20} />
            </View>
            <Text style={styles.sectionTitle}>
              Dengue Symptoms — Clinical Database
            </Text>
          </View>
          <View style={styles.sectionBody}>
            <Text style={styles.sectionText}>
              Symptoms categorized from 50 documented dengue patient cases and
              WHO clinical guidelines. Frequency percentages are based on our
              knowledge base analysis.
            </Text>
          </View>
        </View>

        {SYMPTOM_CATEGORIES.map((category, catIndex) => (
          <View key={catIndex} style={styles.sectionCard}>
            <TouchableOpacity
              style={[
                styles.sectionHeader,
                { borderLeftColor: category.color },
              ]}
              onPress={() => toggleCategory(catIndex)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: category.color + "20" },
                ]}
              >
                <category.icon color={category.color} size={20} />
              </View>
              <Text style={[styles.sectionTitle, { flex: 1 }]}>
                {category.title}
              </Text>
              {expandedCategory === catIndex ? (
                <ChevronUp color={colors.textMuted} size={20} />
              ) : (
                <ChevronDown color={colors.textMuted} size={20} />
              )}
            </TouchableOpacity>

            {expandedCategory === catIndex && (
              <View style={styles.sectionBody}>
                {category.symptoms.map((symptom, sIndex) => (
                  <View
                    key={sIndex}
                    style={{
                      flexDirection: isRTL ? "row-reverse" : "row",
                      alignItems: "flex-start",
                      paddingVertical: 10,
                      borderBottomWidth:
                        sIndex < category.symptoms.length - 1 ? 1 : 0,
                      borderBottomColor: colors.glassBorder,
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: category.color,
                        marginTop: 6,
                        marginRight: isRTL ? 0 : 12,
                        marginLeft: isRTL ? 12 : 0,
                      }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          ...typography.body,
                          color: colors.text,
                          fontWeight: "600",
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {symptom.name}
                      </Text>
                      <View
                        style={{
                          flexDirection: isRTL ? "row-reverse" : "row",
                          marginTop: 4,
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: category.color + "18",
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 6,
                          }}
                        >
                          <Text
                            style={{
                              ...typography.caption,
                              color: category.color,
                              fontWeight: "700",
                              fontSize: 11,
                            }}
                          >
                            {symptom.frequency}
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor:
                              getSeverityColor(symptom.severity) + "18",
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 6,
                          }}
                        >
                          <Text
                            style={{
                              ...typography.caption,
                              color: getSeverityColor(symptom.severity),
                              fontWeight: "700",
                              fontSize: 11,
                            }}
                          >
                            {symptom.severity}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* ============================================================ */}
        {/*  REAL PATIENT CASES — from Dengue_Systoms.md                 */}
        {/* ============================================================ */}
        <View style={styles.sectionCard}>
          <View
            style={[styles.sectionHeader, { borderLeftColor: "#9B59B6" }]}
          >
            <View
              style={[styles.iconBox, { backgroundColor: "#9B59B620" }]}
            >
              <BookOpen color="#9B59B6" size={20} />
            </View>
            <Text style={styles.sectionTitle}>
              Real Patient Symptom Reports
            </Text>
          </View>
          <View style={styles.sectionBody}>
            <Text
              style={[styles.sectionText, { marginBottom: 16 }]}
            >
              The following are real symptom descriptions from {REAL_PATIENT_SYMPTOMS.length}{" "}
              documented dengue patients, used to train our AI model's symptom
              knowledge base.
            </Text>

            {displayedPatients.map((patient, index) => (
              <View
                key={patient.id}
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "flex-start",
                  paddingVertical: 12,
                  borderBottomWidth:
                    index < displayedPatients.length - 1 ? 1 : 0,
                  borderBottomColor: colors.glassBorder,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: colors.primary + "15",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: isRTL ? 0 : 12,
                    marginLeft: isRTL ? 12 : 0,
                  }}
                >
                  <Text
                    style={{
                      ...typography.caption,
                      color: colors.primary,
                      fontWeight: "bold",
                      fontSize: 11,
                    }}
                  >
                    #{patient.id}
                  </Text>
                </View>
                <Text
                  style={{
                    ...typography.body,
                    color: colors.textMuted,
                    flex: 1,
                    lineHeight: 22,
                    fontSize: 13,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {patient.text}
                </Text>
              </View>
            ))}

            <TouchableOpacity
              style={{
                marginTop: 16,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: colors.primary + "12",
                alignItems: "center",
                flexDirection: isRTL ? "row-reverse" : "row",
                justifyContent: "center",
                gap: 8,
              }}
              onPress={() => setShowMorePatients(!showMorePatients)}
            >
              <Text
                style={{
                  ...typography.body,
                  color: colors.primary,
                  fontWeight: "700",
                }}
              >
                {showMorePatients
                  ? "Show Less"
                  : `Show All ${REAL_PATIENT_SYMPTOMS.length} Cases`}
              </Text>
              {showMorePatients ? (
                <ChevronUp color={colors.primary} size={18} />
              ) : (
                <ChevronDown color={colors.primary} size={18} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Prevention & Treatment (original sections) */}
        <View style={styles.sectionCard}>
          <View
            style={[styles.sectionHeader, { borderLeftColor: "#16A085" }]}
          >
            <View
              style={[styles.iconBox, { backgroundColor: "#16A08520" }]}
            >
              <ShieldCheck color="#16A085" size={20} />
            </View>
            <Text style={styles.sectionTitle}>Prevention & Control</Text>
          </View>
          <View style={styles.sectionBody}>
            <Text style={styles.sectionText}>
              Preventing mosquito bites and controlling the mosquito population
              are the best ways to prevent dengue:{"\n\n"}
              {"\u2022"} Use mosquito repellents{"\n"}
              {"\u2022"} Wear long-sleeved clothes{"\n"}
              {"\u2022"} Use mosquito nets at night{"\n"}
              {"\u2022"} Empty and clean water containers weekly{"\n"}
              {"\u2022"} Install window screens
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View
            style={[styles.sectionHeader, { borderLeftColor: "#9B59B6" }]}
          >
            <View
              style={[styles.iconBox, { backgroundColor: "#9B59B620" }]}
            >
              <Heart color="#9B59B6" size={20} />
            </View>
            <Text style={styles.sectionTitle}>Treatment Advice</Text>
          </View>
          <View style={styles.sectionBody}>
            <Text style={styles.sectionText}>
              There is no specific treatment for dengue. Recovery depends on:
              {"\n\n"}
              {"\u2022"} Plenty of bed rest{"\n"}
              {"\u2022"} Drinking lots of fluids (oral rehydration){"\n"}
              {"\u2022"} Taking Paracetamol to control fever and pain{"\n"}
              {"\u2022"} AVOIDING Ibuprofen and Aspirin (they increase bleeding
              risk)
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Source: WHO Guidelines 2024 & Dengue_Systoms.md Knowledge Base (50
            Cases)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DengueInfoScreen;
