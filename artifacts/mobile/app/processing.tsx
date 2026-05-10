import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AIProcessingLoader } from "@/components/AIProcessingLoader";
import { useAppStore } from "@/store/appStore";
import { getRandomBabyImageIndex } from "@/constants/babyImages";

const STAGES = [
  "Detecting facial features...",
  "Analyzing genetic markers...",
  "Blending facial structures...",
  "Predicting inherited traits...",
  "Generating your future baby...",
  "Adding final touches...",
];

const TOTAL_DURATION = 7000;

export default function Processing() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { motherPhoto, fatherPhoto, gender, ageGroup, addGeneration, setCurrentGeneration } =
    useAppStore();

  useEffect(() => {
    const stageInterval = Math.floor(TOTAL_DURATION / STAGES.length);
    let stageIndex = 0;

    const stageTimer = setInterval(() => {
      stageIndex += 1;
      if (stageIndex < STAGES.length) {
        setStage(stageIndex);
      } else {
        clearInterval(stageTimer);
      }
    }, stageInterval);

    let progressValue = 0;
    const progressTimer = setInterval(() => {
      progressValue += 1;
      setProgress(progressValue);
      if (progressValue >= 100) {
        clearInterval(progressTimer);
      }
    }, TOTAL_DURATION / 100);

    const completeTimer = setTimeout(() => {
      const generation = {
        id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
        motherPhoto,
        fatherPhoto,
        resultImageIndex: getRandomBabyImageIndex(),
        gender,
        ageGroup,
        timestamp: Date.now(),
        isHD: false,
      };
      addGeneration(generation);
      setCurrentGeneration(generation);
      router.replace("/result");
    }, TOTAL_DURATION);

    return () => {
      clearInterval(stageTimer);
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: topPad, paddingBottom: bottomPad }]}>
      <LinearGradient
        colors={["#0F0520", "#1A0533", "#2D1060"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.particles}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Animated.View
            key={i}
            entering={FadeIn.duration(600).delay(i * 80)}
            style={[
              styles.particle,
              {
                left: `${(i * 8.33) % 100}%`,
                top: `${(i * 13.5) % 100}%`,
                width: 3 + (i % 3) * 2,
                height: 3 + (i % 3) * 2,
                opacity: 0.15 + (i % 4) * 0.1,
              },
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
        <Feather name="x" size={22} color="rgba(255,255,255,0.5)" />
      </TouchableOpacity>

      <Animated.View entering={FadeInDown.duration(600)} style={styles.content}>
        <View style={styles.badge}>
          <Feather name="cpu" size={13} color="#A78BFA" />
          <Text style={styles.badgeText}>AI PROCESSING</Text>
        </View>

        <Text style={styles.title}>Creating Your{"\n"}Future Baby</Text>

        <View style={styles.loaderWrapper}>
          <AIProcessingLoader size={220} />
        </View>

        <Animated.Text key={stage} entering={FadeIn.duration(300)} style={styles.stageText}>
          {STAGES[stage]}
        </Animated.Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressPercent}>{progress}%</Text>
        </View>

        <View style={styles.hintContainer}>
          <Feather name="lock" size={12} color="rgba(255,255,255,0.3)" />
          <Text style={styles.hint}>Your photos are processed securely and never stored</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  particles: { position: "absolute", inset: 0 },
  particle: {
    position: "absolute",
    borderRadius: 10,
    backgroundColor: "#A78BFA",
  },
  cancelBtn: {
    position: "absolute",
    top: 60,
    right: 24,
    padding: 8,
    zIndex: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    width: "100%",
    gap: 20,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(167,139,250,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.25)",
  },
  badgeText: {
    color: "#A78BFA",
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 38,
  },
  loaderWrapper: {
    marginVertical: 8,
  },
  stageText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  progressContainer: {
    width: "100%",
    gap: 8,
    alignItems: "center",
  },
  progressTrack: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8B5CF6",
    borderRadius: 2,
  },
  progressPercent: {
    color: "rgba(255,255,255,0.4)",
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  hintContainer: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    marginTop: 8,
  },
  hint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.3)",
  },
});
