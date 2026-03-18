import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  Mail,
  Lock,
  User,
  Phone,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { useAlert } from "../context/AlertContext";

import { useSignupMutation } from "../services/api";
import { createStyles } from "../styles/SignupScreen.styles";

const SignupScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const [signup, { isLoading }] = useSignupMutation();
  const { showAlert } = useAlert();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const styles = createStyles(theme, isRTL);

  const handleSignup = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      showAlert({
        title: t("error"),
        message: t("fill_all_fields"),
        type: "error",
      });
      return;
    }

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        phone: formData.phone,
      }).unwrap();

      navigation.navigate("Verification", { email: formData.email });
    } catch (error) {
      console.log("Signup error details:", error);
      let errorMessage = t("something_went_wrong");

      if (error.data?.detail) {
        if (Array.isArray(error.data.detail)) {
          errorMessage = error.data.detail.map((err) => err.msg).join(", ");
        } else {
          errorMessage = error.data.detail;
        }
      } else if (error.error) {
        errorMessage = t("network_server_error");
      } else if (error.status === "FETCH_ERROR") {
        errorMessage = t("server_unreachable");
      }

      showAlert({
        title: t("signup_failed"),
        message: errorMessage,
        type: "error",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/icon.png")}
                style={styles.appLogo}
              />
            </View>
            <Text style={styles.title}>{t("signup_btn")}</Text>
            <Text style={styles.subtitle}>{t("signup_subtitle")}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("name")}</Text>
              <View style={styles.inputWrapper}>
                <User
                  color={colors.textMuted}
                  size={20}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={t("full_name")}
                  placeholderTextColor={colors.textMuted}
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                  textAlign={isRTL ? "right" : "left"}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("email")}</Text>
              <View style={styles.inputWrapper}>
                <Mail
                  color={colors.textMuted}
                  size={20}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor={colors.textMuted}
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textAlign={isRTL ? "right" : "left"}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("phone_number")}</Text>
              <View style={styles.inputWrapper}>
                <Phone
                  color={colors.textMuted}
                  size={20}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="+1 234 567 890"
                  placeholderTextColor={colors.textMuted}
                  value={formData.phone}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phone: text })
                  }
                  keyboardType="phone-pad"
                  textAlign={isRTL ? "right" : "left"}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("password")}</Text>
              <View style={styles.inputWrapper}>
                <Lock
                  color={colors.textMuted}
                  size={20}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  value={formData.password}
                  onChangeText={(text) =>
                    setFormData({ ...formData, password: text })
                  }
                  secureTextEntry={!showPassword}
                  textAlign={isRTL ? "right" : "left"}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff color={colors.textMuted} size={20} />
                  ) : (
                    <Eye color={colors.textMuted} size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.signupButton, isLoading && { opacity: 0.8 }]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.signupButtonText}>{t("signup_btn")}</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t("have_account")}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginText}>{t("login_btn")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
