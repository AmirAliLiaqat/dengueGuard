import React from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useGetPublicDoctorDetailQuery } from "../services/api";

const DoctorDetailScreen = ({ route }) => {
  const { doctorId } = route.params || {};
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;
  const styles = createStyles(theme);
  const { data: doctor } = useGetPublicDoctorDetailQuery(doctorId, {
    skip: !doctorId,
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {doctor?.picture_url ? (
          <Image source={{ uri: doctor.picture_url }} style={styles.image} />
        ) : null}
        <Text style={styles.name}>{doctor?.name || "Doctor"}</Text>
        <Text style={styles.meta}>Age: {doctor?.age || "N/A"}</Text>
        <Text style={styles.sectionTitle}>Bio</Text>
        <Text style={styles.text}>{doctor?.bio || "No bio added."}</Text>
        <Text style={styles.sectionTitle}>Dengue Expertise</Text>
        <Text style={styles.text}>{doctor?.dengue_expertise || "Not provided."}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = ({ colors, spacing, typography }) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.l },
    image: { width: "100%", height: 220, borderRadius: 14, marginBottom: spacing.m },
    name: { ...typography.h2, color: colors.text },
    meta: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.m },
    sectionTitle: { ...typography.h3, color: colors.text, marginTop: spacing.m, marginBottom: spacing.s },
    text: { ...typography.body, color: colors.text },
  });

export default DoctorDetailScreen;

