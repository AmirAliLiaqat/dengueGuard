import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  ChevronLeft,
  ChevronRight,
  File,
  ExternalLink,
  Info,
  Activity,
  AlertTriangle,
} from "lucide-react-native";
import { createStyles } from "../styles/WHOGuidelinesScreen.styles";

const WHOGuidelinesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const sections = [
    {
      title: "Classification of Dengue",
      content:
        "The WHO classifies Dengue into three categories: Dengue without warning signs, Dengue with warning signs, and Severe Dengue.",
      icon: <Info color="#3B82F6" size={20} />,
      color: "#3B82F6",
    },
    {
      title: "Common Symptoms",
      content:
        "High fever (40°C/104°F) accompanied by 2 of the following: severe headache, pain behind eyes, muscle and joint pains, nausea, vomiting, swollen glands, or rash.",
      icon: <Activity color="#F59E0B" size={20} />,
      color: "#F59E0B",
    },
    {
      title: "Warning Signs",
      content:
        "Critical signs include: severe abdominal pain, persistent vomiting, rapid breathing, bleeding gums or nose, fatigue, restlessness, and blood in vomit or stool.",
      icon: <AlertTriangle color="#EF4444" size={20} />,
      color: "#EF4444",
    },
  ];

  const openLink = () => {
    Linking.openURL(
      "https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue",
    );
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
        <Text style={styles.headerTitle}>{t("who_guidelines")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <File color="#FFFFFF" size={48} />
          <Text style={styles.heroTitle}>Official WHO Protocols</Text>
          <Text style={styles.heroSubtitle}>
            World Health Organization Guidelines for Dengue Management
          </Text>
        </View>

        {sections.map((section, index) => (
          <View key={index} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: section.color + "1A" },
                ]}
              >
                {section.icon}
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.externalLink} onPress={openLink}>
          <View style={styles.linkContent}>
            <Text style={styles.linkText}>View Full WHO Fact Sheet</Text>
            <ExternalLink color={colors.primary} size={18} />
          </View>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default WHOGuidelinesScreen;
