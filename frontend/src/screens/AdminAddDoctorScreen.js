import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react-native";
import {
  useCreateAdminDoctorMutation,
  useUploadDoctorPictureMutation,
} from "../services/api";
import { useAlert } from "../context/AlertContext";
import { createStyles } from "../styles/ProfileScreen.styles";

const AdminAddDoctorScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const { showAlert } = useAlert();
  const styles = createStyles(theme, isRTL);
  const { colors, spacing } = theme;
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState("");
  const [localImageUri, setLocalImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [uploadDoctorPicture] = useUploadDoctorPictureMutation();
  const [createDoctor] = useCreateAdminDoctorMutation();

  const pickFromGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      showAlert({
        title: t("permission_denied"),
        message: t("camera_gallery_permission"),
        type: "error",
      });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setLocalImageUri(result.assets[0].uri);
    }
  };

  const uploadImageIfNeeded = async () => {
    if (!localImageUri) return null;
    const filename = localImageUri.split("/").pop() || "doctor.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";
    const formData = new FormData();
    formData.append("file", {
      uri: localImageUri,
      name: filename,
      type,
    });
    const res = await uploadDoctorPicture(formData).unwrap();
    return res?.url || null;
  };

  const onSave = async () => {
    if (!name.trim()) {
      showAlert({
        title: t("error"),
        message: t("fill_all_fields") || "Please enter doctor name.",
        type: "error",
      });
      return;
    }
    setSaving(true);
    try {
      let pictureUrl = null;
      if (localImageUri) {
        setUploading(true);
        try {
          pictureUrl = await uploadImageIfNeeded();
        } finally {
          setUploading(false);
        }
      }
      await createDoctor({
        name: name.trim(),
        age: age ? Number(age) : null,
        picture_url: pictureUrl,
        bio: bio.trim() || null,
        dengue_expertise: expertise.trim() || null,
      }).unwrap();
      navigation.goBack();
    } catch (err) {
      showAlert({
        title: t("upload_failed") || t("error"),
        message:
          err?.data?.detail ||
          err?.error ||
          t("something_went_wrong") ||
          "Could not save doctor.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing.l,
          paddingTop: spacing.m,
          paddingBottom: spacing.s,
          borderBottomWidth: 1,
          borderBottomColor: colors.glassBorder,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          {isRTL ? (
            <ChevronRight color={colors.text} size={24} />
          ) : (
            <ChevronLeft color={colors.text} size={24} />
          )}
        </TouchableOpacity>
        <Text style={{ ...theme.typography.h2, color: colors.text, flex: 1, textAlign: "center" }}>
          {t("add_doctor") || `${t("add")} ${t("doctor_panel") || "Doctor"}`}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 8 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: spacing.xl + 120 },
          ]}
        >
        <View style={styles.formSectionCard}>
          <Text style={styles.sectionTitle}>Photo</Text>
          <TouchableOpacity
            onPress={pickFromGallery}
            style={{
              alignSelf: "center",
              marginBottom: spacing.m,
            }}
          >
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: colors.glass,
                borderWidth: 2,
                borderColor: colors.glassBorder,
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {localImageUri ? (
                <Image
                  source={{ uri: localImageUri }}
                  style={{ width: 120, height: 120 }}
                />
              ) : (
                <ImageIcon color={colors.primary} size={40} />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickFromGallery} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              {t("choose_from_gallery")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSectionCard}>
          <TextInput
            style={styles.profileInput}
            placeholder={t("name") || "Doctor name"}
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.textMuted}
            textAlign={isRTL ? "right" : "left"}
          />
          <TextInput
            style={styles.profileInput}
            placeholder={t("age") || "Age"}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            placeholderTextColor={colors.textMuted}
            textAlign={isRTL ? "right" : "left"}
          />
          <TextInput
            style={[styles.profileInput, { minHeight: 80 }]}
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            multiline
            placeholderTextColor={colors.textMuted}
            textAlign={isRTL ? "right" : "left"}
          />
          <TextInput
            style={[styles.profileInput, { minHeight: 80 }]}
            placeholder="Dengue expertise / perception"
            value={expertise}
            onChangeText={setExpertise}
            multiline
            placeholderTextColor={colors.textMuted}
            textAlign={isRTL ? "right" : "left"}
          />
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, (saving || uploading) && { opacity: 0.7 }]}
          onPress={onSave}
          disabled={saving || uploading}
        >
          {saving || uploading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.primaryButtonText}>{t("save")}</Text>
          )}
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AdminAddDoctorScreen;
