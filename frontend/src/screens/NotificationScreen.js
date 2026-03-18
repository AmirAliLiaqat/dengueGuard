import React from "react";
import { View, Text, FlatList, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  Bell,
  Info,
  ShieldAlert,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Share2,
  Download,
  CheckCheck,
  Trash2,
} from "lucide-react-native";
import { createStyles } from "../styles/NotificationScreen.styles";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteAllNotificationsMutation,
} from "../services/api";
import { RefreshControl, ActivityIndicator } from "react-native";

const NotificationScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const {
    data: notifications = [],
    isLoading,
    refetch,
    isFetching,
  } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteAllNotifications, { isLoading: isDeletingAll }] =
    useDeleteAllNotificationsMutation();
  const [showDeleteAllModal, setShowDeleteAllModal] = React.useState(false);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleDeleteAll = () => {
    if (!notifications.length) return;
    setShowDeleteAllModal(true);
  };

  const confirmDeleteAll = async () => {
    try {
      await deleteAllNotifications().unwrap();
      setShowDeleteAllModal(false);
      refetch();
    } catch (err) {
      console.error("Failed to delete all notifications:", err);
      setShowDeleteAllModal(false);
    }
  };

  const handleNotificationPress = (item) => {
    markAsRead(item.id);
    navigation.navigate("NotificationDetail", { notification: item });
  };

  const getTimeAgo = (dateString) => {
    // Force UTC parsing by ensuring 'Z' exists
    const utcString = dateString.endsWith("Z") ? dateString : dateString + "Z";
    const date = new Date(utcString.replace("Z", "") + "Z");
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return t("just_now");
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)}${t("minutes_ago")}`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}${t("hours_ago")}`;
    return date.toLocaleDateString();
  };

  const renderItem = ({ item }) => {
    let Icon = Info;
    let iconColor = colors.info;

    if (item.type === "warning" || item.type === "alert") {
      Icon = ShieldAlert;
      iconColor = colors.error;
    } else if (item.type === "success") {
      Icon = CheckCircle;
      iconColor = colors.success;
    } else if (item.type === "profile") {
      Icon = User;
      iconColor = "#8E44AD"; // Purple
    } else if (item.type === "share") {
      Icon = Share2;
      iconColor = colors.primary;
    } else if (item.type === "download") {
      Icon = Download;
      iconColor = "#2ECC71"; // Green
    }

    return (
      <TouchableOpacity
        style={[styles.notificationItem, !item.is_read && styles.unreadItem]}
        onPress={() => handleNotificationPress(item)}
      >
        <View
          style={[styles.iconContainer, { backgroundColor: iconColor + "1A" }]}
        >
          <Icon color={iconColor} size={24} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.itemHeader}>
            <Text
              style={[
                styles.itemTitle,
                !item.is_read && { fontWeight: "bold" },
              ]}
            >
              {item.title}
            </Text>
            <Text style={styles.itemDate}>{getTimeAgo(item.created_at)}</Text>
          </View>
          <Text style={styles.itemMessage} numberOfLines={2}>
            {item.message}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
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
        <Text style={styles.headerTitle}>{t("notifications_toggle")}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleMarkAllRead}
            disabled={!notifications.some((n) => !n.is_read)}
          >
            <CheckCheck
              color={
                notifications.some((n) => !n.is_read)
                  ? colors.primary
                  : colors.textMuted
              }
              size={24}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleDeleteAll}
            disabled={!notifications.length || isDeletingAll}
          >
            <Trash2
              color={
                notifications.length && !isDeletingAll
                  ? colors.error
                  : colors.textMuted
              }
              size={22}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Bell color={colors.textMuted} size={64} />
            <Text style={styles.emptyText}>{t("no_notifications")}</Text>
          </View>
        }
      />

      <Modal
        visible={showDeleteAllModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteAllModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIconWrap}>
              <Trash2 color={colors.error} size={26} />
            </View>
            <Text style={styles.confirmTitle}>
              {t("delete_all_notifications_title")}
            </Text>
            <Text style={styles.confirmMessage}>
              {t("delete_all_notifications_msg")}
            </Text>

            <View style={styles.confirmButtonsRow}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmCancelButton]}
                onPress={() => setShowDeleteAllModal(false)}
                disabled={isDeletingAll}
              >
                <Text
                  style={[styles.confirmButtonText, { color: colors.text }]}
                >
                  {t("cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmDeleteButton]}
                onPress={confirmDeleteAll}
                disabled={isDeletingAll}
              >
                {isDeletingAll ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.confirmDeleteText}>{t("delete")}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default NotificationScreen;
