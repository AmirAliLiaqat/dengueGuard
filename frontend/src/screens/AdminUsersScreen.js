import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { User, ChevronRight } from "lucide-react-native";
import { useGetAdminUsersQuery } from "../services/api";
import { createStyles } from "../styles/ProfileScreen.styles";

const AdminUsersScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);
  const { colors, spacing } = theme;
  const { data: users = [] } = useGetAdminUsersQuery();

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("public_profiles") || "Users"}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("AdminUserDetail", { user: item })}
          >
            <View style={styles.menuIconContainer}>
              {item.profile_picture ? (
                <Image
                  source={{ uri: item.profile_picture }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
              ) : (
                <User color={colors.primary} size={22} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>{item.full_name || "Unnamed User"}</Text>
              <Text style={{ ...styles.menuLabel, fontSize: 12, color: colors.textMuted }}>
                {item.email}
              </Text>
            </View>
            <ChevronRight color={colors.textMuted} size={20} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default AdminUsersScreen;

