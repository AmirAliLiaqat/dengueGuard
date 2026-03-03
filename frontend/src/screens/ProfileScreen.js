import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Settings, LogOut, ChevronRight, Shield, Bell, FileText } from 'lucide-react-native';

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
  };

  const menuItems = [
    { icon: User, label: t('edit_profile_btn'), onPress: () => navigation.navigate('EditProfile') },
    { icon: Bell, label: t('notifications_toggle'), onPress: () => navigation.navigate('Notifications') },
    { icon: Shield, label: t('privacy_security'), onPress: () => navigation.navigate('PrivacyAndSecurity') },
    { icon: FileText, label: t('terms_conditions'), onPress: () => navigation.navigate('TermsAndConditions') },
    { icon: Settings, label: t('settings'), onPress: () => navigation.navigate('Settings') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            <View style={styles.placeholderImage}>
              <User color={colors.primary} size={60} />
            </View>
          </View>
          <Text style={styles.nameText}>{user.name}</Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>{t('stats_tests')}</Text>
          </View>
          <View style={[styles.statBox, styles.statBorder]}>
            <Text style={styles.statValue}>Normal</Text>
            <Text style={styles.statLabel}>{t('stats_status')}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>High</Text>
            <Text style={styles.statLabel}>{t('stats_risk')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('account_section')}</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuIconContainer}>
                <item.icon color={colors.primary} size={22} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRight color={colors.textMuted} size={20} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
          <LogOut color={colors.error} size={22} />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
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
    scrollContent: {
      padding: spacing.l,
    },
    header: {
      alignItems: 'center',
      marginTop: spacing.xl,
      marginBottom: spacing.l,
    },
    imageContainer: {
      marginBottom: spacing.m,
    },
    placeholderImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.glassBorder,
    },
    nameText: {
      ...typography.h2,
      color: colors.text,
      textAlign: 'center',
    },
    emailText: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign: 'center',
    },
    statsContainer: {
      flexDirection,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: spacing.m,
      marginBottom: spacing.xl,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    statBox: {
      flex: 1,
      alignItems: 'center',
    },
    statBorder: {
      borderLeftWidth: isRTL ? 0 : 1,
      borderRightWidth: isRTL ? 1 : 0,
      borderColor: colors.glassBorder,
    },
    statValue: {
      ...typography.h3,
      color: colors.primary,
    },
    statLabel: {
      ...typography.caption,
      marginTop: 4,
      color: colors.textMuted,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.h3,
      marginBottom: spacing.m,
      color: colors.text,
      textAlign,
    },
    menuItem: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: spacing.m,
      borderRadius: 12,
      marginBottom: spacing.s,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    menuIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    menuLabel: {
      flex: 1,
      ...typography.body,
      color: colors.text,
      textAlign,
    },
    logoutButton: {
      flexDirection,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.glass,
      padding: spacing.m,
      borderRadius: 12,
      marginBottom: spacing.xl,
      borderWidth: 1,
      borderColor: colors.error + '40',
    },
    logoutText: {
      ...typography.body,
      color: colors.error,
      fontWeight: 'bold',
      marginLeft: isRTL ? 0 : spacing.s,
      marginRight: isRTL ? spacing.s : 0,
    },
  });
};

export default ProfileScreen;
