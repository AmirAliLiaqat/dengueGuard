import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, Download, CheckCircle, Info, AlertCircle, List, Brain, FileText } from 'lucide-react-native';
import { generateAndSharePDF } from '../utils/pdfGenerator';

const ReportDetailsScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);
  const [isDownloading, setIsDownloading] = useState(false);

  const { reportId } = route.params || { reportId: '1' };

  // Extended mock data to match ML Result data schema
  const report = {
    id: reportId,
    date: 'Oct 24, 2023',
    time: '10:30 AM',
    result: 'High Risk',
    status: 'Severe Dengue',
    score: 85,
    alertText: 'Critical phase detected based on dropping platelet counts.',
    symptoms: [
      'High Fever (102°F)',
      'Severe Headache',
      'Joint & Muscle Pain',
      'Nausea',
      'Fatigue'
    ],
    recommendations: [
      'Immediate hospital admission is recommended.',
      'Begin intravenous fluid replacement therapy quickly.',
      'Constantly monitor hematocrit and platelet counts.',
      'Do not administer ibuprofen or aspirin.'
    ],
    reasoning: [
      'Patient exhibits > 3 days of high fever and severe muscle pain mapping to Dengue symptoms.',
      'Warning phase indicated by rapid onset of fatigue and nausea.',
      'Drop in platelet count triggered Severe Dengue classification rule.'
    ]
  };

  // Determine colors based on risk/score
  let riskColor = colors.primary;
  if (report.score > 40) riskColor = colors.warning || '#FFA500';
  if (report.score > 75) riskColor = colors.accent || '#FF6B6B';
  if (report.result === 'Critical') riskColor = '#D32F2F';

  const formatList = (textArray) => {
    if (!textArray) return [];
    return textArray;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generateAndSharePDF(report);
    } catch (err) {
      console.log('Error downloading PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('report_details') || 'Report Details'}</Text>
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload} disabled={isDownloading}>
          <Download color={colors.primary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        
        {report.alertText && (
          <View style={[styles.section, { borderColor: riskColor, backgroundColor: riskColor + '1A', paddingBottom: spacing.m }]}>
            <View style={styles.sectionHeader}>
              <AlertCircle color={riskColor} size={20} />
              <Text style={[styles.sectionText, { color: riskColor, fontWeight: 'bold' }]}>{report.alertText}</Text>
            </View>
          </View>
        )}

        <View style={styles.resultCard}>
          <Text style={styles.dateText}>{report.date} • {report.time}</Text>
          <View style={[styles.iconContainer, { backgroundColor: riskColor + '1A', marginTop: spacing.s }]}>
            <CheckCircle color={riskColor} size={64} />
          </View>
          <Text style={styles.percentageText}>{report.score}%</Text>
          <Text style={styles.probabilityLabel}>Recorded Probability</Text>
          <View style={[styles.badge, { backgroundColor: riskColor + '1A', marginTop: 10 }]}>
            <Text style={[styles.badgeText, { color: riskColor, fontSize: 16, textAlign: 'center' }]}>{report.status}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#E0E0E0', marginTop: 10 }]}>
            <Text style={[styles.badgeText, { color: '#555' }]}>Risk: {report.result}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <List color={colors.warning} size={20} />
            <Text style={styles.sectionTitle}>Detected Symptoms</Text>
          </View>
          {formatList(report.symptoms).map((item, index) => (
            <View key={index} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', marginBottom: 10, alignItems: 'center' }}>
               <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.warning, marginRight: isRTL ? 0 : 10, marginLeft: isRTL ? 10 : 0 }} />
               <Text style={[styles.sectionText, { flex: 1, marginBottom: 0 }]}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info color={colors.info} size={20} />
            <Text style={styles.sectionTitle}>{t('medical_advice') || 'Recommendations'}</Text>
          </View>
           {formatList(report.recommendations).map((item, index) => (
            <View key={index} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', marginBottom: 10, alignItems: 'flex-start' }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginTop: 8, marginRight: isRTL ? 0 : 10, marginLeft: isRTL ? 10 : 0 }} />
              <Text style={[styles.sectionText, { flex: 1, marginBottom: 0 }]}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Brain color={colors.primary} size={20} />
            <Text style={styles.sectionTitle}>{t('logic_explanation') || "AI Logic & Reasoning"}</Text>
          </View>
          {report.reasoning && report.reasoning.length > 0 ? (
            <View style={styles.reasoningContainer}>
              {report.reasoning.map((reason, index) => (
                <View key={index} style={styles.reasoningStep}>
                  <View style={styles.timelineColumn}>
                    <View style={[styles.timelineDot, { backgroundColor: colors.primary, borderColor: colors.primary + '40' }]} />
                    {index < report.reasoning.length - 1 && (
                      <View style={[styles.timelineLine, { backgroundColor: colors.primary + '30' }]} />
                    )}
                  </View>
                  <View style={[styles.reasoningCard, { backgroundColor: colors.primary + '0D', borderColor: colors.primary + '26' }]}>
                    <Text style={styles.reasoningText}>{reason}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.sectionText}>No historical reasoning details saved.</Text>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.downloadButton, isDownloading && { opacity: 0.7 }]} 
          onPress={handleDownload}
          disabled={isDownloading}
        >
          <FileText color={colors.background} size={20} style={{ marginHorizontal: 8 }} />
          <Text style={styles.downloadButtonText}>
            {isDownloading ? (t('generating_pdf') || 'Wait...') : (t('download_pdf') || 'Download Report')}
          </Text>
        </TouchableOpacity>
        
        <View style={{height: 20}} />
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
    dateText: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.xs,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
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
      marginRight: 10,
      marginLeft: 10,
    },
    downloadButton: {
      backgroundColor: colors.primary,
      flexDirection,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.xl,
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
    reasoningContainer: {
      marginTop: spacing.s,
    },
    reasoningStep: {
      flexDirection,
      marginBottom: 0, 
    },
    timelineColumn: {
      alignItems: 'center',
      width: 24,
      marginRight: isRTL ? 0 : spacing.m,
      marginLeft: isRTL ? spacing.m : 0,
    },
    timelineDot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      marginTop: spacing.m + 2,
      borderWidth: 3,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 2,
    },
    timelineLine: {
      width: 2,
      flex: 1,
      minHeight: 20,
      marginTop: 4,
      marginBottom: -16,
    },
    reasoningCard: {
      flex: 1,
      padding: spacing.m,
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: spacing.m,
    },
    reasoningText: {
      ...typography.body,
      color: colors.text,
      fontSize: 13,
      lineHeight: 20,
      textAlign,
    },
  });
};

export default ReportDetailsScreen;
