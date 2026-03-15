import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, FileText, ExternalLink, Info, Activity, AlertTriangle } from 'lucide-react-native';

const WHOGuidelinesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const sections = [
    {
      title: "Classification of Dengue",
      content: "The WHO classifies Dengue into three categories: Dengue without warning signs, Dengue with warning signs, and Severe Dengue.",
      icon: <Info color="#3B82F6" size={20} />,
      color: "#3B82F6"
    },
    {
      title: "Common Symptoms",
      content: "High fever (40°C/104°F) accompanied by 2 of the following: severe headache, pain behind eyes, muscle and joint pains, nausea, vomiting, swollen glands, or rash.",
      icon: <Activity color="#F59E0B" size={20} />,
      color: "#F59E0B"
    },
    {
      title: "Warning Signs",
      content: "Critical signs include: severe abdominal pain, persistent vomiting, rapid breathing, bleeding gums or nose, fatigue, restlessness, and blood in vomit or stool.",
      icon: <AlertTriangle color="#EF4444" size={20} />,
      color: "#EF4444"
    }
  ];

  const openLink = () => {
    Linking.openURL('https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('who_guidelines')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <FileText color="#FFFFFF" size={48} />
          <Text style={styles.heroTitle}>Official WHO Protocols</Text>
          <Text style={styles.heroSubtitle}>World Health Organization Guidelines for Dengue Management</Text>
        </View>

        {sections.map((section, index) => (
          <View key={index} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: section.color + '1A' }]}>
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
    content: {
      padding: spacing.l,
    },
    heroCard: {
      backgroundColor: colors.primary,
      borderRadius: 24,
      padding: spacing.xl,
      alignItems: 'center',
      marginBottom: spacing.xl,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 15,
      elevation: 10,
    },
    heroTitle: {
      ...typography.h2,
      color: '#FFFFFF',
      marginTop: spacing.m,
      textAlign: 'center',
    },
    heroSubtitle: {
      ...typography.caption,
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      marginTop: 4,
    },
    sectionCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: spacing.l,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    sectionHeader: {
      flexDirection,
      alignItems: 'center',
      marginBottom: spacing.s,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.s : 0,
      marginRight: isRTL ? 0 : spacing.s,
    },
    sectionTitle: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
    },
    sectionContent: {
      ...typography.caption,
      color: colors.textMuted,
      lineHeight: 20,
      textAlign,
    },
    externalLink: {
      marginTop: spacing.m,
      padding: spacing.m,
      borderWidth: 1,
      borderColor: colors.primary + '4D',
      borderRadius: 12,
      backgroundColor: colors.primary + '0D',
    },
    linkContent: {
      flexDirection,
      alignItems: 'center',
      justifyContent: 'center',
    },
    linkText: {
      ...typography.body,
      color: colors.primary,
      fontWeight: 'bold',
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
    },
  });
};

export default WHOGuidelinesScreen;
