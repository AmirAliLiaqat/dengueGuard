import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, Phone, ChevronLeft, Camera } from 'lucide-react-native';

const EditProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
  });

  const handleSave = () => {
    console.log('Saving profile:', formData);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('edit_profile_btn')}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.imageSection}>
            <View style={styles.imageContainer}>
              <View style={styles.placeholderImage}>
                <User color={colors.primary} size={60} />
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Camera color={colors.background} size={20} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputGroup}>
              <User color={colors.textMuted} size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter your name"
                placeholderTextColor={colors.textMuted}
                textAlign={isRTL ? 'right' : 'left'}
              />
            </View>

            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputGroup}>
              <Mail color={colors.textMuted} size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Enter your email"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                textAlign={isRTL ? 'right' : 'left'}
              />
            </View>

            <Text style={styles.label}>{t('phone_number') || 'Phone Number'}</Text>
            <View style={styles.inputGroup}>
              <Phone color={colors.textMuted} size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Enter your phone"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                textAlign={isRTL ? 'right' : 'left'}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    saveText: {
      ...typography.body,
      color: colors.primary,
      fontWeight: 'bold',
    },
    scrollContent: {
      padding: spacing.l,
    },
    imageSection: {
      alignItems: 'center',
      marginVertical: spacing.xl,
    },
    imageContainer: {
      position: 'relative',
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
    cameraButton: {
      position: 'absolute',
      bottom: 0,
      right: isRTL ? undefined : 0,
      left: isRTL ? 0 : undefined,
      backgroundColor: colors.primary,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.background,
    },
    form: {
      marginTop: spacing.xl,
    },
    label: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.s,
      marginLeft: isRTL ? 0 : 4,
      marginRight: isRTL ? 4 : 0,
      textAlign,
    },
    inputGroup: {
      flexDirection,
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: spacing.m,
      paddingHorizontal: spacing.m,
      height: 56,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    inputIcon: {
      marginLeft: isRTL ? spacing.s : 0,
      marginRight: isRTL ? 0 : spacing.s,
    },
    input: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
      textAlign,
    },
  });
};

export default EditProfileScreen;
