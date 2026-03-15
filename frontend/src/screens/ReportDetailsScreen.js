import { useState } from 'react';
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
import { useGetReportDetailQuery } from '../services/api';
import { ActivityIndicator } from 'react-native';

const ReportDetailsScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);
  const [isDownloading, setIsDownloading] = useState(false);

  const { reportId } = route.params || {};
  const { data: reportData, isLoading, isError } = useGetReportDetailQuery(reportId);

  const handleDownload = async () => {
    if (!reportData) return;
    setIsDownloading(true);
    try {
      const pdfData = {
        ...reportData,
        date: new Date(reportData.created_at).toLocaleDateString(),
        time: new Date(reportData.created_at).toLocaleTimeString(),
        result: reportData.kbs_recommendation?.risk_classification || 'Unknown',
        status: reportData.kbs_recommendation?.disease_detection || 'Diagnosis',
        score: (reportData.ml_prediction?.probability * 100).toFixed(0),
        recommendations: formatList(reportData.kbs_recommendation?.clinical_recommendations),
        reasoning: reportData.kbs_recommendation?.explainable_reasoning || [],
        symptoms: getSymptomsList()
      };
      await generateAndSharePDF(pdfData);
    } catch (err) {
      console.log('Error downloading PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatList = (text) => {
    if (Array.isArray(text)) return text;
    if (!text) return [];
    if (typeof text === 'string' && text.includes('\n')) {
      return text.split('\n').filter(i => i.trim().length > 0);
    }
    return String(text).split(/\.\s+/).filter(i => i.trim().length > 0).map(i => i.endsWith('.') ? i : i + '.');
  };

  const getSymptomsList = () => {
    if (!reportData?.symptoms) return [];
    return Object.entries(reportData.symptoms)
      .filter(([_, val]) => val === true || val === "true")
      .map(([key, _]) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (isError || !reportData) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Error loading report details.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const diagnosis = reportData.kbs_recommendation || {};
  const stage = diagnosis.disease_detection || 'Diagnosis';
  const risk = diagnosis.risk_classification || 'Unknown';
  const recommendations = diagnosis.clinical_recommendations || '';
  const alertText = diagnosis.alert_system;
  let probability = 0;
  if(reportData.ml_prediction && typeof reportData.ml_prediction.probability === 'number'){
     probability = (reportData.ml_prediction.probability * 100).toFixed(0);
  }

  // Determine colors based on risk
  let riskColor = colors.primary;
  if (risk === 'Moderate') riskColor = colors.warning || '#FFA500';
  if (risk === 'High') riskColor = colors.accent || '#FF6B6B';
  if (risk === 'Critical') riskColor = '#D32F2F';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('report_details') || 'Report Details'}</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleDownload} disabled={isDownloading}>
          <Download color={colors.primary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        
        {alertText && (
          <View style={[styles.section, { borderColor: riskColor, backgroundColor: riskColor + '1A' }]}>
            <View style={styles.sectionHeader}>
              <AlertCircle color={riskColor} size={20} />
              <Text style={[styles.sectionText, { color: riskColor, fontWeight: 'bold' }]}>{alertText}</Text>
            </View>
          </View>
        )}

        <View style={styles.resultCard}>
          <Text style={styles.dateText}>
            {new Date(reportData.created_at).toLocaleDateString()} • {new Date(reportData.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <View style={[styles.iconContainer, { backgroundColor: riskColor + '1A' }]}>
            <CheckCircle color={riskColor} size={64} />
          </View>
          <Text style={styles.percentageText}>{probability}%</Text>
          <Text style={styles.probabilityLabel}>Recorded Probability</Text>
          <View style={[styles.badge, { backgroundColor: riskColor + '1A', marginTop: 10 }]}>
            <Text style={[styles.badgeText, { color: riskColor, fontSize: 16, textAlign: 'center' }]}>{stage}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#E0E0E0', marginTop: 10 }]}>
            <Text style={[styles.badgeText, { color: '#555' }]}>Risk: {risk}</Text>
          </View>
        </View>

        {getSymptomsList().length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <List color={colors.warning} size={20} />
              <Text style={styles.sectionTitle}>Detected Symptoms</Text>
            </View>
            {getSymptomsList().map((item, index) => (
              <View key={index} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', marginBottom: 10, alignItems: 'center' }}>
                 <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.warning, marginRight: isRTL ? 0 : 10, marginLeft: isRTL ? 10 : 0 }} />
                 <Text style={[styles.sectionText, { flex: 1, marginBottom: 0 }]}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info color={colors.info} size={20} />
            <Text style={styles.sectionTitle}>{t('medical_advice') || 'Recommendations'}</Text>
          </View>
           {formatList(recommendations).map((item, index) => (
            <View key={index} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', marginBottom: 10, alignItems: 'flex-start' }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginTop: 8, marginRight: isRTL ? 0 : 10, marginLeft: isRTL ? 10 : 0 }} />
              <Text style={[styles.sectionText, { flex: 1, marginBottom: 0 }]}>{item.replace(/^[-*•]\s*/, '').trim()}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Brain color={colors.primary} size={20} />
            <Text style={styles.sectionTitle}>{t('logic_explanation') || "AI Logic & Reasoning"}</Text>
          </View>
          {diagnosis.explainable_reasoning && diagnosis.explainable_reasoning.length > 0 ? (
            <View style={styles.reasoningContainer}>
              {diagnosis.explainable_reasoning.map((reason, index) => (
                <View key={index} style={styles.reasoningStep}>
                  <View style={styles.timelineColumn}>
                    <View style={[styles.timelineDot, { backgroundColor: colors.primary, borderColor: colors.primary + '40' }]} />
                    {index < diagnosis.explainable_reasoning.length - 1 && (
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
    headerButton: {
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
      marginBottom: 0,
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
