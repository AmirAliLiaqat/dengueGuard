import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, Search, User, Globe } from 'lucide-react-native';
import { useGetPublicProfilesQuery } from '../services/api';

const PublicProfilesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const [searchQuery, setSearchQuery] = useState('');
  const { data: publicProfiles, isLoading, refetch } = useGetPublicProfilesQuery();

  const filteredProfiles = publicProfiles?.filter(profile =>
    profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProfileItem = ({ item }) => (
    <TouchableOpacity
      style={styles.profileCard}
      onPress={() => navigation.navigate('UserProfileDetail', { userId: item.id })}
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
        <Text style={styles.profileName}>{item.full_name || 'Anonymous User'}</Text>
        <Text style={styles.profileEmail}>{item.email}</Text>
      </View>
      <Globe color={colors.primary} size={18} opacity={0.6} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('public_profiles')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <Search color={colors.textMuted} size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('search_users')}
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign={isRTL ? 'right' : 'left'}
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
              <Text style={styles.emptyText}>{t('no_public_profiles')}</Text>
            </View>
          }
        />
      )}
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
    searchContainer: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      margin: spacing.l,
      paddingHorizontal: spacing.m,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    searchIcon: {
      marginRight: isRTL ? 0 : spacing.s,
      marginLeft: isRTL ? spacing.s : 0,
    },
    searchInput: {
      flex: 1,
      height: 50,
      color: colors.text,
      ...typography.body,
    },
    listContent: {
      paddingHorizontal: spacing.l,
      paddingBottom: spacing.xl,
    },
    profileCard: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: spacing.m,
      borderRadius: 16,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    avatarContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      overflow: 'hidden',
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: isRTL ? 0 : spacing.m,
      marginLeft: isRTL ? spacing.m : 0,
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    avatarPlaceholder: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
    },
    profileEmail: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 100,
    },
    emptyText: {
      ...typography.body,
      color: colors.textMuted,
      marginTop: spacing.m,
    },
  });
};

export default PublicProfilesScreen;
