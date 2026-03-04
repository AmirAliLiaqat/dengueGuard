import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, SafeAreaView, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, Activity, Stethoscope, AlertTriangle, Droplet, Heart, Home } from 'lucide-react-native';
import { useDiagnoseSymptomsMutation } from '../services/api';

const DiagnosisFormScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const [diagnoseSymptoms, { isLoading }] = useDiagnoseSymptomsMutation();

  const [symptoms, setSymptoms] = useState({
    // Standard Probable Dengue Criteria
    fever: false,
    headache: false,
    muscle_pain: false,
    joint_pain: false,
    nausea: false,
    vomiting: false,
    skin_rash: false,
    positive_tourniquet_test: false,

    // Warning Signs
    abdominal_pain: false,
    persistent_vomiting: false,
    clinical_fluid_accumulation: false,
    mucosal_bleeding: false,
    lethargy_or_restlessness: false,
    liver_enlargement: false,

    // Severe Dengue Criteria
    severe_plasma_leakage: false,
    shock_dss: false,
    respiratory_distress: false,
    severe_bleeding: false,
    ast_alt_1000: false,
    impaired_consciousness: false,
    heart_involvement: false,

    // Critical Phase Monitoring
    fever_drops: false,
    hematocrit_increases: false,
    platelet_decreases: false,

    // Group A (Home Care) criteria
    tolerates_oral_fluids: false,
    urinating_regularly: false,

    // Vitals
    body_temperature: '',
    blood_pressure: '',
    heart_rate: '',
    
    // Lab Tests
    platelet_count: '',
    white_blood_cell_count: '',
    hematocrit_level: '',
    
    // Exposures
    recent_travel: false,
    mosquito_exposure: false,
    rainy_season: false,
    local_dengue_outbreak: false,
  });

  const handleToggle = (key) => {
    setSymptoms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleText = (key, value) => {
    setSymptoms((prev) => ({ ...prev, [key]: value }));
  };

  const handleAnalyze = async () => {
    try {
      const payload = {
        ...symptoms,
        body_temperature: symptoms.body_temperature ? parseFloat(symptoms.body_temperature) : null,
        heart_rate: symptoms.heart_rate ? parseInt(symptoms.heart_rate, 10) : null,
        platelet_count: symptoms.platelet_count ? parseFloat(symptoms.platelet_count) : null,
        white_blood_cell_count: symptoms.white_blood_cell_count ? parseFloat(symptoms.white_blood_cell_count) : null,
        hematocrit_level: symptoms.hematocrit_level ? parseFloat(symptoms.hematocrit_level) : null,
      };

      const result = await diagnoseSymptoms(payload).unwrap();
      
      if (result?.diagnosis) {
         navigation.navigate('Result', { data: result.diagnosis });
      } else {
         alert('Analysis failed, no explicit diagnosis returned.');
      }
    } catch (e) {
      console.error(e);
      alert('Network or server error occurred. Please try again.');
    }
  };

  const formatLabel = (key) => {
    const translated = t(key);
    if (translated !== key) return translated;
    return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  const renderSwitch = (key, labelTranslation) => (
    <View style={styles.checkboxItem} key={key}>
      <Text style={styles.checkboxLabel}>{formatLabel(labelTranslation)}</Text>
      <Switch
        value={symptoms[key]}
        onValueChange={() => handleToggle(key)}
        trackColor={{ false: colors.glassBorder, true: colors.primary }}
        thumbColor={symptoms[key] ? '#FFFFFF' : colors.textMuted}
      />
    </View>
  );

  const renderInput = (key, labelTranslation, placeholder, keyboardType = "numeric") => (
    <View style={styles.inputGroup} key={key}>
      <Text style={styles.label}>{formatLabel(labelTranslation)}</Text>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        value={symptoms[key]}
        onChangeText={(text) => handleText(key, text)}
        textAlign={isRTL ? 'right' : 'left'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('diagnosis_form') || "Diagnosis Form"}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Step 1: Standard Symptoms */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Stethoscope color={colors.accent} size={20} />
            <Text style={styles.sectionTitle}>{t('symptoms') || "Classic Symptoms"}</Text>
          </View>
          {renderSwitch('fever', 'fever')}
          {renderSwitch('headache', 'headache')}
          {renderSwitch('muscle_pain', 'muscle_pain')}
          {renderSwitch('joint_pain', 'joint_pain')}
          {renderSwitch('nausea', 'nausea')}
          {renderSwitch('vomiting', 'vomiting')}
          {renderSwitch('skin_rash', 'skin_rash')}
          {renderSwitch('positive_tourniquet_test', 'positive_tourniquet_test')}
        </View>

        {/* Step 2: Warning Signs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle color={colors.warning || '#FFA500'} size={20} />
            <Text style={styles.sectionTitle}>{t('warning_signs') || "Warning Signs"}</Text>
          </View>
          {renderSwitch('abdominal_pain', 'abdominal_pain_or_tenderness')}
          {renderSwitch('persistent_vomiting', 'persistent_vomiting')}
          {renderSwitch('clinical_fluid_accumulation', 'clinical_fluid_accumulation')}
          {renderSwitch('mucosal_bleeding', 'mucosal_bleeding')}
          {renderSwitch('lethargy_or_restlessness', 'lethargy_or_restlessness')}
          {renderSwitch('liver_enlargement', 'liver_enlargement_>_2_cm')}
        </View>

        {/* Step 3: Severe Criteria */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart color={'#D32F2F'} size={20} />
            <Text style={styles.sectionTitle}>{t('severe_criteria') || "Severe Criteria"}</Text>
          </View>
          {renderSwitch('severe_plasma_leakage', 'severe_plasma_leakage')}
          {renderSwitch('shock_dss', 'shock_(DSS)')}
          {renderSwitch('respiratory_distress', 'respiratory_distress')}
          {renderSwitch('severe_bleeding', 'severe_bleeding')}
          {renderSwitch('ast_alt_1000', 'liver_AST/ALT_>=_1000')}
          {renderSwitch('impaired_consciousness', 'impaired_consciousness')}
          {renderSwitch('heart_involvement', 'heart_involvement')}
        </View>

        {/* Phase & Home Care */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Home color={colors.primary} size={20} />
            <Text style={styles.sectionTitle}>{t('phase_home_care') || "Phase & Home Care criteria"}</Text>
          </View>
          {renderSwitch('fever_drops', 'fever_drops_(Defervescence)')}
          {renderSwitch('hematocrit_increases', 'hematocrit_rapidly_increases')}
          {renderSwitch('platelet_decreases', 'platelet_rapidly_decreases')}
          {renderSwitch('tolerates_oral_fluids', 'tolerates_adequate_oral_fluids')}
          {renderSwitch('urinating_regularly', 'urinating_at_least_every_6_hours')}
        </View>

        {/* Vital Signs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Activity color={colors.info} size={20} />
            <Text style={styles.sectionTitle}>{t('vital_signs') || "Vital Signs"}</Text>
          </View>
          {renderInput('body_temperature', 'body_temperature', 'e.g. 39.0')}
          {renderInput('blood_pressure', 'blood_pressure', 'e.g. 110/70', 'default')}
          {renderInput('heart_rate', 'heart_rate', 'e.g. 95 BPM')}
        </View>

        {/* Lab Tests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Droplet color={colors.primary} size={20} />
            <Text style={styles.sectionTitle}>{t('blood_report_data') || "Laboratory Tests"}</Text>
          </View>
          {renderInput('platelet_count', 'platelet_count', 'e.g. 150000')}
          {renderInput('white_blood_cell_count', 'white_blood_cell_count', 'e.g. 4000')}
          {renderInput('hematocrit_level', 'hematocrit_level', 'e.g. 42.0')}
        </View>

        {/* Risk Factors Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle color={colors.warning} size={20} />
            <Text style={styles.sectionTitle}>{t('risk_factors') || "Risk Factors"}</Text>
          </View>
          {renderSwitch('recent_travel', 'recent_travel_/_endemic_area')}
          {renderSwitch('local_dengue_outbreak', 'local_dengue_outbreak')}
          {renderSwitch('mosquito_exposure', 'mosquito_exposure')}
          {renderSwitch('rainy_season', 'rainy_season')}
        </View>

        <TouchableOpacity 
          style={[styles.analyzeButton, isLoading && { opacity: 0.7 }]} 
          onPress={handleAnalyze}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <>
              <Text style={styles.analyzeButtonText}>{t('analyze_now') || "Analyze Now"}</Text>
              <ChevronRight color={colors.background} size={20} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
            </>
          )}
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
      marginBottom: spacing.l,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.text,
      marginLeft: isRTL ? 0 : spacing.s,
      marginRight: isRTL ? spacing.s : 0,
      textTransform: 'capitalize',
    },
    inputGroup: {
      marginBottom: spacing.m,
    },
    label: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: 8,
      textAlign,
      textTransform: 'capitalize',
    },
    textInput: {
      height: 52,
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: spacing.m,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      ...typography.body,
    },
    checkboxItem: {
      flexDirection,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.s,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder + '1A',
    },
    checkboxLabel: {
      ...typography.body,
      color: colors.text,
      textTransform: 'capitalize',
      flex: 1,
      textAlign,
    },
    analyzeButton: {
      backgroundColor: colors.primary,
      flexDirection,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    analyzeButtonText: {
      color: colors.background,
      fontSize: 18,
      fontWeight: 'bold',
      marginHorizontal: 8,
    },
  });
};

export default DiagnosisFormScreen;
