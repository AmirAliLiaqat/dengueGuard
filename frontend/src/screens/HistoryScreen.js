import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ClipboardList, ChevronRight, FileText } from 'lucide-react-native';

import { useGetHistoryQuery } from '../services/api';

const HistoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);
  
  const { data: historyData, refetch, isFetching } = useGetHistoryQuery(50); // Fetch up to 50

  const renderItem = ({ item }) => {
    const risk = item.kbs_recommendation?.risk_classification || 'Unknown';
    const statusColor = risk === 'High' || risk === 'Critical' ? colors.error : 
                        risk === 'Low' ? colors.success : 
                        colors.warning;
    
    const dateStr = new Date(item.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

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
            <Text style={styles.cardTitle}>{item.kbs_recommendation?.disease_detection || 'Diagnosis'}</Text>
            <Text style={styles.cardSubtitle}>{dateStr}</Text>
          </View>
          <ChevronRight color={colors.textMuted} size={20} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </View>
        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '1A' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{risk} Risk</Text>
          </View>
          <Text style={styles.scoreText}>ML Prob: {(item.ml_prediction?.probability * 100).toFixed(0)}%</Text>
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
        refreshing={isFetching}
        onRefresh={refetch}
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
