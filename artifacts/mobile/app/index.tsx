import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useAppStore } from "@/store/appStore";

const ONBOARDING_KEY = "@futurebaby_onboarding";

export default function SplashEntry() {
  const loadGenerations = useAppStore((s) => s.loadGenerations);

  const glowScale = useSharedValue(0.9);
  const glowOpacity = useSharedValue(0.6);
  const logoScale = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withTiming(1, { duration: 600 });
    glowScale.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 1500 }), withTiming(0.9, { duration: 1500 })),
      -1,
      true
    );
    glowOpacity.value = withRepeat(
      withSequence(withTiming(0.9, { duration: 1500 }), withTiming(0.4, { duration: 1500 })),
      -1,
      true
    );

    const init = async () => {
      await loadGenerations();
      await new Promise((r) => setTimeout(r, 1800));
      const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (seen) {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboarding");
      }
    };
    init();
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#FAF7FF", "#EDE9FE"]} style={StyleSheet.absoluteFill} />

      <Animated.View style={[styles.glow, glowStyle]} />

      <Animated.View entering={FadeIn.duration(800)} style={[styles.logoContainer, logoStyle]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>✦</Text>
        </View>
        <Text style={styles.appName}>FutureBaby AI</Text>
        <Text style={styles.tagline}>See Your Future Child</Text>
      </Animated.View>

      <View style={styles.dotsContainer}>
        {[0, 1, 2].map((i) => (
          <BouncingDot key={i} delay={i * 200} />
        ))}
      </View>
    </View>
  );
}

function BouncingDot({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      translateY.value = withRepeat(
        withSequence(withTiming(-8, { duration: 400 }), withTiming(0, { duration: 400 })),
        -1,
        true
      );
    }, delay);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#8B5CF6", opacity: 0.6 }, style]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#8B5CF6",
    opacity: 0.08,
  },
  logoContainer: {
    alignItems: "center",
    gap: 12,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  logoEmoji: {
    fontSize: 36,
    color: "#FFFFFF",
  },
  appName: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#1A1A2E",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#9CA3AF",
    letterSpacing: 0.5,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 80,
    flexDirection: "row",
    gap: 8,
  },
});
