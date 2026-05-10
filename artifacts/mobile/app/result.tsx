import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { BABY_IMAGES, getRandomBabyImageIndex } from "@/constants/babyImages";
import { PremiumModal } from "@/components/PremiumModal";
import { useAppStore } from "@/store/appStore";

const AGE_LABELS: Record<string, string> = {
  baby: "0-12 months",
  toddler: "1-3 years",
  child: "4-10 years",
  teen: "11-17 years",
};

const GENDER_LABELS: Record<string, string> = {
  boy: "Boy",
  girl: "Girl",
  surprise: "Surprise",
};

export default function Result() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [showPremium, setShowPremium] = useState(false);

  const { currentGeneration, isPremium, setCurrentGeneration, addGeneration } = useAppStore();

  if (!currentGeneration) {
    router.replace("/(tabs)");
    return null;
  }

  const image = BABY_IMAGES[currentGeneration.resultImageIndex];

  const handleSave = async () => {
    if (!isPremium) {
      setShowPremium(true);
      return;
    }
    if (Platform.OS === "web") {
      Alert.alert("Save", "Saving is available on mobile devices.");
      return;
    }
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow access to save photos to your library.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Saved!", "Your baby prediction has been saved to your photo library.");
  };

  const handleShare = () => {
    if (!isPremium) {
      setShowPremium(true);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Share", "Sharing will be available on the next update.");
  };

  const handleRegenerate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newGen = {
      ...currentGeneration,
      id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
      resultImageIndex: getRandomBabyImageIndex(),
      timestamp: Date.now(),
    };
    addGeneration(newGen);
    setCurrentGeneration(newGen);
  };

  const handleBack = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <LinearGradient colors={["#FAF7FF", "#EDE9FE", "#FAF7FF"]} style={StyleSheet.absoluteFill} />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Feather name="x" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Future Baby</Text>
        {!isPremium && (
          <TouchableOpacity onPress={() => setShowPremium(true)} style={styles.premiumHeaderBtn}>
            <Feather name="star" size={14} color="#8B5CF6" />
            <Text style={styles.premiumHeaderText}>Pro</Text>
          </TouchableOpacity>
        )}
        {isPremium && <View style={{ width: 60 }} />}
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
      >
        <Animated.View entering={FadeIn.duration(500).delay(100)} style={styles.imageCard}>
          <Image source={image} style={styles.babyImage} resizeMode="cover" />

          <View style={styles.imageTags}>
            <View style={styles.tag}>
              <Feather name="award" size={12} color="#8B5CF6" />
              <Text style={styles.tagText}>AI Generated</Text>
            </View>
            {isPremium && (
              <View style={[styles.tag, styles.hdTag]}>
                <Text style={styles.hdTagText}>HD</Text>
              </View>
            )}
          </View>

          {!isPremium && (
            <View style={styles.premiumOverlay}>
              <LinearGradient
                colors={["transparent", "rgba(139,92,246,0.85)"]}
                style={styles.overlayGradient}
              >
                <Feather name="lock" size={28} color="#fff" />
                <Text style={styles.overlayTitle}>Unlock HD Quality</Text>
                <TouchableOpacity
                  onPress={() => setShowPremium(true)}
                  style={styles.overlayBtn}
                  activeOpacity={0.9}
                >
                  <Text style={styles.overlayBtnText}>Upgrade to Premium</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(200)} style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{GENDER_LABELS[currentGeneration.gender]}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{AGE_LABELS[currentGeneration.ageGroup]}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Quality</Text>
              <Text style={[styles.infoValue, { color: "#8B5CF6" }]}>
                {isPremium ? "HD" : "Standard"}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(300)} style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleSave} activeOpacity={0.85}>
            <View style={[styles.actionIcon, { backgroundColor: "#EDE9FE" }]}>
              <Feather name="download" size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.actionLabel}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleShare} activeOpacity={0.85}>
            <View style={[styles.actionIcon, { backgroundColor: "#EDE9FE" }]}>
              <Feather name="share-2" size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.actionLabel}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleRegenerate} activeOpacity={0.85}>
            <View style={[styles.actionIcon, { backgroundColor: "#F3F4F6" }]}>
              <Feather name="refresh-cw" size={20} color="#6B7280" />
            </View>
            <Text style={styles.actionLabel}>Regenerate</Text>
          </TouchableOpacity>
        </Animated.View>

        {!isPremium && (
          <Animated.View entering={FadeInUp.duration(400).delay(400)}>
            <TouchableOpacity
              onPress={() => setShowPremium(true)}
              activeOpacity={0.9}
              style={styles.premiumBanner}
            >
              <LinearGradient
                colors={["#1A0533", "#2D1060"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.premiumBannerGradient}
              >
                <Feather name="star" size={20} color="#F6E7B2" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.premiumBannerTitle}>Unlock Premium</Text>
                  <Text style={styles.premiumBannerSub}>HD quality · Unlimited · No ads</Text>
                </View>
                <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.6)" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      <PremiumModal visible={showPremium} onClose={() => setShowPremium(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 4,
  },
  backBtn: { padding: 8, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.06)", width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold", color: "#1A1A2E" },
  premiumHeaderBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#EDE9FE", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  premiumHeaderText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#8B5CF6" },
  content: { paddingHorizontal: 20, gap: 16, paddingTop: 4 },
  imageCard: {
    borderRadius: 24,
    overflow: "hidden",
    aspectRatio: 0.85,
    position: "relative",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: "#E5E7EB",
  },
  babyImage: { width: "100%", height: "100%" },
  imageTags: { position: "absolute", top: 12, left: 12, flexDirection: "row", gap: 8 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tagText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: "#8B5CF6" },
  hdTag: { backgroundColor: "#8B5CF6" },
  hdTagText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#FFFFFF", letterSpacing: 0.5 },
  premiumOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, height: "45%" },
  overlayGradient: { flex: 1, alignItems: "center", justifyContent: "flex-end", paddingBottom: 24, gap: 8, paddingHorizontal: 24 },
  overlayTitle: { color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 15 },
  overlayBtn: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.4)", marginTop: 4 },
  overlayBtnText: { color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 14 },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoItem: { flex: 1, alignItems: "center", gap: 4 },
  infoLabel: { fontSize: 12, fontFamily: "Inter_400Regular", color: "#9CA3AF" },
  infoValue: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#1A1A2E" },
  infoDivider: { width: 1, height: 32, backgroundColor: "#F3F4F6" },
  actions: { flexDirection: "row", gap: 12 },
  actionBtn: { flex: 1, alignItems: "center", gap: 8 },
  actionIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 12, fontFamily: "Inter_500Medium", color: "#374151" },
  premiumBanner: { borderRadius: 20, overflow: "hidden" },
  premiumBannerGradient: { flexDirection: "row", alignItems: "center", gap: 14, padding: 18 },
  premiumBannerTitle: { color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 15 },
  premiumBannerSub: { color: "rgba(255,255,255,0.6)", fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
});
