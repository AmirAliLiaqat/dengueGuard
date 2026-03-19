import React, { useState, useEffect } from "react";
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
  useDeleteAdminDoctorMutation,
  useGetAdminDoctorsQuery,
  useUpdateAdminDoctorMutation,
  useUploadDoctorPictureMutation,
} from "../services/api";
import { useAlert } from "../context/AlertContext";
import { createStyles } from "../styles/ProfileScreen.styles";

const AdminDoctorDetailScreen = ({ route, navigation }) => {
  const { doctorId } = route.params || {};
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const { showAlert } = useAlert();
  const styles = createStyles(theme, isRTL);
  const { colors, spacing } = theme;
  const insets = useSafeAreaInsets();

  const { data: doctors = [] } = useGetAdminDoctorsQuery();
  const [updateDoctor] = useUpdateAdminDoctorMutation();
  const [deleteDoctor] = useDeleteAdminDoctorMutation();
  const [uploadDoctorPicture] = useUploadDoctorPictureMutation();

  const doctor = doctors.find((d) => d.id === doctorId);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [localImageUri, setLocalImageUri] = useState(null);
  const [bio, setBio] = useState("");
  const [dengue_expertise, setExpertise] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!doctor) return;
    setName(doctor.name || "");
    setAge(doctor.age ? String(doctor.age) : "");
    setPictureUrl(doctor.picture_url || "");
    setLocalImageUri(null);
    setBio(doctor.bio || "");
    setExpertise(doctor.dengue_expertise || "");
  }, [doctor]);

  const displayImageUri = localImageUri || pictureUrl || null;

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
    if (!localImageUri) return pictureUrl || null;
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
    return res?.url || pictureUrl || null;
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
      let finalUrl = pictureUrl || null;
      if (localImageUri) {
        setUploading(true);
        try {
          finalUrl = await uploadImageIfNeeded();
        } finally {
          setUploading(false);
        }
      }
      await updateDoctor({
        id: doctorId,
        name: name.trim(),
        age: age ? Number(age) : null,
        picture_url: finalUrl,
        bio: bio.trim() || null,
        dengue_expertise: dengue_expertise.trim() || null,
      }).unwrap();
      setLocalImageUri(null);
      if (finalUrl) setPictureUrl(finalUrl);
      showAlert({
        title: t("success") || "Success",
        message: t("saved") || "Saved.",
        type: "success",
      });
    } catch (err) {
      showAlert({
        title: t("error"),
        message:
          err?.data?.detail ||
          err?.error ||
          t("something_went_wrong") ||
          "Could not save.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    try {
      await deleteDoctor(doctorId).unwrap();
      navigation.goBack();
    } catch (err) {
      showAlert({
        title: t("error"),
        message: err?.data?.detail || t("something_went_wrong") || "Delete failed",
        type: "error",
      });
    }
  };

  if (!doctor) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.textMuted }}>{t("loading") || "Loading…"}</Text>
      </SafeAreaView>
    );
  }

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
          {t("edit") || "Edit"} {t("doctor_panel") || "Doctor"}
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
          <Text style={styles.sectionTitle}>{t("update_profile_picture") || "Photo"}</Text>
          <TouchableOpacity onPress={pickFromGallery} style={{ alignSelf: "center", marginBottom: spacing.m }}>
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
              {displayImageUri ? (
                <Image source={{ uri: displayImageUri }} style={{ width: 120, height: 120 }} />
              ) : (
                <ImageIcon color={colors.primary} size={40} />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickFromGallery} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{t("choose_from_gallery")}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSectionCard}>
          <TextInput
            style={styles.profileInput}
            placeholder={t("name") || "Name"}
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
            value={dengue_expertise}
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

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.error, marginTop: spacing.m }]}
          onPress={onDelete}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>
            {t("delete") || "Delete"} {t("doctor_panel") || "Doctor"}
          </Text>
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AdminDoctorDetailScreen;
