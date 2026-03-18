import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  ShieldAlert,
  CheckCircle,
  Calendar,
  Clock,
  Trash2,
  User,
  Share2,
  Download,
} from "lucide-react-native";
import { useDeleteNotificationMutation } from "../services/api";
import { createStyles } from "../styles/NotificationDetailScreen.styles";

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
    const utcString = dateString.endsWith("Z") ? dateString : dateString + "Z";
    const date = new Date(utcString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const utcString = dateString.endsWith("Z") ? dateString : dateString + "Z";
    const date = new Date(utcString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  let Icon = Info;
  let iconColor = colors.info;
  if (notification.type === "warning" || notification.type === "alert") {
    Icon = ShieldAlert;
    iconColor = colors.error;
  } else if (notification.type === "success") {
    Icon = CheckCircle;
    iconColor = colors.success;
  } else if (notification.type === "profile") {
    Icon = User;
    iconColor = "#8E44AD"; // Purple
  } else if (notification.type === "share") {
    Icon = Share2;
    iconColor = colors.primary;
  } else if (notification.type === "download") {
    Icon = Download;
    iconColor = "#2ECC71"; // Green
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          {isRTL ? (
            <ChevronRight color={colors.text} size={24} />
          ) : (
            <ChevronLeft color={colors.text} size={24} />
          )}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Message</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 color={colors.error} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View
            style={[styles.iconWrapper, { backgroundColor: iconColor + "1A" }]}
          >
            <Icon color={iconColor} size={40} />
          </View>

          <Text style={styles.title}>{notification.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Calendar color={colors.textMuted} size={16} />
              <Text style={styles.metaText}>
                {formatDate(notification.created_at)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Clock color={colors.textMuted} size={16} />
              <Text style={styles.metaText}>
                {formatTime(notification.created_at)}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.message}>{notification.message}</Text>
        </View>

        {notification.related_id && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate("ReportDetails", {
                reportId: notification.related_id,
              })
            }
          >
            <Text style={styles.actionButtonText}>View Related Report</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationDetailScreen;
