import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, Plus, Minus, Mail, Phone, MessageSquare } from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HelpSupportScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);
  const [expandedId, setExpandedId] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How does the AI diagnosis work?",
      answer: "Our AI analyzes the symptoms you input and cross-references them with global dengue trends and medical knowledge database."
    },
    {
      id: 2,
      question: "Is this a substitute for a real doctor?",
      answer: "No. This tool is for screening and early detection only. You must consult a qualified medical professional for diagnosis and treatment."
    },
    {
      id: 3,
      question: "How accurate is the result?",
      answer: "The probability score is based on clinical data models but should be used as a guideline. A score above 70% suggests immediate consultation."
    },
    {
      id: 4,
      question: "What is KBS?",
      answer: "KBS stands for Knowledge-Based System. It's a method where expert medical rules are programmed into the app to explain 'why' the AI gave a certain result."
    }
  ];

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const contactOptions = [
    { icon: Mail, label: 'Email Support', info: 'support@denguekbs.com' },
    { icon: Phone, label: t('phone_number'), info: '+92 300 1234567' },
    { icon: MessageSquare, label: 'Live Chat', info: 'Available 24/7' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('help_faq')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>{t('support')}</Text>
        <View style={styles.faqList}>
          {faqs.map((faq) => (
            <TouchableOpacity key={faq.id} style={styles.faqItem} onPress={() => toggleExpand(faq.id)}>
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                {expandedId === faq.id ? (
                  <Minus color={colors.primary} size={20} />
                ) : (
                  <Plus color={colors.textMuted} size={20} />
                )}
              </View>
              {expandedId === faq.id && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: spacing.s }]}>{t('contact_us')}</Text>
        {contactOptions.map((option, index) => (
          <TouchableOpacity key={index} style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <option.icon color={colors.primary} size={20} />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>{option.label}</Text>
              <Text style={styles.contactInfo}>{option.info}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.helpCard}>
          <Text style={styles.helpCardTitle}>Still need help?</Text>
          <Text style={styles.helpCardSub}>Our medical experts are available for live consultation.</Text>
          <TouchableOpacity style={styles.chatButton}>
            <Text style={styles.chatButtonText}>Start Chat</Text>
          </TouchableOpacity>
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
    sectionTitle: {
      ...typography.h3,
      color: colors.text,
      marginBottom: spacing.m,
      textAlign,
    },
    faqList: {
      marginBottom: spacing.l,
    },
    faqItem: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.m,
      marginBottom: spacing.s,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    faqHeader: {
      flexDirection,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    faqQuestion: {
      flex: 1,
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
      marginRight: isRTL ? 0 : 10,
      marginLeft: isRTL ? 10 : 0,
    },
    faqAnswer: {
      ...typography.body,
      color: colors.textMuted,
      marginTop: spacing.m,
      lineHeight: 22,
      textAlign,
    },
    contactItem: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: spacing.m,
      borderRadius: 16,
      marginBottom: spacing.s,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    contactIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    contactContent: {
      flex: 1,
    },
    contactLabel: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign,
    },
    contactInfo: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
    },
    helpCard: {
      backgroundColor: colors.primary + '1A',
      borderRadius: 24,
      padding: spacing.xl,
      marginVertical: spacing.xl,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.primary + '33',
    },
    helpCardTitle: {
      ...typography.h3,
      color: colors.primary,
      marginBottom: 4,
    },
    helpCardSub: {
      ...typography.caption,
      color: colors.text,
      textAlign: 'center',
      marginBottom: spacing.m,
    },
    chatButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.m,
      borderRadius: 12,
    },
    chatButtonText: {
      color: colors.background,
      fontWeight: 'bold',
    },
  });
};

export default HelpSupportScreen;
