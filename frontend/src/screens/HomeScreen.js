import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { PlusCircle, History, Bell, ChevronRight, AlertTriangle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          <Text style={styles.welcomeText}>{t('welcome_back')}</Text>
          <Text style={styles.nameText}>Patient John</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Bell color={colors.text} size={24} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <AlertTriangle color={colors.warning} size={20} />
          <Text style={styles.statusTitle}>
            {t('precaution_alert')}
          </Text>
        </View>
        <Text style={styles.statusDescription}>
          {t('dengue_alert_desc')}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        {t('quick_actions')}
      </Text>

      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Diagnose')}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.primary + '1A' }]}>
            <PlusCircle color={colors.primary} size={32} />
          </View>
          <Text style={styles.actionTitle}>{t('new_diagnosis')}</Text>
          <Text style={styles.actionSubtitle}>{t('start_kbs_scan')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('History')}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.accent + '1A' }]}>
            <History color={colors.accent} size={32} />
          </View>
          <Text style={styles.actionTitle}>{t('health_history')}</Text>
          <Text style={styles.actionSubtitle}>{t('view_reports')}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitleWithMargin}>
        {t('recent_reports')}
      </Text>

      <View style={styles.reportList}>
        {[1, 2].map((item) => (
          <TouchableOpacity 
            key={item} 
            style={styles.reportItem}
            onPress={() => navigation.navigate('ReportDetails', { reportId: item.toString() })}
          >
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>Diagnosis #{item}234</Text>
              <Text style={styles.reportSubtitle}>Oct 12, 2023 • Normal</Text>
            </View>
            <ChevronRight color={colors.textMuted} size={20} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
          </TouchableOpacity>
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
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.xl,
      paddingHorizontal: spacing.l,
      paddingBottom: spacing.m,
    },
    welcomeText: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign,
    },
    nameText: {
      ...typography.h2,
      color: colors.text,
      textAlign,
    },
    iconButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    badge: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.accent,
      borderWidth: 2,
      borderColor: colors.card,
    },
    statusCard: {
      margin: spacing.l,
      padding: spacing.m,
      backgroundColor: colors.warning + '1A',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.warning + '33',
    },
    statusHeader: {
      flexDirection,
      alignItems: 'center',
    },
    statusTitle: {
      ...typography.body,
      color: colors.warning,
      marginLeft: isRTL ? 0 : 8,
      marginRight: isRTL ? 8 : 0,
      fontWeight: 'bold',
    },
    statusDescription: {
      ...typography.caption,
      color: colors.text,
      marginTop: 4,
      textAlign,
    },
    sectionTitle: {
      ...typography.h3,
      paddingHorizontal: spacing.l,
      marginBottom: spacing.m,
      color: colors.text,
      textAlign,
    },
    sectionTitleWithMargin: {
      ...typography.h3,
      paddingHorizontal: spacing.l,
      marginVertical: spacing.m,
      color: colors.text,
      textAlign,
    },
    actionGrid: {
      flexDirection,
      paddingHorizontal: spacing.l,
      justifyContent: 'space-between',
    },
    actionCard: {
      width: (width - spacing.l * 3) / 2,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    actionIcon: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.m,
    },
    actionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
    },
    actionSubtitle: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign,
    },
    reportList: {
      paddingHorizontal: spacing.l,
      paddingBottom: spacing.xl,
    },
    reportItem: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.m,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    reportInfo: {
      flex: 1,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    reportTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      textAlign,
    },
    reportSubtitle: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign,
    }
  });
};

export default HomeScreen;
