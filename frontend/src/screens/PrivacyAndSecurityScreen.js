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
import { ChevronLeft, ShieldCheck, Lock, Eye, Fingerprint } from 'lucide-react-native';

const PrivacyAndSecurityScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const [isFaceID, setIsFaceID] = React.useState(true);
  const [isTwoFactor, setIsTwoFactor] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);

  const securitySettings = [
    {
      id: 'biometric',
      title: t('biometric_access'),
      subtitle: 'Use FaceID or Fingerprint to login',
      icon: Fingerprint,
      value: isFaceID,
      onToggle: () => setIsFaceID(!isFaceID)
    },
    {
      id: '2fa',
      title: t('two_factor'),
      subtitle: 'Require secondary code for logins',
      icon: Lock,
      value: isTwoFactor,
      onToggle: () => setIsTwoFactor(!isTwoFactor)
    },
    {
      id: 'visibility',
      title: t('visibility'),
      subtitle: 'Show your diagnostics to doctors',
      icon: Eye,
      value: isVisible,
      onToggle: () => setIsVisible(!isVisible)
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('privacy_security')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconContainer}>
          <ShieldCheck color={colors.success} size={64} />
        </View>
        <Text style={styles.introText}>
          Your data security and medical privacy is our top priority.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('security_settings')}</Text>
          {securitySettings.map((item) => (
            <View key={item.id} style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <item.icon color={colors.primary} size={22} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{ false: colors.glassBorder, true: colors.primary }}
                thumbColor={item.value ? '#FFFFFF' : colors.textMuted}
              />
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{t('data_policy')}</Text>
          <Text style={styles.infoText}>
            We use industry-standard encryption to protect your health records. Your data is only used to provide diagnostic insights and will never be shared with third parties without your explicit consent.
          </Text>
        </View>

        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteText}>{t('request_deletion')}</Text>
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
    iconContainer: {
      alignItems: 'center',
      marginVertical: spacing.xl,
    },
    introText: {
      ...typography.body,
      textAlign: 'center',
      marginBottom: spacing.xl,
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
    settingItem: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: spacing.m,
      borderRadius: 16,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.glass,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    settingText: {
      flex: 1,
    },
    settingTitle: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
    },
    settingSubtitle: {
      ...typography.caption,
      fontSize: 12,
      color: colors.textMuted,
      textAlign,
    },
    infoCard: {
      backgroundColor: colors.glass,
      padding: spacing.m,
      borderRadius: 16,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: colors.glassBorder,
      marginBottom: spacing.xl,
    },
    infoTitle: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 8,
      textAlign,
    },
    infoText: {
      ...typography.caption,
      color: colors.text,
      lineHeight: 20,
      textAlign,
    },
    deleteButton: {
      backgroundColor: colors.error + '1A',
      padding: spacing.m,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: spacing.xl,
      borderWidth: 1,
      borderColor: colors.error + '33',
    },
    deleteText: {
      color: colors.error,
      fontWeight: 'bold',
    },
  });
};

export default PrivacyAndSecurityScreen;
