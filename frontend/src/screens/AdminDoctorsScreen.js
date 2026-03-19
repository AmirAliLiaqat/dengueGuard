import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { Stethoscope, ChevronRight, Plus } from "lucide-react-native";
import { useGetAdminDoctorsQuery } from "../services/api";
import { createStyles } from "../styles/ProfileScreen.styles";

const AdminDoctorsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);
  const { colors, spacing } = theme;
  const { data: doctors = [] } = useGetAdminDoctorsQuery();

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing.l,
          paddingTop: spacing.m,
          paddingBottom: spacing.s,
          borderBottomWidth: 1,
          borderBottomColor: colors.glassBorder,
        }}
      >
        <Text style={{ ...theme.typography.h2, color: colors.text, flex: 1 }}>
          {t("doctor_panel") || "Doctors"}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AdminAddDoctor")}
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            backgroundColor: colors.primary,
            paddingHorizontal: spacing.m,
            paddingVertical: spacing.s,
            borderRadius: 10,
            gap: 6,
          }}
          accessibilityLabel={t("add") || "Add"}
        >
          <Plus color={colors.background} size={20} />
          <Text style={{ color: colors.background, fontWeight: "700" }}>
            {t("add") || "Add"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.scrollContent, { paddingTop: spacing.m }]}
        ListEmptyComponent={
          <View style={styles.section}>
            <Text style={{ ...styles.menuLabel, textAlign: "center" }}>
              {t("no_doctors_yet") ||
                "No doctors yet. Tap Add to create one."}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate("AdminDoctorDetail", { doctorId: item.id })
            }
          >
            <View style={styles.menuIconContainer}>
              {item.picture_url ? (
                <Image
                  source={{ uri: item.picture_url }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                  }}
                />
              ) : (
                <Stethoscope color={colors.primary} size={22} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>{item.name}</Text>
              <Text
                style={{
                  ...styles.menuLabel,
                  fontSize: 12,
                  color: colors.textMuted,
                }}
              >
                {item.dengue_expertise || t("no_expertise") || "No expertise added"}
              </Text>
            </View>
            <ChevronRight color={colors.textMuted} size={20} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default AdminDoctorsScreen;
