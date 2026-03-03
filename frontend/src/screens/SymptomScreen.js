import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, Activity, Stethoscope } from 'lucide-react-native';

const SymptomScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const [symptoms, setSymptoms] = useState({
    fever: '',
    platelets: '',
    headache: false,
    musclePain: false,
    nausea: false,
    bleeding: false,
  });

  const handleAnalyze = () => {
    navigation.navigate('Result', { data: symptoms });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('diagnosis_form')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Activity color={colors.primary} size={20} />
            <Text style={styles.sectionTitle}>{t('blood_report_data')}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('fever_duration')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 5"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={symptoms.fever}
              onChangeText={(text) => setSymptoms(prev => ({ ...prev, fever: text }))}
              textAlign={isRTL ? 'right' : 'left'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('platelet_count')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 150000"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={symptoms.platelets}
              onChangeText={(text) => setSymptoms(prev => ({ ...prev, platelets: text }))}
              textAlign={isRTL ? 'right' : 'left'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Stethoscope color={colors.accent} size={20} />
            <Text style={styles.sectionTitle}>{t('physical_symptoms')}</Text>
          </View>

          <View style={styles.checkboxItem}>
            <Text style={styles.checkboxLabel}>{t('headache')}</Text>
            <Switch
              value={symptoms.headache}
              onValueChange={(val) => setSymptoms(prev => ({ ...prev, headache: val }))}
              trackColor={{ false: colors.glassBorder, true: colors.primary }}
              thumbColor={symptoms.headache ? '#FFFFFF' : colors.textMuted}
            />
          </View>

          <View style={styles.checkboxItem}>
            <Text style={styles.checkboxLabel}>{t('muscle_pain')}</Text>
            <Switch
              value={symptoms.musclePain}
              onValueChange={(val) => setSymptoms(prev => ({ ...prev, musclePain: val }))}
              trackColor={{ false: colors.glassBorder, true: colors.primary }}
              thumbColor={symptoms.musclePain ? '#FFFFFF' : colors.textMuted}
            />
          </View>

          <View style={styles.checkboxItem}>
            <Text style={styles.checkboxLabel}>{t('nausea')}</Text>
            <Switch
              value={symptoms.nausea}
              onValueChange={(val) => setSymptoms(prev => ({ ...prev, nausea: val }))}
              trackColor={{ false: colors.glassBorder, true: colors.primary }}
              thumbColor={symptoms.nausea ? '#FFFFFF' : colors.textMuted}
            />
          </View>

          <View style={styles.checkboxItem}>
            <Text style={styles.checkboxLabel}>{t('bleeding')}</Text>
            <Switch
              value={symptoms.bleeding}
              onValueChange={(val) => setSymptoms(prev => ({ ...prev, bleeding: val }))}
              trackColor={{ false: colors.glassBorder, true: colors.primary }}
              thumbColor={symptoms.bleeding ? '#FFFFFF' : colors.textMuted}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
          <Text style={styles.analyzeButtonText}>{t('analyze_now')}</Text>
          <ChevronRight color={colors.background} size={20} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
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
    },
    inputGroup: {
      marginBottom: spacing.m,
    },
    label: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: 8,
      textAlign,
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
    },
    analyzeButton: {
      backgroundColor: colors.primary,
      flexDirection,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.xl * 2,
    },
    analyzeButtonText: {
      color: colors.background,
      fontSize: 18,
      fontWeight: 'bold',
      marginHorizontal: 8,
    },
  });
};

export default SymptomScreen;
