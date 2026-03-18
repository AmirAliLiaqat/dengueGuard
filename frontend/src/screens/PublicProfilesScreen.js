import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { ChevronLeft, Search, User, Globe } from "lucide-react-native";
import { useGetPublicProfilesQuery } from "../services/api";
import { createStyles } from "../styles/PublicProfilesScreen.styles";

const PublicProfilesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: publicProfiles,
    isLoading,
    refetch,
  } = useGetPublicProfilesQuery();

  const filteredProfiles = publicProfiles?.filter(
    (profile) =>
      profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderProfileItem = ({ item }) => (
    <TouchableOpacity
      style={styles.profileCard}
      onPress={() =>
        navigation.navigate("UserProfileDetail", { userId: item.id })
      }
    >
      <View style={styles.avatarContainer}>
        {item.profile_picture ? (
          <Image source={{ uri: item.profile_picture }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <User color={colors.primary} size={24} />
          </View>
        )}
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>
          {item.full_name || "Anonymous User"}
        </Text>
        <Text style={styles.profileEmail}>{item.email}</Text>
      </View>
      <Globe color={colors.primary} size={18} opacity={0.6} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft
            color={colors.text}
            size={24}
            style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("public_profiles")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <Search color={colors.textMuted} size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t("search_users")}
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign={isRTL ? "right" : "left"}
        />
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredProfiles}
          renderItem={renderProfileItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onRefresh={refetch}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <User color={colors.textMuted} size={64} opacity={0.3} />
              <Text style={styles.emptyText}>{t("no_public_profiles")}</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default PublicProfilesScreen;
