import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInRight } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const ONBOARDING_KEY = "@futurebaby_onboarding";
const { width } = Dimensions.get("window");

const SLIDES = [
  {
    icon: "upload-cloud" as const,
    accent: "#8B5CF6",
    accentLight: "#EDE9FE",
    title: "Upload Your Photos",
    subtitle:
      "Simply upload a photo of both parents. Our AI does the rest — no special setup needed.",
    features: ["Clear face photo", "Any angle works", "Private & secure"],
  },
  {
    icon: "cpu" as const,
    accent: "#7C3AED",
    accentLight: "#DDD6FE",
    title: "AI Facial Analysis",
    subtitle:
      "Advanced neural networks analyze facial features, genetics, and characteristics from both parents.",
    features: ["Face similarity detection", "Smart feature blending", "Ethnicity balancing"],
  },
  {
    icon: "star" as const,
    accent: "#6D28D9",
    accentLight: "#C4B5FD",
    title: "See Your Future Baby",
    subtitle:
      "Generate realistic predictions for different ages and genders. Save and share with family.",
    features: ["Multiple age predictions", "Boy, girl or surprise", "HD quality images"],
  },
];

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (current < SLIDES.length - 1) {
      const next = current + 1;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setCurrent(next);
    } else {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      router.replace("/(tabs)");
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <LinearGradient colors={["#FAF7FF", "#EDE9FE"]} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <Text style={styles.logo}>FutureBaby AI</Text>
        {current < SLIDES.length - 1 && (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.slider}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <Animated.View
              entering={i === current ? FadeIn.duration(400) : undefined}
              style={[styles.illustrationContainer, { backgroundColor: slide.accentLight }]}
            >
              <View style={[styles.iconCircle, { backgroundColor: slide.accent }]}>
                <Feather name={slide.icon} size={40} color="#FFFFFF" />
              </View>
              <View style={[styles.orbitDot, styles.orbitDot1, { backgroundColor: slide.accent }]} />
              <View style={[styles.orbitDot, styles.orbitDot2, { backgroundColor: slide.accentLight, borderWidth: 2, borderColor: slide.accent }]} />
              <View style={[styles.orbitDot, styles.orbitDot3, { backgroundColor: slide.accent }]} />
            </Animated.View>

            <Animated.View
              entering={i === current ? FadeInRight.duration(400).delay(100) : undefined}
              style={styles.textContainer}
            >
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>

              <View style={styles.features}>
                {slide.features.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <View style={[styles.featureDot, { backgroundColor: slide.accent }]} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottomPad + 24 }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === current ? "#8B5CF6" : "#D1D5DB", width: i === current ? 24 : 8 },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleNext} activeOpacity={0.9} style={styles.nextBtn}>
          <LinearGradient
            colors={["#8B5CF6", "#7C3AED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextGradient}
          >
            <Text style={styles.nextLabel}>
              {current === SLIDES.length - 1 ? "Get Started" : "Next"}
            </Text>
            <Feather name="arrow-right" size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  logo: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#8B5CF6" },
  skip: { fontSize: 15, fontFamily: "Inter_500Medium", color: "#9CA3AF" },
  slider: { flex: 1 },
  slide: { paddingHorizontal: 24, alignItems: "center" },
  illustrationContainer: {
    width: width - 48,
    height: (width - 48) * 0.75,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 36,
    position: "relative",
    overflow: "hidden",
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  orbitDot: { position: "absolute", width: 14, height: 14, borderRadius: 7 },
  orbitDot1: { top: "15%", right: "15%" },
  orbitDot2: { bottom: "20%", left: "15%", width: 20, height: 20, borderRadius: 10 },
  orbitDot3: { top: "25%", left: "20%", width: 8, height: 8, borderRadius: 4, opacity: 0.6 },
  textContainer: { width: "100%", gap: 12 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", color: "#1A1A2E", lineHeight: 36 },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", color: "#6B7280", lineHeight: 24 },
  features: { gap: 10, marginTop: 8 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  featureDot: { width: 6, height: 6, borderRadius: 3 },
  featureText: { fontSize: 14, fontFamily: "Inter_500Medium", color: "#374151" },
  footer: { paddingHorizontal: 24, gap: 20 },
  dots: { flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center" },
  dot: { height: 8, borderRadius: 4 },
  nextBtn: { borderRadius: 16, overflow: "hidden" },
  nextGradient: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextLabel: { color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: 17 },
});
