import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ClipboardList, ChevronRight, FileText } from 'lucide-react-native';

const HistoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const historyData = [
    { id: '1', date: 'Oct 24, 2023', result: 'High Risk', status: 'Infected', score: 85 },
    { id: '2', date: 'Oct 15, 2023', result: 'Low Risk', status: 'Healthy', score: 12 },
    { id: '3', date: 'Sep 28, 2023', result: 'Medium Risk', status: 'Suspicious', score: 45 },
  ];

  const renderItem = ({ item }) => {
    const statusColor = item.status === 'Infected' ? colors.error : 
                        item.status === 'Healthy' ? colors.success : 
                        colors.warning;
    
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('ReportDetails', { reportId: item.id })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <FileText color={colors.primary} size={24} />
          </View>
          <View style={styles.cardMain}>
            <Text style={styles.cardTitle}>{item.result}</Text>
            <Text style={styles.cardSubtitle}>{item.date}</Text>
          </View>
          <ChevronRight color={colors.textMuted} size={20} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </View>
        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '1A' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
          </View>
          <Text style={styles.scoreText}>Severity: {item.score}%</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('health_history')}</Text>
        <Text style={styles.subtitle}>{t('view_reports')}</Text>
      </View>

      <FlatList
        data={historyData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ClipboardList color={colors.textMuted} size={60} />
            <Text style={styles.emptyText}>{t('no_notifications')}</Text>
          </View>
        }
      />
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
      paddingHorizontal: spacing.l,
      paddingTop: spacing.xl,
      paddingBottom: spacing.l,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    title: {
      ...typography.h1,
      color: colors.text,
      textAlign,
    },
    subtitle: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign,
    },
    listContent: {
      padding: spacing.l,
      paddingTop: 0,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.m,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    cardHeader: {
      flexDirection,
      alignItems: 'center',
      marginBottom: spacing.m,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    cardMain: {
      flex: 1,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    cardTitle: {
      ...typography.h3,
      color: colors.text,
      textAlign,
    },
    cardSubtitle: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign,
    },
    cardFooter: {
      flexDirection,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.m,
      borderTopWidth: 1,
      borderTopColor: colors.glassBorder,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    scoreText: {
      ...typography.caption,
      color: colors.text,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 100,
    },
    emptyText: {
      ...typography.body,
      color: colors.textMuted,
      marginTop: spacing.m,
      textAlign,
    },
  });
};

export default HistoryScreen;
