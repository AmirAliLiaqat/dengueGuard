import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, Info, AlertTriangle, ShieldCheck, MapPin, Activity, Heart } from 'lucide-react-native';

const DengueInfoScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const sections = [
    {
      title: "What is Dengue?",
      icon: Info,
      color: "#3498DB",
      content: "Dengue is a viral infection transmitted to humans through the bite of infected mosquitoes. It is found in tropical and sub-tropical climates worldwide, mostly in urban and semi-urban areas."
    },
    {
      title: "Why does it occur?",
      icon: Activity,
      color: "#E67E22",
      content: "Dengue is caused by one of four dengue viruses (DENV-1, DENV-2, DENV-3, and DENV-4). When a mosquito bites an infected person, the virus enters the mosquito. When the infected mosquito then bites another person, the virus enters that person's bloodstream and causes an infection."
    },
    {
      title: "Where does it spread?",
      icon: MapPin,
      color: "#2ECC71",
      content: "The primary vectors that transmit the disease are Aedes aegypti mosquitoes and, to a lesser extent, Ae. albopictus. These mosquitoes typically breed in stagnant water found in containers, old tires, and flower pots near human habitations."
    },
    {
      title: "Common Symptoms",
      icon: AlertTriangle,
      color: "#E74C3C",
      content: "Symptoms usually begin 4–10 days after infection and last for 2–7 days.\n\n• High fever (40°C/104°F)\n• Severe headache\n• Pain behind the eyes\n• Muscle and joint pains\n• Nausea and Vomiting\n• Swollen glands\n• Rash"
    },
    {
      title: "Warning Signs (Seek Medical Care!)",
      icon: AlertTriangle,
      color: "#C0392B",
      content: "Severe dengue is a life-threatening emergency. Watch for:\n\n• Severe abdominal pain\n• Persistent vomiting\n• Rapid breathing\n• Bleeding gums or nose\n• Fatigue/restlessness\n• Blood in vomit or stool"
    },
    {
      title: "Prevention & Control",
      icon: ShieldCheck,
      color: "#16A085",
      content: "Preventing mosquito bites and controlling the mosquito population are the best ways to prevent dengue:\n\n• Use mosquito repellents\n• Wear long-sleeved clothes\n• Use mosquito nets at night\n• Empty and clean water containers weekly\n• Install window screens"
    },
    {
      title: "Treatment Advice",
      icon: Heart,
      color: "#9B59B6",
      content: "There is no specific treatment for dengue. Recovery depends on:\n\n• Plenty of bed rest\n• Drinking lots of fluids (oral rehydration)\n• Taking Paracetamol to control fever and pain\n• AVOIDING Ibuprofen and Aspirin (they increase bleeding risk)"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dengue Encyclopedia</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <Activity color={colors.primary} size={48} />
          </View>
          <Text style={styles.heroTitle}>Everything About Dengue</Text>
          <Text style={styles.heroSubtitle}>Learn. Prevent. Protect.</Text>
        </View>

        {sections.map((section, index) => (
          <View key={index} style={styles.sectionCard}>
            <View style={[styles.sectionHeader, { borderLeftColor: section.color }]}>
              <View style={[styles.iconBox, { backgroundColor: section.color + '20' }]}>
                <section.icon color={section.color} size={20} />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.sectionBody}>
              <Text style={styles.sectionText}>{section.content}</Text>
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Source: World Health Organization (WHO) Guidelines 2024</Text>
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
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.m,
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
      ...typography.h3,
      color: colors.text,
      marginLeft: isRTL ? 0 : spacing.m,
      marginRight: isRTL ? spacing.m : 0,
    },
    scrollContent: {
      padding: spacing.l,
    },
    heroSection: {
      alignItems: 'center',
      marginBottom: spacing.xl,
      padding: spacing.l,
      backgroundColor: colors.card,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    heroIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.m,
    },
    heroTitle: {
      ...typography.h2,
      color: colors.text,
      textAlign: 'center',
    },
    heroSubtitle: {
      ...typography.body,
      color: colors.primary,
      fontWeight: 'bold',
      marginTop: 4,
    },
    sectionCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      marginBottom: spacing.l,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      overflow: 'hidden',
    },
    sectionHeader: {
      flexDirection,
      alignItems: 'center',
      padding: spacing.m,
      backgroundColor: colors.glass,
      borderLeftWidth: 4,
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: isRTL ? 0 : spacing.m,
      marginLeft: isRTL ? spacing.m : 0,
    },
    sectionTitle: {
      ...typography.h3,
      fontSize: 18,
      color: colors.text,
      flex: 1,
      textAlign,
    },
    sectionBody: {
      padding: spacing.l,
    },
    sectionText: {
      ...typography.body,
      color: colors.textMuted,
      lineHeight: 24,
      textAlign,
    },
    footer: {
      marginTop: spacing.xl,
      marginBottom: spacing.xl,
      alignItems: 'center',
    },
    footerText: {
      ...typography.caption,
      color: colors.textMuted,
      fontStyle: 'italic',
    },
  });
};

export default DengueInfoScreen;
