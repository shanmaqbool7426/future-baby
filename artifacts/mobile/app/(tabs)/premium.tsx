import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
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
import { useAppStore } from "@/store/appStore";

const FEATURES = [
  { icon: "zap" as const, label: "Unlimited Generations", desc: "No daily limits" },
  { icon: "image" as const, label: "HD Quality", desc: "4K resolution results" },
  { icon: "cpu" as const, label: "Advanced AI", desc: "6 unique baby styles" },
  { icon: "shield-off" as const, label: "No Ads", desc: "Clean experience" },
  { icon: "clock" as const, label: "2x Faster", desc: "Priority processing" },
  { icon: "layers" as const, label: "AI Enhancement", desc: "Smart feature blending" },
];

const PLANS = [
  {
    id: "monthly",
    label: "Monthly",
    price: "$9.99",
    period: "/month",
    note: "Billed monthly",
    popular: false,
  },
  {
    id: "annual",
    label: "Annual",
    price: "$4.99",
    period: "/month",
    note: "Billed $59.99/year",
    popular: true,
    save: "SAVE 50%",
  },
];

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const { isPremium, upgradeToPremium } = useAppStore();

  const handleUpgrade = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    upgradeToPremium();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0F0520", "#1A0533", "#2D1060", "#1A0533"]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 8, paddingBottom: bottomPad + 90 },
        ]}
      >
        {isPremium ? (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.activeCard}>
            <LinearGradient
              colors={["rgba(139,92,246,0.3)", "rgba(167,139,250,0.2)"]}
              style={styles.activeGradient}
            >
              <View style={styles.activeIcon}>
                <Feather name="star" size={28} color="#F6E7B2" />
              </View>
              <Text style={styles.activeTitle}>You're Premium!</Text>
              <Text style={styles.activeSubtitle}>
                Enjoy unlimited generations, HD quality, and all premium features.
              </Text>
            </LinearGradient>
          </Animated.View>
        ) : (
          <>
            <Animated.View entering={FadeInDown.duration(400)} style={styles.hero}>
              <View style={styles.heroBadge}>
                <Feather name="star" size={13} color="#F6E7B2" />
                <Text style={styles.heroBadgeText}>FUTUREBABY PREMIUM</Text>
              </View>
              <Text style={styles.heroTitle}>The Complete{"\n"}AI Baby Experience</Text>
              <Text style={styles.heroSubtitle}>
                Unlock everything and create stunning predictions with no limits
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(400).delay(80)} style={styles.featuresGrid}>
              {FEATURES.map((f, i) => (
                <Animated.View
                  key={f.icon}
                  entering={FadeInDown.duration(300).delay(80 + i * 50)}
                  style={styles.featureItem}
                >
                  <View style={styles.featureIcon}>
                    <Feather name={f.icon} size={20} color="#A78BFA" />
                  </View>
                  <Text style={styles.featureLabel}>{f.label}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </Animated.View>
              ))}
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.plans}>
              {PLANS.map((plan) => (
                <View
                  key={plan.id}
                  style={[styles.planCard, plan.popular && styles.planCardPopular]}
                >
                  {plan.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>BEST VALUE</Text>
                    </View>
                  )}
                  {plan.save && (
                    <View style={styles.saveBadge}>
                      <Text style={styles.saveText}>{plan.save}</Text>
                    </View>
                  )}
                  <Text style={styles.planLabel}>{plan.label}</Text>
                  <View style={styles.planPriceRow}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planPeriod}>{plan.period}</Text>
                  </View>
                  <Text style={styles.planNote}>{plan.note}</Text>
                </View>
              ))}
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(400).delay(280)}>
              <TouchableOpacity onPress={handleUpgrade} activeOpacity={0.9} style={styles.upgradeBtn}>
                <LinearGradient
                  colors={["#8B5CF6", "#7C3AED"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.upgradeGradient}
                >
                  <Feather name="star" size={18} color="#F6E7B2" />
                  <Text style={styles.upgradeBtnText}>Start 3-Day Free Trial</Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.legalText}>
                3-day free trial, then $59.99/year. Cancel anytime in Settings.
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(400).delay(340)} style={styles.trustRow}>
              {[
                { icon: "shield" as const, label: "Secure Payment" },
                { icon: "refresh-cw" as const, label: "Cancel Anytime" },
                { icon: "lock" as const, label: "Private & Safe" },
              ].map((item) => (
                <View key={item.icon} style={styles.trustItem}>
                  <Feather name={item.icon} size={16} color="rgba(255,255,255,0.4)" />
                  <Text style={styles.trustLabel}>{item.label}</Text>
                </View>
              ))}
            </Animated.View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 24 },
  hero: { alignItems: "center", gap: 12 },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(246,231,178,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(246,231,178,0.3)",
  },
  heroBadgeText: { color: "#F6E7B2", fontFamily: "Inter_600SemiBold", fontSize: 11, letterSpacing: 1.2 },
  heroTitle: { fontSize: 32, fontFamily: "Inter_700Bold", color: "#FFFFFF", textAlign: "center", lineHeight: 40 },
  heroSubtitle: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.55)", textAlign: "center", lineHeight: 22 },
  featuresGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  featureItem: {
    width: "47%",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(139,92,246,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureLabel: { color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 13 },
  featureDesc: { color: "rgba(255,255,255,0.45)", fontFamily: "Inter_400Regular", fontSize: 12 },
  plans: { flexDirection: "row", gap: 12 },
  planCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 18,
    padding: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    position: "relative",
    overflow: "hidden",
  },
  planCardPopular: { borderColor: "#8B5CF6", backgroundColor: "rgba(139,92,246,0.15)" },
  popularBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#8B5CF6",
    paddingVertical: 4,
    alignItems: "center",
  },
  popularText: { color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: 9, letterSpacing: 1 },
  saveBadge: {
    backgroundColor: "rgba(246,231,178,0.15)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginTop: 16,
    marginBottom: 4,
  },
  saveText: { color: "#F6E7B2", fontFamily: "Inter_700Bold", fontSize: 9, letterSpacing: 0.5 },
  planLabel: { color: "rgba(255,255,255,0.6)", fontFamily: "Inter_500Medium", fontSize: 13, marginTop: 8 },
  planPriceRow: { flexDirection: "row", alignItems: "baseline", gap: 2, marginTop: 4 },
  planPrice: { color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: 26 },
  planPeriod: { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_400Regular", fontSize: 12 },
  planNote: { color: "rgba(255,255,255,0.35)", fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 4 },
  upgradeBtn: { borderRadius: 16, overflow: "hidden" },
  upgradeGradient: { height: 58, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  upgradeBtnText: { color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: 17 },
  legalText: { color: "rgba(255,255,255,0.35)", fontFamily: "Inter_400Regular", fontSize: 11, textAlign: "center", marginTop: 10 },
  trustRow: { flexDirection: "row", justifyContent: "space-around" },
  trustItem: { alignItems: "center", gap: 6 },
  trustLabel: { color: "rgba(255,255,255,0.35)", fontFamily: "Inter_400Regular", fontSize: 11 },
  activeCard: { borderRadius: 24, overflow: "hidden", marginTop: 40 },
  activeGradient: { padding: 40, alignItems: "center", gap: 16, borderWidth: 1, borderColor: "rgba(139,92,246,0.4)", borderRadius: 24 },
  activeIcon: { width: 72, height: 72, borderRadius: 24, backgroundColor: "rgba(139,92,246,0.2)", alignItems: "center", justifyContent: "center" },
  activeTitle: { color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: 28, textAlign: "center" },
  activeSubtitle: { color: "rgba(255,255,255,0.6)", fontFamily: "Inter_400Regular", fontSize: 15, textAlign: "center", lineHeight: 22 },
});
