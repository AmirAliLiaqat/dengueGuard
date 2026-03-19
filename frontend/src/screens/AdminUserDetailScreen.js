import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useGetAdminUserReportsQuery } from "../services/api";
import { ChevronLeft, ChevronRight, User } from "lucide-react-native";

const AdminUserDetailScreen = ({ route, navigation }) => {
  const { user } = route.params || {};
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const { colors, spacing, typography } = theme;
  const styles = createStyles(theme);
  const { data: reports = [] } = useGetAdminUserReportsQuery(user?.id, {
    skip: !user?.id,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          {isRTL ? (
            <ChevronRight color={colors.text} size={24} />
          ) : (
            <ChevronLeft color={colors.text} size={24} />
          )}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Details</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          {user?.profile_picture ? (
            <Image source={{ uri: user.profile_picture }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <User color={colors.primary} size={38} />
            </View>
          )}
        </View>
        <View style={styles.card}>
          <Text style={styles.row}>Name: {user?.full_name || "N/A"}</Text>
          <Text style={styles.row}>Email: {user?.email || "N/A"}</Text>
          <Text style={styles.row}>Phone: {user?.phone || "N/A"}</Text>
          <Text style={styles.row}>Role: {user?.role || "user"}</Text>
          <Text style={styles.row}>
            Verified: {user?.is_verified ? "Yes" : "No"}
          </Text>
        </View>

        <Text style={styles.subtitle}>Diagnoses / Reports ({reports.length})</Text>
        {reports.map((r) => (
          <View key={r.id} style={styles.card}>
            <Text style={styles.row}>
              {r.kbs_recommendation?.disease_detection || "Analysis"}
            </Text>
            <Text style={styles.row}>
              Risk: {r.kbs_recommendation?.risk_classification || "Unknown"}
            </Text>
            <Text style={styles.row}>
              Date: {new Date(r.created_at).toLocaleString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = ({ colors, spacing, typography }) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.l,
      paddingTop: spacing.m,
      paddingBottom: spacing.s,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder,
    },
    backButton: {
      width: 40,
      alignItems: "flex-start",
    },
    headerTitle: { ...typography.h3, color: colors.text, textAlign: "center", flex: 1 },
    content: { padding: spacing.l },
    avatarSection: {
      alignItems: "center",
      marginBottom: spacing.m,
    },
    avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: colors.glassBorder,
    },
    avatarFallback: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: colors.glassBorder,
      backgroundColor: colors.glass,
      alignItems: "center",
      justifyContent: "center",
    },
    title: { ...typography.h2, color: colors.text, marginBottom: spacing.m },
    subtitle: {
      ...typography.h3,
      color: colors.text,
      marginBottom: spacing.s,
      marginTop: spacing.m,
    },
    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      borderRadius: 14,
      padding: spacing.m,
      marginBottom: spacing.s,
    },
    row: { ...typography.body, color: colors.text, marginBottom: 6 },
  });

export default AdminUserDetailScreen;

