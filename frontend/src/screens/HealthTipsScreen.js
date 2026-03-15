import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ShieldCheck, Bug, Droplet, Home, AlertCircle } from 'lucide-react-native';

const HealthTipsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const tips = [
    {
      title: "Eliminate Standing Water",
      description: "Mosquitoes breed in stagnant water. Empty, cover, or clean containers that hold water, such as flower pots, buckets, and birdbaths.",
      icon: <Droplet color="#10B981" size={24} />,
      color: "#10B981"
    },
    {
      title: "Use Mosquito Repellent",
      description: "Apply insect repellent to exposed skin and clothing. Look for products containing DEET, Picaridin, or IR3535.",
      icon: <ShieldCheck color="#3B82F6" size={24} />,
      color: "#3B82F6"
    },
    {
      title: "Wear Protective Clothing",
      description: "Wear long-sleeved shirts, long pants, socks, and shoes when outdoors, especially during peak mosquito activity times (dawn and dusk).",
      icon: <Bug color="#F59E0B" size={24} />,
      color: "#F59E0B"
    },
    {
      title: "Secure Your Home",
      description: "Use window and door screens. Keep doors and windows closed when possible to prevent mosquitoes from entering.",
      icon: <Home color="#8E44AD" size={24} />,
      color: "#8E44AD"
    },
    {
      title: "Support Community Efforts",
      description: "Participate in local mosquito control programs and spread awareness about dengue prevention in your neighborhood.",
      icon: <AlertCircle color="#EF4444" size={24} />,
      color: "#EF4444"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('health_tips')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.introText}>
          Dengue fever is a mosquito-borne illness that can be prevented through simple yet effective measures. Follow these tips to protect yourself and your family.
        </Text>

        {tips.map((tip, index) => (
          <View key={index} style={styles.tipCard}>
            <View style={[styles.iconContainer, { backgroundColor: tip.color + '1A' }]}>
              {tip.icon}
            </View>
            <View style={styles.tipTextContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
          </View>
        ))}

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            Note: These tips are for prevention. If you suspect you have dengue, seek medical attention immediately.
          </Text>
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
    content: {
      padding: spacing.l,
    },
    introText: {
      ...typography.body,
      color: colors.textMuted,
      marginBottom: spacing.xl,
      lineHeight: 24,
      textAlign,
    },
    tipCard: {
      flexDirection,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: spacing.l,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isRTL ? spacing.m : 0,
      marginRight: isRTL ? 0 : spacing.m,
    },
    tipTextContent: {
      flex: 1,
    },
    tipTitle: {
      ...typography.h3,
      color: colors.text,
      marginBottom: 4,
      textAlign,
    },
    tipDescription: {
      ...typography.caption,
      color: colors.textMuted,
      lineHeight: 18,
      textAlign,
    },
    disclaimerBox: {
      marginTop: spacing.xl,
      padding: spacing.m,
      backgroundColor: colors.error + '1A',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.error + '33',
      marginBottom: spacing.xl * 2,
    },
    disclaimerText: {
      ...typography.caption,
      color: colors.error,
      textAlign: 'center',
    },
  });
};

export default HealthTipsScreen;
