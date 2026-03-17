import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView as RNScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ClipboardList, ChevronRight, FileText, Filter, ListFilter, SortAsc, SortDesc } from 'lucide-react-native';

import { useGetHistoryQuery } from '../services/api';

const HistoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);
  
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  const { data: historyData, refetch, isFetching } = useGetHistoryQuery(0); 

  const processedData = useMemo(() => {
    if (!historyData) return [];
    
    let filtered = [...historyData];
    
    if (riskFilter !== 'All') {
      filtered = filtered.filter(item => 
        item.kbs_recommendation?.risk_classification === riskFilter
      );
    }
    
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  }, [historyData, riskFilter, sortOrder]);

  const riskLevels = ['All', 'Critical', 'High', 'Moderate', 'Low'];

  const renderItem = ({ item }) => {
    const risk = item.kbs_recommendation?.risk_classification || 'Unknown';
    const statusColor = risk === 'High' || risk === 'Critical' ? colors.error : 
                        risk === 'Low' ? colors.success : 
                        colors.warning;
    
    const utcString = item.created_at.endsWith('Z') ? item.created_at : item.created_at + 'Z';
    const dateStr = new Date(utcString).toLocaleDateString('en-US', {
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
            <Text style={[styles.statusText, { color: statusColor }]}>{t(risk.toLowerCase())} {t('risk_label')}</Text>
          </View>
          <Text style={styles.scoreText}>{t('ml_probability')}: {(item.ml_prediction?.probability * 100).toFixed(0)}%</Text>
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

      <View style={styles.filterSection}>
        <View style={styles.sortToggleRow}>
           <Text style={styles.filterLabel}>{t('filter_by_risk')}</Text>
           <TouchableOpacity 
             style={styles.sortButton} 
             onPress={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
           >
             {sortOrder === 'newest' ? <SortDesc color={colors.primary} size={18} /> : <SortAsc color={colors.primary} size={18} />}
             <Text style={styles.sortButtonText}>{t(sortOrder)}</Text>
           </TouchableOpacity>
        </View>
        
        <RNScrollView 
          contentContainerStyle={styles.filterScrollContent}
        >
          {riskLevels.map((risk) => (
            <TouchableOpacity
              key={risk}
              style={[
                styles.filterChip,
                riskFilter === risk && styles.activeFilterChip
              ]}
              onPress={() => setRiskFilter(risk)}
            >
              <Text style={[
                styles.filterChipText,
                riskFilter === risk && styles.activeFilterChipText
              ]}>{t(risk.toLowerCase())}</Text>
            </TouchableOpacity>
          ))}
        </RNScrollView>
      </View>

      <FlatList
        data={processedData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isFetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ClipboardList color={colors.textMuted} size={60} />
            <Text style={styles.emptyText}>{t('no_matching_reports')}</Text>
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
    filterSection: {
      marginBottom: spacing.m,
    },
    sortToggleRow: {
      flexDirection,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.l,
      marginBottom: spacing.s,
    },
    filterLabel: {
      ...typography.caption,
      color: colors.textMuted,
      fontWeight: 'bold',
    },
    sortButton: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.glass,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    sortButtonText: {
      ...typography.caption,
      color: colors.primary,
      fontWeight: 'bold',
      marginLeft: isRTL ? 0 : 6,
      marginRight: isRTL ? 6 : 0,
    },
    filterScroll: {
      paddingLeft: isRTL ? 0 : spacing.l,
      paddingRight: isRTL ? spacing.l : 0,
    },
    filterScrollContent: {
      paddingRight: isRTL ? 0 : spacing.xl,
      paddingLeft: isRTL ? spacing.xl : 0,
      paddingVertical: 4,
    },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.card,
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    activeFilterChip: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterChipText: {
      fontSize: 12,
      color: colors.textMuted,
      fontWeight: '600',
    },
    activeFilterChipText: {
      color: colors.background,
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
