import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle, Info, FileText, Brain, ChevronLeft } from 'lucide-react-native';

const ResultScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const styles = createStyles(theme, isRTL);

  const dummyResult = {
    stage: 'Mild Dengue',
    probability: 68,
    explanation: 'Based on your fever duration (4 days) and presence of muscle pain, the system detects early stage symptoms.',
    recommendation: 'Rest, increase fluid intake (ORC/Water), and monitor platelet count daily. Consult a doctor if vomiting persists.',
    severity: 'Medium'
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Main')}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('diagnosis_result')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.resultCard}>
          <View style={styles.iconContainer}>
            <CheckCircle color={colors.primary} size={64} />
          </View>
          <Text style={styles.percentageText}>{dummyResult.probability}%</Text>
          <Text style={styles.probabilityLabel}>{t('probability')}</Text>
          <View style={[styles.badge, { backgroundColor: colors.primary + '1A' }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>{dummyResult.stage}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Brain color={colors.accent} size={20} />
            <Text style={styles.sectionTitle}>{t('logic_explanation')}</Text>
          </View>
          <Text style={styles.sectionText}>{dummyResult.explanation}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info color={colors.info} size={20} />
            <Text style={styles.sectionTitle}>{t('medical_advice')}</Text>
          </View>
          <Text style={styles.sectionText}>{dummyResult.recommendation}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.downloadButton, isDownloading && { opacity: 0.7 }]} 
          onPress={handleDownload}
          disabled={isDownloading}
        >
          <FileText color={colors.background} size={20} style={{ marginHorizontal: 8 }} />
          <Text style={styles.downloadButtonText}>
            {isDownloading ? t('generating_pdf') : t('download_pdf')}
          </Text>
        </TouchableOpacity>
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
    resultCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: spacing.xl,
      alignItems: 'center',
      marginBottom: spacing.l,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary + '1A',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.m,
    },
    percentageText: {
      ...typography.h1,
      color: colors.text,
      fontSize: 48,
    },
    probabilityLabel: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.m,
    },
    badge: {
      paddingHorizontal: spacing.l,
      paddingVertical: spacing.s,
      borderRadius: 20,
    },
    badgeText: {
      fontWeight: 'bold',
      fontSize: 14,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: spacing.l,
      marginBottom: spacing.l,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    sectionHeader: {
      flexDirection,
      alignItems: 'center',
      marginBottom: spacing.s,
    },
    sectionTitle: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      marginLeft: isRTL ? 0 : spacing.s,
      marginRight: isRTL ? spacing.s : 0,
    },
    sectionText: {
      ...typography.body,
      color: colors.textMuted,
      lineHeight: 22,
      textAlign,
    },
    downloadButton: {
      backgroundColor: colors.primary,
      flexDirection,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.xl * 2,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    downloadButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
};

export default ResultScreen;
