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
import { ChevronLeft, ChevronRight, Info, ShieldCheck, Activity } from "lucide-react-native";
import { createStyles } from "../styles/AboutScreen.styles";

const AboutScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

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
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Image
              source={require("../assets/icon.png")}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.appName}>{t("app_name")}</Text>
          <Text style={styles.version}>{t("app_version")}: 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("app_info")}</Text>
          <Text style={styles.description}>{t("app_desc")}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <ShieldCheck color={colors.success} size={24} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{t("medical_grade_accuracy")}</Text>
            <Text style={styles.cardText}>{t("medical_grade_desc")}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Info color={colors.primary} size={24} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{t("kbs_engine")}</Text>
            <Text style={styles.cardText}>{t("kbs_engine_desc")}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2023 Dengue KBS Healthcare Solutions
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;
