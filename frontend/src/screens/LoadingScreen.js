import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "../context/ThemeContext";

/**
 * Stable screen component for auth bootstrap (avoids inline `component={() => ...}` warnings).
 */
const LoadingScreen = () => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default LoadingScreen;
