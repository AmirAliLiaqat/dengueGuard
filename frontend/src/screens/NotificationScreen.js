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
import { Bell, Info, ShieldAlert, CheckCircle, ChevronLeft, User, Share2, Download } from 'lucide-react-native';

import { useGetNotificationsQuery, useMarkAsReadMutation } from '../services/api';
import { RefreshControl, ActivityIndicator } from 'react-native';

const NotificationScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const { data: notifications = [], isLoading, refetch, isFetching } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();

  const handleNotificationPress = (item) => {
    markAsRead(item.id);
    navigation.navigate('NotificationDetail', { notification: item });
  };

  const getTimeAgo = (dateString) => {
    // Force UTC parsing by ensuring 'Z' exists
    const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
    const date = new Date(utcString.replace('Z', '') + 'Z'); 
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const renderItem = ({ item }) => {
    let Icon = Info;
    let iconColor = colors.info;
    
    if (item.type === 'warning' || item.type === 'alert') {
      Icon = ShieldAlert;
      iconColor = colors.error;
    } else if (item.type === 'success') {
      Icon = CheckCircle;
      iconColor = colors.success;
    } else if (item.type === 'profile') {
      Icon = User;
      iconColor = '#8E44AD'; // Purple
    } else if (item.type === 'share') {
      Icon = Share2;
      iconColor = colors.primary;
    } else if (item.type === 'download') {
      Icon = Download;
      iconColor = '#2ECC71'; // Green
    }

    return (
      <TouchableOpacity 
        style={[styles.notificationItem, !item.is_read && styles.unreadItem]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '1A' }]}>
          <Icon color={iconColor} size={24} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.itemHeader}>
            <Text style={[styles.itemTitle, !item.is_read && { fontWeight: 'bold' }]}>{item.title}</Text>
            <Text style={styles.itemDate}>{getTimeAgo(item.created_at)}</Text>
          </View>
          <Text style={styles.itemMessage} numberOfLines={2}>{item.message}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

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
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={colors.primary} />
        }
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
    unreadItem: {
      backgroundColor: colors.primary + '0A',
      borderColor: colors.primary + '33',
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
