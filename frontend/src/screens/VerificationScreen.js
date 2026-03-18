import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { Mail, ArrowRight } from "lucide-react-native";
import { useAlert } from "../context/AlertContext";
import { useVerifyOtpMutation } from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { createStyles } from "../styles/VerificationScreen.styles";

const VerificationScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  const { t, isRTL } = useLanguage();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const { showAlert } = useAlert();

  const email = route.params?.email || "";
  const purpose = route.params?.purpose || "signup";

  const styles = createStyles(theme, isRTL);

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      showAlert({
        title: t("error"),
        message: t("enter_complete_code"),
        type: "error",
      });
      return;
    }

    try {
      const result = await verifyOtp({
        email,
        otp_code: otpString,
        purpose,
      }).unwrap();

      showAlert({
        title: t("success"),
        message: t("email_verified_success"),
        type: "success",
      });

      if (result.access_token) {
        dispatch(
          setCredentials({
            access_token: result.access_token,
            user: { email },
          }),
        );
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.log("Verification error details:", error);
      let errorMessage = t("invalid_code");

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
        title: t("verification_failed"),
        message: errorMessage,
        type: "error",
      });
    }
  };

  const handleOtpChange = (value, index) => {
    // Only allow numbers
    if (value && isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
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
            <View style={styles.iconContainer}>
              <Mail color={colors.primary} size={40} />
            </View>
            <Text style={styles.title}>{t("email_verification")}</Text>
            <Text style={styles.subtitle}>
              {t("verification_code_desc")}
              {"\n"}
              <Text style={{ color: colors.text, fontWeight: "bold" }}>
                {email}
              </Text>
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.otpInputsContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={inputRefs[index]}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  placeholder="-"
                  placeholderTextColor={colors.textMuted}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.verifyButton, isLoading && { opacity: 0.7 }]}
              onPress={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <>
                  <Text style={styles.verifyButtonText}>
                    {t("verify_continue")}
                  </Text>
                  <ArrowRight
                    color={colors.background}
                    size={20}
                    style={{
                      marginLeft: 8,
                      transform: [{ scaleX: isRTL ? -1 : 1 }],
                    }}
                  />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendButton}>
              <Text style={styles.resendText}>{t("did_not_receive_code")}</Text>
              <Text style={styles.resendLink}>{t("resend_code")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerificationScreen;
