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
import { ChevronLeft, Download, CheckCircle2 } from 'lucide-react-native';

const ReportDetailsScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const { reportId } = route.params || { reportId: '1' };

  const report = {
    id: reportId,
    date: 'Oct 24, 2023',
    time: '10:30 AM',
    result: 'High Risk',
    status: 'Confirmed',
    score: 85,
    symptoms: [
      'High Fever (102°F)',
      'Severe Headache',
      'Joint & Muscle Pain',
      'Nausea',
      'Fatigue'
    ],
    recommendations: [
      'Continue monitoring temperature',
      'Stay hydrated with electrolyte solutions',
      'Avoid ibuprofen and aspirin',
      'Rest as much as possible',
      'Seek emergency care if bleeding occurs'
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('report_details') || 'Report Details'}</Text>
        <TouchableOpacity style={styles.downloadButton}>
          <Download color={colors.primary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusCard}>
          <View style={styles.iconCircle}>
            <CheckCircle2 color={colors.error} size={64} />
          </View>
          <Text style={styles.statusTitle}>{report.result}</Text>
          <Text style={styles.dateText}>{report.date} • {report.time}</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>Severity Score: {report.score}%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detected Symptoms</Text>
          <View style={styles.symptomList}>
            {report.symptoms.map((symptom, index) => (
              <View key={index} style={styles.symptomItem}>
                <View style={[styles.dot, { backgroundColor: colors.error }]} />
                <Text style={styles.symptomText}>{symptom}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Advice</Text>
          {report.recommendations.map((rec, index) => (
            <View key={index} style={styles.adviceCard}>
              <Text style={styles.adviceNumber}>{index + 1}</Text>
              <Text style={styles.adviceText}>{rec}</Text>
            </View>
          ))}
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
    downloadButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '1A',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContent: {
      padding: spacing.l,
    },
    statusCard: {
      alignItems: 'center',
      padding: spacing.xl,
      backgroundColor: colors.card,
      borderRadius: 24,
      marginBottom: spacing.l,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    iconCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.error + '0D',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.m,
    },
    statusTitle: {
      ...typography.h1,
      color: colors.error,
      marginBottom: 4,
    },
    dateText: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.m,
    },
    scoreBadge: {
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.xs,
      backgroundColor: colors.error + '1A',
      borderRadius: 20,
    },
    scoreText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.error,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.text,
      marginBottom: spacing.m,
      textAlign,
    },
    symptomList: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    symptomItem: {
      flexDirection,
      alignItems: 'center',
      paddingVertical: 8,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginLeft: isRTL ? 12 : 0,
      marginRight: isRTL ? 0 : 12,
    },
    symptomText: {
      ...typography.body,
      color: colors.text,
      textAlign,
    },
    adviceCard: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.glass,
      padding: spacing.m,
      borderRadius: 16,
      marginBottom: spacing.s,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    adviceNumber: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary,
      color: colors.background,
      textAlign: 'center',
      lineHeight: 28,
      fontWeight: 'bold',
      fontSize: 14,
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    adviceText: {
      flex: 1,
      ...typography.caption,
      color: colors.text,
      lineHeight: 18,
      textAlign,
    },
  });
};

export default ReportDetailsScreen;
