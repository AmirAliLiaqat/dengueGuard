import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, Scale } from 'lucide-react-native';

const TermsAndConditionsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing or using the Dengue KBS application, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use the service.'
    },
    {
      title: '2. Medical Disclaimer',
      content: 'Dengue KBS is an AI-powered diagnostic support tool and NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.'
    },
    {
      title: '3. Use of AI Technology',
      content: 'The application uses knowledge-based systems to analyze symptoms. While we strive for accuracy, results are probabilistic and should be confirmed by a medical professional.'
    },
    {
      title: '4. User Responsibilities',
      content: 'Users are responsible for providing accurate and complete information about their symptoms. Misleading information may lead to incorrect diagnostic suggestions.'
    },
    {
      title: '5. Limitation of Liability',
      content: 'To the maximum extent permitted by law, Dengue KBS shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the service.'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('terms_conditions')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconContainer}>
          <Scale color={colors.primary} size={64} />
        </View>
        <Text style={styles.introText}>
          Last Updated: March 1, 2024
        </Text>
        
        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            If you have any questions about these Terms, please contact support@denguekbs.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme, isRTL) => {
  const { colors, typography, spacing } = theme;
  const textAlign = isRTL ? 'right' : 'left';
  const flexDirection = isRTL ? 'row-reverse' : 'row';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.m,
      paddingTop: spacing.xl,
      paddingBottom: spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    headerTitle: {
      ...typography.h2,
      color: colors.text,
    },
    scrollContent: {
      padding: spacing.l,
    },
    iconContainer: {
      alignItems: 'center',
      marginVertical: spacing.xl,
    },
    introText: {
      ...typography.caption,
      textAlign: 'center',
      marginBottom: spacing.xl,
      color: colors.textMuted,
    },
    section: {
      marginBottom: spacing.l,
      backgroundColor: colors.card,
      padding: spacing.m,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.primary,
      marginBottom: spacing.s,
      textAlign,
    },
    sectionContent: {
      ...typography.body,
      fontSize: 14,
      lineHeight: 22,
      color: colors.textMuted,
      textAlign,
    },
    footer: {
      marginTop: spacing.m,
      paddingBottom: spacing.xl,
    },
    footerText: {
      ...typography.caption,
      textAlign: 'center',
      lineHeight: 20,
      color: colors.textMuted,
    },
  });
};

export default TermsAndConditionsScreen;
