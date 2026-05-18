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
import { Mail, Lock, Eye, EyeOff, Fingerprint, User } from "lucide-react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useAlert } from "../context/AlertContext";
import { useLoginMutation } from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { createStyles } from "../styles/LoginScreen.styles";

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [hasStoredCredentials, setHasStoredCredentials] = useState(false);

  React.useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const storedEmail = await SecureStore.getItemAsync("user_email");
    const storedPass = await SecureStore.getItemAsync("user_password");

    setIsBiometricSupported(hasHardware && isEnrolled);
    setHasStoredCredentials(!!(storedEmail && storedPass));
  };

  const handleBiometricLogin = async () => {
    try {
      const storedEmail = await SecureStore.getItemAsync("user_email");
      const storedPass = await SecureStore.getItemAsync("user_password");

      if (!storedEmail || !storedPass) {
        showAlert({
          title: t("biometric_setup_required"),
          message: t("biometric_setup_required_desc"),
          type: "warning",
        });
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t("biometric_access"),
        fallbackLabel: t("use_password"),
      });

      if (result.success) {
        // Fill form and trigger login
        setEmail(storedEmail);
        setPassword(storedPass);

        const loginResult = await login({
          email: storedEmail,
          password: storedPass,
        }).unwrap();
        dispatch(
          setCredentials({
            access_token: loginResult.access_token,
            user: { email: storedEmail },
          }),
        );
      }
    } catch (error) {
      console.error("Biometric Login Error:", error);
    }
  };

  const styles = createStyles(theme, isRTL);

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert({
        title: t("error"),
        message: t("enter_email_password"),
        type: "error",
      });
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();

      // After login, we need to fetch user profile to populate Redux
      // But for now, we'll store the token and navigate.
      // Ideally, the backend should return user info with token.
      dispatch(
        setCredentials({
          access_token: result.access_token,
          user: { email }, // Placeholder, will be updated by getMe
        }),
      );
    } catch (error) {
      if (error.status === 401) {
        showAlert({
          title: t("not_verified"),
          message: t("verify_email_first"),
          type: "warning",
          buttons: [
            {
              text: t("verify_now"),
              onPress: () => navigation.navigate("Verification", { email }),
            },
            { text: t("cancel"), style: "cancel" },
          ],
        });
      } else {
        console.log("Login error details:", error);
        let errorMessage = t("invalid_credentials");

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
          title: t("login_failed"),
          message: errorMessage,
          type: "error",
        });
      }
    }
  };

  const handleDemoLogin = async () => {
    const demoEmail = "tester@dengueguard.com";
    const demoPassword = "Tester123!";
    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      const result = await login({ email: demoEmail, password: demoPassword }).unwrap();
      dispatch(
        setCredentials({
          access_token: result.access_token,
          user: { email: demoEmail },
        }),
      );
    } catch (error) {
      console.log("Demo Login error details:", error);
      let errorMessage = t("invalid_credentials");

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
        title: t("login_failed"),
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
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/icon.png")}
                style={styles.appLogo}
              />
            </View>
            <Text style={styles.title}>{t("welcome_back")}</Text>
            <Text style={styles.subtitle}>{t("login_subtitle")}</Text>
          </View>

          <View style={styles.form}>
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
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
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
                  value={password}
                  onChangeText={setPassword}
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

            {/* <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>{t('forgot_password')}</Text>
            </TouchableOpacity> */}

            <View style={styles.loginActions}>
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && { opacity: 0.8 },
                  isBiometricSupported &&
                    hasStoredCredentials &&
                    styles.loginButtonWithBiometric,
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text style={styles.loginButtonText}>{t("login_btn")}</Text>
                )}
              </TouchableOpacity>

              {isBiometricSupported && (
                <TouchableOpacity
                  style={styles.biometricButton}
                  onPress={handleBiometricLogin}
                  disabled={isLoading}
                >
                  <Fingerprint color={colors.primary} size={32} />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[styles.demoButton, isLoading && { opacity: 0.8 }]}
              onPress={handleDemoLogin}
              disabled={isLoading}
            >
              <User color={colors.primary} size={20} style={styles.demoIcon} />
              <Text style={styles.demoButtonText}>{t("demo_login")}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t("no_account")}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.signupText}>{t("signup_btn")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
