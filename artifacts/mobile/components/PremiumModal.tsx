import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/store/appStore";

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
}

const FEATURES = [
  { icon: "zap", label: "Unlimited Generations", desc: "Generate as many babies as you want" },
  { icon: "image", label: "HD Quality Results", desc: "Crystal-clear, high-resolution images" },
  { icon: "clock", label: "Faster AI Processing", desc: "2x faster results every time" },
  { icon: "layers", label: "Multiple Baby Styles", desc: "6 unique artistic styles" },
  { icon: "shield-off", label: "No Ads, Ever", desc: "Clean, distraction-free experience" },
  { icon: "cpu", label: "AI Enhancement", desc: "Advanced facial feature blending" },
];

export function PremiumModal({ visible, onClose }: PremiumModalProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const upgradeToPremium = useAppStore((s) => s.upgradeToPremium);

  const handleUpgrade = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    upgradeToPremium();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
        <LinearGradient
          colors={["#1A0533", "#2D1060", "#3B1D8A"]}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.handle} />

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Feather name="x" size={22} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.badge}>
            <Feather name="star" size={14} color="#F6E7B2" />
            <Text style={styles.badgeText}>FUTUREBABY PREMIUM</Text>
          </View>

          <Text style={styles.title}>Unlock the{"\n"}Full Experience</Text>
          <Text style={styles.subtitle}>
            Everything you need to create stunning AI baby predictions
          </Text>

          <View style={styles.features}>
            {FEATURES.map((f) => (
              <View key={f.icon} style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Feather name={f.icon as keyof typeof Feather.glyphMap} size={18} color="#A78BFA" />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureLabel}>{f.label}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.pricingCard}>
            <LinearGradient
              colors={["rgba(139,92,246,0.3)", "rgba(167,139,250,0.2)"]}
              style={styles.pricingGradient}
            >
              <View style={styles.pricingRow}>
                <View>
                  <Text style={styles.pricingLabel}>Annual Plan</Text>
                  <Text style={styles.pricingPrice}>$4.99/month</Text>
                  <Text style={styles.pricingNote}>Billed as $59.99/year</Text>
                </View>
                <View style={styles.saveBadge}>
                  <Text style={styles.saveText}>SAVE 58%</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <TouchableOpacity style={styles.upgradeBtn} onPress={handleUpgrade} activeOpacity={0.9}>
            <LinearGradient
              colors={["#8B5CF6", "#7C3AED"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.upgradeGradient}
            >
              <Text style={styles.upgradeBtnText}>Start Free Trial</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.legal}>3-day free trial, then $59.99/year. Cancel anytime.</Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 20,
    zIndex: 10,
    padding: 4,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(246,231,178,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(246,231,178,0.3)",
  },
  badgeText: {
    color: "#F6E7B2",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    marginBottom: 32,
    lineHeight: 22,
  },
  features: { gap: 16, marginBottom: 28 },
  feature: { flexDirection: "row", alignItems: "center", gap: 14 },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(139,92,246,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: { flex: 1 },
  featureLabel: { color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 15 },
  featureDesc: { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 2 },
  pricingCard: { borderRadius: 16, overflow: "hidden", marginBottom: 20, borderWidth: 1, borderColor: "rgba(139,92,246,0.4)" },
  pricingGradient: { padding: 20 },
  pricingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pricingLabel: { color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular", fontSize: 13, marginBottom: 4 },
  pricingPrice: { color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: 24 },
  pricingNote: { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
  saveBadge: { backgroundColor: "#8B5CF6", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  saveText: { color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: 11, letterSpacing: 0.5 },
  upgradeBtn: { borderRadius: 16, overflow: "hidden", marginBottom: 12 },
  upgradeGradient: { height: 56, alignItems: "center", justifyContent: "center" },
  upgradeBtnText: { color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: 17, letterSpacing: 0.3 },
  legal: { color: "rgba(255,255,255,0.4)", fontFamily: "Inter_400Regular", fontSize: 12, textAlign: "center" },
});
