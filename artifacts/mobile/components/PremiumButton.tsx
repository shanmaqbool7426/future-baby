import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface PremiumButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  style?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function PremiumButton({
  label,
  onPress,
  disabled,
  loading,
  variant = "primary",
  style,
}: PremiumButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (disabled || loading) return;
    scale.value = withSpring(0.96, { damping: 15 }, () => {
      scale.value = withSpring(1, { damping: 15 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  if (variant === "outline") {
    return (
      <AnimatedTouchable
        style={[styles.outlineButton, style, animatedStyle]}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.85}
      >
        <Text style={styles.outlineLabel}>{label}</Text>
      </AnimatedTouchable>
    );
  }

  if (variant === "secondary") {
    return (
      <AnimatedTouchable
        style={[styles.secondaryButton, style, animatedStyle]}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.85}
      >
        <Text style={styles.secondaryLabel}>{label}</Text>
      </AnimatedTouchable>
    );
  }

  return (
    <AnimatedTouchable
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.9}
      style={[animatedStyle, style]}
    >
      <LinearGradient
        colors={
          disabled
            ? ["#D1D5DB", "#D1D5DB"]
            : ["#8B5CF6", "#7C3AED"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </LinearGradient>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  outlineButton: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#8B5CF6",
  },
  outlineLabel: {
    color: "#8B5CF6",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  secondaryButton: {
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  secondaryLabel: {
    color: "#4B5563",
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
});
