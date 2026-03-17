import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, Phone, ChevronLeft, Camera, Image as ImageIcon, X } from 'lucide-react-native';
import { useAlert } from '../context/AlertContext';
import { useGetMeQuery, useUpdateProfileMutation, useUploadProfilePictureMutation } from '../services/api';
import { ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const { showAlert } = useAlert();
  const styles = createStyles(theme, isRTL);
  
  const { data: user, isLoading: isFetching } = useGetMeQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadProfilePicture] = useUploadProfilePictureMutation();
  const token = useSelector(state => state.auth.token);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profile_picture: '',
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        profile_picture: user.profile_picture || '',
      });
    }
  }, [user]);

  const handleUpload = async (imageUri) => {
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type,
    });

    try {
      setIsUploading(true);
      const result = await uploadProfilePicture(formData).unwrap();
      return result.url;
    } catch (error) {
      console.error('Upload error:', error);
      showAlert({ 
        title: t('upload_failed'), 
        message: error.data?.detail || t('could_not_upload'), 
        type: "error" 
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const pickImage = async (useCamera = false) => {
    setIsModalVisible(false);
    
    const permissionResult = useCamera 
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      showAlert({ title: t('permission_denied'), message: t('camera_gallery_permission'), type: "error" });
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 })
      : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });

    if (!result.canceled) {
      const uploadedUrl = await handleUpload(result.assets[0].uri);
      if (uploadedUrl) {
        setFormData({ ...formData, profile_picture: uploadedUrl });
        showAlert({
          title: t('profile_picture_updated'),
          message: t('profile_picture_success_msg'),
          type: "success"
        });
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      showAlert({ title: t('error'), message: t('name_cannot_empty'), type: "error" });
      return;
    }

    try {
      await updateProfile({
        full_name: formData.name,
        phone: formData.phone,
        profile_picture: formData.profile_picture,
      }).unwrap();

      showAlert({
        title: t('success'),
        message: t('profile_updated_success'),
        type: "success"
      });
      navigation.goBack();
    } catch (error) {
      showAlert({
        title: t('update_failed'),
        message: error.data?.detail || t('something_went_wrong'),
        type: "error"
      });
    }
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
          <TouchableOpacity onPress={handleSave} disabled={isUpdating}>
            {isUpdating ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <Text style={styles.saveText}>{t('save')}</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.imageSection}>
            <TouchableOpacity 
              style={styles.imageContainer} 
              onPress={() => setIsModalVisible(true)}
              disabled={isUploading}
            >
              <View style={styles.placeholderImage}>
                {isUploading ? (
                  <ActivityIndicator color={colors.primary} size="large" />
                ) : formData.profile_picture ? (
                  <Image source={{ uri: formData.profile_picture }} style={styles.profileImage} />
                ) : (
                  <User color={colors.primary} size={60} />
                )}
              </View>
              <View style={styles.cameraButton}>
                <Camera color={colors.background} size={20} />
              </View>
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{t('update_profile_picture')}</Text>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <X color={colors.text} size={24} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalOptions}>
                  <TouchableOpacity style={styles.modalOption} onPress={() => pickImage(true)}>
                    <View style={[styles.optionIcon, { backgroundColor: colors.primary + '20' }]}>
                      <Camera color={colors.primary} size={24} />
                    </View>
                    <Text style={styles.optionText}>{t('take_photo')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.modalOption} onPress={() => pickImage(false)}>
                    <View style={[styles.optionIcon, { backgroundColor: colors.success + '20' }]}>
                      <ImageIcon color={colors.success} size={24} />
                    </View>
                    <Text style={styles.optionText}>{t('choose_from_gallery')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <View style={styles.form}>
            <Text style={styles.label}>{t('full_name')}</Text>
            <View style={styles.inputGroup}>
              <User color={colors.textMuted} size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder={t('enter_your_name')}
                placeholderTextColor={colors.textMuted}
                textAlign={isRTL ? 'right' : 'left'}
              />
            </View>

            <Text style={styles.label}>{t('email')}</Text>
            <View style={[styles.inputGroup, { opacity: 0.7, backgroundColor: colors.background }]}>
              <Mail color={colors.textMuted} size={20} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.textMuted }]}
                value={formData.email}
                editable={false}
                placeholder={t('enter_your_email')}
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
                placeholder={t('enter_your_phone')}
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
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    modalTitle: {
      ...typography.h2,
      color: colors.text,
    },
    modalOptions: {
      flexDirection,
      justifyContent: 'space-around',
      marginBottom: spacing.l,
    },
    modalOption: {
      alignItems: 'center',
    },
    optionIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.s,
    },
    optionText: {
      ...typography.body,
      color: colors.text,
      fontWeight: '600',
    },
  });
};

export default EditProfileScreen;
