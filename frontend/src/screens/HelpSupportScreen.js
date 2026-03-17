import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, Plus, Minus, Mail, Phone, MessageSquare } from 'lucide-react-native';

const HelpSupportScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);
  const [expandedId, setExpandedId] = useState(null);

  const faqs = [
    {
      id: 1,
      question: t('faq_q1'),
      answer: t('faq_a1')
    },
    {
      id: 2,
      question: t('faq_q2'),
      answer: t('faq_a2')
    },
    {
      id: 3,
      question: t('faq_q3'),
      answer: t('faq_a3')
    },
    {
      id: 4,
      question: t('faq_q4'),
      answer: t('faq_a4')
    }
  ];

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStartChat = () => {
    const phoneNumber = '923090886518';
    const message = 'Hello, I am using the Dengue Diagnose app and I need assistance.';
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
      }
    });
  };

  const contactOptions = [
    { icon: Mail, label: t('email_support'), info: 'support@denguediagnose.com' },
    { icon: Phone, label: t('phone_number'), info: '+92 309 08865818' },
    { icon: MessageSquare, label: t('live_chat'), info: t('available_24_7') },
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
          <TouchableOpacity 
            key={index} 
            style={styles.contactItem}
            onPress={() => {
              if (option.label === t('live_chat')) {
                handleStartChat();
              } else if (option.label === t('email_support')) {
                Linking.openURL(`mailto:${option.info}`);
              } else {
                Linking.openURL(`tel:${option.info.replace(/\s/g, '')}`);
              }
            }}
          >
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
          <Text style={styles.helpCardTitle}>{t('still_need_help')}</Text>
          <Text style={styles.helpCardSub}>{t('medical_experts_available')}</Text>
          <TouchableOpacity style={styles.chatButton} onPress={handleStartChat}>
            <Text style={styles.chatButtonText}>{t('start_chat')}</Text>
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
