import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, Info, ShieldAlert, CheckCircle, Calendar, Clock, Trash2, User, Share2, Download } from 'lucide-react-native';
import { useDeleteNotificationMutation } from '../services/api';

const NotificationDetailScreen = ({ route, navigation }) => {
  const { notification } = route.params;
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);
  
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleDelete = async () => {
    await deleteNotification(notification.id);
    navigation.goBack();
  };

  const formatDate = (dateString) => {
    const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
    const date = new Date(utcString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
    const date = new Date(utcString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  let Icon = Info;
  let iconColor = colors.info;
  if (notification.type === 'warning' || notification.type === 'alert') {
    Icon = ShieldAlert;
    iconColor = colors.error;
  } else if (notification.type === 'success') {
    Icon = CheckCircle;
    iconColor = colors.success;
  } else if (notification.type === 'profile') {
    Icon = User;
    iconColor = '#8E44AD'; // Purple
  } else if (notification.type === 'share') {
    Icon = Share2;
    iconColor = colors.primary;
  } else if (notification.type === 'download') {
    Icon = Download;
    iconColor = '#2ECC71'; // Green
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Message</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 color={colors.error} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={[styles.iconWrapper, { backgroundColor: iconColor + '1A' }]}>
            <Icon color={iconColor} size={40} />
          </View>
          
          <Text style={styles.title}>{notification.title}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Calendar color={colors.textMuted} size={16} />
              <Text style={styles.metaText}>{formatDate(notification.created_at)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock color={colors.textMuted} size={16} />
              <Text style={styles.metaText}>{formatTime(notification.created_at)}</Text>
            </View>
          </View>

          <View style={styles.divider} />
          
          <Text style={styles.message}>{notification.message}</Text>
        </View>

        {notification.related_id && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ReportDetails', { reportId: notification.related_id })}
          >
            <Text style={styles.actionButtonText}>View Related Report</Text>
          </TouchableOpacity>
        )}
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
    deleteButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.error + '1A',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.error + '1A',
    },
    headerTitle: {
      ...typography.h2,
      color: colors.text,
    },
    content: {
      padding: spacing.l,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      alignItems: 'center',
    },
    iconWrapper: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.l,
    },
    title: {
      ...typography.h2,
      color: colors.text,
      textAlign: 'center',
      marginBottom: spacing.m,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: spacing.l,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacing.s,
      marginBottom: 4,
    },
    metaText: {
      ...typography.caption,
      color: colors.textMuted,
      marginLeft: 6,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: colors.glassBorder,
      marginVertical: spacing.l,
    },
    message: {
      ...typography.body,
      color: colors.text,
      lineHeight: 24,
      textAlign: 'center',
    },
    actionButton: {
      marginTop: spacing.xl,
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: spacing.l,
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
};

export default NotificationDetailScreen;
