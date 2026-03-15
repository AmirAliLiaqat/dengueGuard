import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  X
} from 'lucide-react-native';
import { useAlert } from '../context/AlertContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const CustomAlert = () => {
  const { alertConfig, hideAlert } = useAlert();
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (alertConfig) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [alertConfig]);

  if (!alertConfig) return null;

  const { title, message, type, buttons } = alertConfig;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 color={colors.success} size={48} />;
      case 'error':
        return <AlertCircle color={colors.error} size={48} />;
      case 'warning':
        return <AlertTriangle color={colors.warning} size={48} />;
      default:
        return <Info color={colors.primary} size={48} />;
    }
  };

  const getHeaderColor = () => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  const handleButtonPress = (onPress) => {
    hideAlert();
    if (onPress) onPress();
  };

  return (
    <Modal
      transparent
      visible={!!alertConfig}
      animationType="none"
      onRequestClose={hideAlert}
    >
      <View style={styles.overlay}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint={theme.isDark ? 'dark' : 'light'} />
        ) : (
          <View style={[styles.backdrop, { backgroundColor: theme.isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]} />
        )}
        
        <Animated.View
          style={[
            styles.alertContainer,
            {
              backgroundColor: colors.card,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              borderColor: colors.glassBorder,
            },
          ]}
        >
          <View style={[styles.headerIcon, { backgroundColor: getHeaderColor() + '1A' }]}>
            {getIcon()}
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>

          <View style={styles.buttonContainer}>
            {buttons && buttons.length > 0 ? (
              buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    { 
                      backgroundColor: button.style === 'cancel' ? colors.glass : getHeaderColor(),
                      flex: buttons.length > 1 ? 1 : 0,
                      minWidth: buttons.length === 1 ? 120 : 0,
                      marginHorizontal: buttons.length > 1 ? 5 : 0,
                    },
                  ]}
                  onPress={() => handleButtonPress(button.onPress)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { color: button.style === 'cancel' ? colors.text : colors.background },
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: getHeaderColor(), minWidth: 120 }]}
                onPress={hideAlert}
              >
                <Text style={[styles.buttonText, { color: colors.background }]}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  alertContainer: {
    width: width * 0.85,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomAlert;
