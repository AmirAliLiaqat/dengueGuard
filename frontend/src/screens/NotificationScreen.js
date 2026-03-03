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
import { Bell, Info, ShieldAlert, CheckCircle, ChevronLeft } from 'lucide-react-native';

const NotificationScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const notifications = [
    { id: '1', title: 'New History Added', message: 'Your diagnostic result of 24 Oct, 2023 is ready.', type: 'info', date: '2 hours ago' },
    { id: '2', title: 'High Risk Alert', message: 'Several dengue cases reported in your area. Stay safe!', type: 'alert', date: 'Yesterday' },
    { id: '3', title: 'Health Update', message: 'New preventive measures added to the system.', type: 'update', date: 'Oct 20, 2023' },
  ];

  const renderItem = ({ item }) => {
    let Icon = Info;
    let iconColor = colors.info;
    if (item.type === 'alert') {
      Icon = ShieldAlert;
      iconColor = colors.error;
    } else if (item.type === 'update') {
      Icon = CheckCircle;
      iconColor = colors.success;
    }

    return (
      <View style={styles.notificationItem}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '1A' }]}>
          <Icon color={iconColor} size={24} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDate}>{item.date}</Text>
          </View>
          <Text style={styles.itemMessage}>{item.message}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('notifications_toggle') || 'Notifications'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Bell color={colors.textMuted} size={64} />
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
    listContent: {
      padding: spacing.l,
    },
    notificationItem: {
      flexDirection,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.m,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    contentContainer: {
      flex: 1,
    },
    itemHeader: {
      flexDirection,
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    itemTitle: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
    },
    itemDate: {
      ...typography.caption,
      color: colors.textMuted,
    },
    itemMessage: {
      ...typography.caption,
      color: colors.text,
      lineHeight: 18,
      textAlign,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 100,
    },
    emptyText: {
      ...typography.body,
      color: colors.textMuted,
      marginTop: spacing.m,
    },
  });
};

export default NotificationScreen;
