import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, Info, ShieldCheck, Activity } from 'lucide-react-native';

const AboutScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('about_app')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Image 
              source={require('../assets/icon.png')} 
              style={styles.logoImage} 
              resizeMode="cover"
            />
          </View>
          <Text style={styles.appName}>{t('app_name')}</Text>
          <Text style={styles.version}>{t('app_version')}: 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('app_info')}</Text>
          <Text style={styles.description}>
            Dengue KBS (Knowledge Based System) is an advanced medical decision support tool powered by Artificial Intelligence. 
            Our platform combines machine learning models with expert medical rules to help users detect dengue symptoms early.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <ShieldCheck color={colors.success} size={24} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Medical Grade Accuracy</Text>
            <Text style={styles.cardText}>
              Our AI is trained on high-quality clinical data providing reliable disease detection probabilities.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Info color={colors.primary} size={24} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>KBS Engine</Text>
            <Text style={styles.cardText}>
              Knowledge-Based System ensures every AI decision is double-checked by professional medical logic rules.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2023 Dengue KBS Healthcare Solutions</Text>
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
    logoSection: {
      alignItems: 'center',
      marginVertical: spacing.xl,
    },
    logoCircle: {
      width: 120,
      height: 120,
      borderRadius: 24,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.m,
      borderWidth: 2,
      borderColor: colors.primary + '33',
      overflow: 'hidden',
    },
    logoImage: {
      width: '100%',
      height: '100%',
    },
    appName: {
      ...typography.h1,
      color: colors.text,
    },
    version: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: 4,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.text,
      marginBottom: spacing.s,
      textAlign,
    },
    description: {
      ...typography.body,
      color: colors.textMuted,
      lineHeight: 24,
      textAlign,
    },
    card: {
      flexDirection,
      backgroundColor: colors.card,
      padding: spacing.l,
      borderRadius: 20,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    cardIcon: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      ...typography.body,
      fontWeight: 'bold',
      color: colors.text,
      textAlign,
    },
    cardText: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: 4,
      lineHeight: 18,
      textAlign,
    },
    footer: {
      marginTop: spacing.m,
      alignItems: 'center',
      paddingBottom: spacing.m,
    },
    footerText: {
      ...typography.caption,
      color: colors.textMuted,
    },
  });
};

export default AboutScreen;
