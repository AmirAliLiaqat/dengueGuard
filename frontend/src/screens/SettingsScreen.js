import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ChevronLeft,
  Bell,
  Moon,
  Info,
  ChevronRight,
  Check,
  HelpCircle,
} from 'lucide-react-native';

const SettingsScreen = ({ navigation }) => {
  const { isDark, toggleTheme, theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { language, changeLanguage, t, isRTL } = useLanguage();
  const [isPushNotifications, setIsPushNotifications] = React.useState(true);

  const styles = createStyles(theme, isRTL);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>{t('language')}</Text>
          <View style={styles.languageContainer}>
            <TouchableOpacity 
              style={[styles.languageOption, language === 'en' && styles.languageOptionActive]}
              onPress={() => changeLanguage('en')}
            >
              <Text style={[styles.languageText, language === 'en' && styles.languageTextActive]}>English</Text>
              {language === 'en' && <Check color={colors.primary} size={16} />}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.languageOption, language === 'ur' && styles.languageOptionActive]}
              onPress={() => changeLanguage('ur')}
            >
              <Text style={[styles.languageText, language === 'ur' && styles.languageTextActive]}>اردو (Urdu)</Text>
              {language === 'ur' && <Check color={colors.primary} size={16} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>{t('settings')}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.itemIconContainer}>
              <Moon color={colors.primary} size={20} />
            </View>
            <Text style={styles.itemLabel}>{t('dark_mode')}</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.glassBorder, true: colors.primary }}
              thumbColor={isDark ? '#FFFFFF' : colors.textMuted}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.itemIconContainer}>
              <Bell color={colors.primary} size={20} />
            </View>
            <Text style={styles.itemLabel}>{t('notifications_toggle')}</Text>
            <Switch
              value={isPushNotifications}
              onValueChange={() => setIsPushNotifications(!isPushNotifications)}
              trackColor={{ false: colors.glassBorder, true: colors.primary }}
              thumbColor={isPushNotifications ? '#FFFFFF' : colors.textMuted}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>{t('support')}</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('HelpSupport')}
          >
            <View style={styles.itemIconContainer}>
              <HelpCircle color={colors.primary} size={20} />
            </View>
            <Text style={styles.itemLabel}>{t('help_faq')}</Text>
            <ChevronRight color={colors.textMuted} size={20} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('About')}
          >
            <View style={styles.itemIconContainer}>
              <Info color={colors.primary} size={20} />
            </View>
            <Text style={styles.itemLabel}>{t('about_app')}</Text>
            <ChevronRight color={colors.textMuted} size={20} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>{t('app_version')}: 1.0.0 (Build 124)</Text>
        </View>
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
    headerTitle: {
      ...typography.h2,
      color: colors.text,
    },
    scrollContent: {
      padding: spacing.l,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitleText: {
      ...typography.caption,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginBottom: spacing.m,
      letterSpacing: 1,
      color: colors.textMuted,
      textAlign,
    },
    settingItem: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: spacing.m,
      borderRadius: 16,
      marginBottom: spacing.s,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    itemIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    itemLabel: {
      flex: 1,
      ...typography.body,
      textAlign,
      color: colors.text,
    },
    languageContainer: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      overflow: 'hidden',
    },
    languageOption: {
      flexDirection,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder,
    },
    languageOptionActive: {
      backgroundColor: colors.primary + '0D',
    },
    languageText: {
      ...typography.body,
      color: colors.text,
    },
    languageTextActive: {
      color: colors.primary,
      fontWeight: 'bold',
    },
    footer: {
      paddingVertical: spacing.m,
      alignItems: 'center',
    },
    versionText: {
      ...typography.caption,
      color: colors.textMuted,
    },
  });
};

export default SettingsScreen;
