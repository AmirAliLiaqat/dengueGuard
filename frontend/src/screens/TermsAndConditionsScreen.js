import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { ChevronLeft, ChevronRight, Scale } from "lucide-react-native";
import { createStyles } from "../styles/TermsAndConditionsScreen.styles";

const TermsAndConditionsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using the Dengue KBS application, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use the service.",
    },
    {
      title: "2. Medical Disclaimer",
      content:
        "Dengue KBS is an AI-powered diagnostic support tool and NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.",
    },
    {
      title: "3. Use of AI Technology",
      content:
        "The application uses knowledge-based systems to analyze symptoms. While we strive for accuracy, results are probabilistic and should be confirmed by a medical professional.",
    },
    {
      title: "4. User Responsibilities",
      content:
        "Users are responsible for providing accurate and complete information about their symptoms. Misleading information may lead to incorrect diagnostic suggestions.",
    },
    {
      title: "5. Limitation of Liability",
      content:
        "To the maximum extent permitted by law, Dengue KBS shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the service.",
    },
  ];

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
        <Text style={styles.headerTitle}>{t("terms_conditions")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconContainer}>
          <Scale color={colors.primary} size={64} />
        </View>
        <Text style={styles.introText}>Last Updated: March 1, 2024</Text>

        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            If you have any questions about these Terms, please contact
            support@denguekbs.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditionsScreen;
