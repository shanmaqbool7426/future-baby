import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { UploadCard } from "@/components/UploadCard";
import { PremiumButton } from "@/components/PremiumButton";
import { PremiumModal } from "@/components/PremiumModal";
import { useColors } from "@/hooks/useColors";
import { useAppStore, type Gender, type AgeGroup } from "@/store/appStore";
import { BABY_IMAGES } from "@/constants/babyImages";
import { Image } from "react-native";

const GENDER_OPTIONS: { id: Gender; label: string; icon: string }[] = [
  { id: "boy", label: "Boy", icon: "👦" },
  { id: "girl", label: "Girl", icon: "👧" },
  { id: "surprise", label: "Surprise", icon: "✦" },
];

const AGE_OPTIONS: { id: AgeGroup; label: string }[] = [
  { id: "baby", label: "Baby" },
  { id: "toddler", label: "Toddler" },
  { id: "child", label: "Child" },
  { id: "teen", label: "Teen" },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const colors = useColors();
  const [showPremium, setShowPremium] = useState(false);

  const {
    motherPhoto,
    fatherPhoto,
    gender,
    ageGroup,
    generations,
    isPremium,
    setMotherPhoto,
    setFatherPhoto,
    setGender,
    setAgeGroup,
  } = useAppStore();

  const canGenerate = !!motherPhoto && !!fatherPhoto;

  const handleGenerate = () => {
    if (!canGenerate) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push("/processing");
  };

  const recentGenerations = generations.slice(0, 4);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 8, paddingBottom: bottomPad + 90 },
        ]}
      >
        <Animated.View entering={FadeInDown.duration(400)} style={styles.headerSection}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.greeting}>Create Your</Text>
              <Text style={styles.title}>Future Baby ✦</Text>
            </View>
            {!isPremium && (
              <TouchableOpacity
                onPress={() => setShowPremium(true)}
                style={styles.premiumBadge}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#8B5CF6", "#7C3AED"]}
                  style={styles.premiumBadgeGradient}
                >
                  <Feather name="star" size={12} color="#F6E7B2" />
                  <Text style={styles.premiumBadgeText}>Premium</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.subtitle}>
            Upload both parents' photos and AI will generate a realistic prediction of your future child
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(80)} style={styles.uploadSection}>
          <Text style={styles.sectionLabel}>Parent Photos</Text>
          <View style={styles.uploadRow}>
            <UploadCard
              label="Mother"
              subtitle="Tap to upload"
              icon="camera"
              photo={motherPhoto}
              onPhotoSelected={setMotherPhoto}
              onRemove={() => setMotherPhoto(null)}
              style={{ flex: 1 }}
            />
            <View style={styles.uploadDivider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <View style={[styles.plusCircle, { backgroundColor: colors.purple100 }]}>
                <Feather name="plus" size={16} color={colors.primary} />
              </View>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>
            <UploadCard
              label="Father"
              subtitle="Tap to upload"
              icon="camera"
              photo={fatherPhoto}
              onPhotoSelected={setFatherPhoto}
              onRemove={() => setFatherPhoto(null)}
              style={{ flex: 1 }}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(140)} style={styles.section}>
          <Text style={styles.sectionLabel}>Baby Gender</Text>
          <View style={styles.optionRow}>
            {GENDER_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setGender(opt.id);
                }}
                activeOpacity={0.85}
                style={[
                  styles.optionBtn,
                  {
                    backgroundColor:
                      gender === opt.id ? colors.primary : colors.gray,
                    borderColor:
                      gender === opt.id ? colors.primary : "transparent",
                  },
                ]}
              >
                <Text style={styles.optionEmoji}>{opt.icon}</Text>
                <Text
                  style={[
                    styles.optionText,
                    { color: gender === opt.id ? "#fff" : colors.darkText },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(180)} style={styles.section}>
          <Text style={styles.sectionLabel}>Age Prediction</Text>
          <View style={styles.optionRow}>
            {AGE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setAgeGroup(opt.id);
                }}
                activeOpacity={0.85}
                style={[
                  styles.ageBtn,
                  {
                    backgroundColor:
                      ageGroup === opt.id ? colors.purple100 : colors.gray,
                    borderColor:
                      ageGroup === opt.id ? colors.primary : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.ageBtnText,
                    {
                      color:
                        ageGroup === opt.id ? colors.primary : colors.subtleText,
                      fontFamily:
                        ageGroup === opt.id
                          ? "Inter_600SemiBold"
                          : "Inter_400Regular",
                    },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {!canGenerate && (
          <Animated.View
            entering={FadeInDown.duration(400).delay(220)}
            style={styles.tipCard}
          >
            <Feather name="info" size={15} color={colors.primary} />
            <Text style={styles.tipText}>
              Upload both parent photos to generate your future baby
            </Text>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.duration(400).delay(260)}>
          <PremiumButton
            label={canGenerate ? "Generate Future Baby ✦" : "Upload Photos First"}
            onPress={handleGenerate}
            disabled={!canGenerate}
            style={{ marginHorizontal: 0 }}
          />
        </Animated.View>

        {recentGenerations.length > 0 && (
          <Animated.View
            entering={FadeInDown.duration(400).delay(300)}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Recent Predictions</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentRow}
            >
              {recentGenerations.map((gen) => (
                <TouchableOpacity
                  key={gen.id}
                  style={styles.recentCard}
                  activeOpacity={0.85}
                  onPress={() => {
                    useAppStore.getState().setCurrentGeneration(gen);
                    router.push("/result");
                  }}
                >
                  <Image
                    source={BABY_IMAGES[gen.resultImageIndex]}
                    style={styles.recentImage}
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.5)"]}
                    style={styles.recentOverlay}
                  >
                    <Text style={styles.recentLabel}>
                      {gen.gender === "surprise" ? "Surprise" : gen.gender === "boy" ? "Boy" : "Girl"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        <Animated.View
          entering={FadeInDown.duration(400).delay(320)}
          style={styles.tipsCard}
        >
          <View style={styles.tipsHeader}>
            <Feather name="zap" size={16} color="#8B5CF6" />
            <Text style={styles.tipsTitle}>AI Tips for Best Results</Text>
          </View>
          {[
            "Use a clear front-facing photo",
            "Good lighting improves accuracy",
            "Avoid sunglasses or hats",
          ].map((tip) => (
            <View key={tip} style={styles.tipRow}>
              <View style={[styles.tipDot, { backgroundColor: colors.lavender }]} />
              <Text style={styles.tipRowText}>{tip}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      <PremiumModal visible={showPremium} onClose={() => setShowPremium(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 20 },
  headerSection: { gap: 8 },
  topRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  greeting: { fontSize: 15, fontFamily: "Inter_400Regular", color: "#9CA3AF" },
  title: { fontSize: 30, fontFamily: "Inter_700Bold", color: "#1A1A2E", lineHeight: 36 },
  premiumBadge: { borderRadius: 20, overflow: "hidden", marginTop: 4 },
  premiumBadgeGradient: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6 },
  premiumBadgeText: { color: "#F6E7B2", fontFamily: "Inter_600SemiBold", fontSize: 12 },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", color: "#6B7280", lineHeight: 22 },
  uploadSection: { gap: 12 },
  uploadRow: { flexDirection: "row", alignItems: "center", gap: 0 },
  uploadDivider: { width: 40, alignItems: "center", gap: 6 },
  dividerLine: { flex: 1, width: 1 },
  plusCircle: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  section: { gap: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#1A1A2E" },
  seeAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  optionRow: { flexDirection: "row", gap: 10 },
  optionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1.5,
    gap: 4,
  },
  optionEmoji: { fontSize: 18 },
  optionText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  ageBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center", borderWidth: 1.5 },
  ageBtnText: { fontSize: 13 },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EDE9FE",
    padding: 14,
    borderRadius: 14,
  },
  tipText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", color: "#5B21B6", lineHeight: 18 },
  recentRow: { gap: 12 },
  recentCard: {
    width: 110,
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  recentImage: { width: "100%", height: "100%" },
  recentOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, height: 48, justifyContent: "flex-end", paddingHorizontal: 10, paddingBottom: 8 },
  recentLabel: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 12 },
  tipsCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 18, gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  tipsHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  tipsTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#1A1A2E" },
  tipRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  tipDot: { width: 5, height: 5, borderRadius: 2.5 },
  tipRowText: { fontSize: 13, fontFamily: "Inter_400Regular", color: "#6B7280" },
});
