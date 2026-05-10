import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/store/appStore";
import { PremiumModal } from "@/components/PremiumModal";

interface SettingRowProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (val: boolean) => void;
  destructive?: boolean;
}

function SettingRow({ icon, label, value, onPress, toggle, toggleValue, onToggle, destructive }: SettingRowProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={() => {
        if (!toggle && onPress) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }
      }}
      activeOpacity={toggle ? 1 : 0.7}
      style={styles.settingRow}
    >
      <View style={[styles.settingIcon, { backgroundColor: destructive ? "#FEE2E2" : colors.purple100 }]}>
        <Feather name={icon} size={17} color={destructive ? "#EF4444" : colors.primary} />
      </View>
      <Text style={[styles.settingLabel, { color: destructive ? "#EF4444" : colors.darkText }]}>{label}</Text>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: "#E5E7EB", true: colors.primary }}
          thumbColor="#FFFFFF"
        />
      ) : value ? (
        <Text style={styles.settingValue}>{value}</Text>
      ) : (
        <Feather name="chevron-right" size={18} color="#D1D5DB" />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const colors = useColors();
  const [notifications, setNotifications] = useState(true);
  const [showPremium, setShowPremium] = useState(false);

  const { generations, isPremium } = useAppStore();

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "This will remove all your predictions. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: topPad + 8, paddingBottom: bottomPad + 90 }]}
      >
        <Animated.View entering={FadeInDown.duration(400)} style={styles.profileCard}>
          <LinearGradient
            colors={["#8B5CF6", "#7C3AED"]}
            style={styles.avatar}
          >
            <Feather name="user" size={32} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Your Profile</Text>
            <Text style={styles.profileSub}>
              {isPremium ? "✦ Premium Member" : "Free Account"}
            </Text>
          </View>
          {!isPremium && (
            <TouchableOpacity
              onPress={() => setShowPremium(true)}
              style={styles.upgradeChip}
              activeOpacity={0.88}
            >
              <Feather name="star" size={12} color="#8B5CF6" />
              <Text style={styles.upgradeChipText}>Upgrade</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(60)} style={styles.statsRow}>
          {[
            { label: "Predictions", value: generations.length.toString() },
            { label: "Saved Photos", value: isPremium ? generations.length.toString() : "0" },
            { label: "AI Credits", value: isPremium ? "∞" : "3" },
          ].map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {!isPremium && (
          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
            <TouchableOpacity
              onPress={() => setShowPremium(true)}
              style={styles.premiumBanner}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#1A0533", "#2D1060"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.premiumBannerGradient}
              >
                <Feather name="star" size={20} color="#F6E7B2" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.premiumBannerTitle}>Upgrade to Premium</Text>
                  <Text style={styles.premiumBannerSub}>HD quality · Unlimited · No ads</Text>
                </View>
                <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.5)" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.duration(400).delay(140)} style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingRow
            icon="bell"
            label="Notifications"
            toggle
            toggleValue={notifications}
            onToggle={setNotifications}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow
            icon="image"
            label="Save to Camera Roll"
            value={isPremium ? "On" : "Premium"}
            onPress={() => !isPremium && setShowPremium(true)}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow
            icon="globe"
            label="Language"
            value="English"
            onPress={() => {}}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(180)} style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingRow icon="help-circle" label="Help Center" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow icon="message-circle" label="Contact Support" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow icon="star" label="Rate the App" onPress={() => {}} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(220)} style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingRow icon="shield" label="Privacy Policy" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow icon="file-text" label="Terms of Service" onPress={() => {}} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow
            icon="trash-2"
            label="Clear History"
            onPress={handleClearHistory}
            destructive
          />
        </Animated.View>

        <Text style={styles.version}>FutureBaby AI v1.0.0</Text>
      </ScrollView>

      <PremiumModal visible={showPremium} onClose={() => setShowPremium(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#1A1A2E" },
  profileSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "#9CA3AF", marginTop: 2 },
  upgradeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  upgradeChipText: { color: "#8B5CF6", fontFamily: "Inter_600SemiBold", fontSize: 12 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  statValue: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#8B5CF6" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: "#9CA3AF", textAlign: "center" },
  premiumBanner: { borderRadius: 18, overflow: "hidden" },
  premiumBannerGradient: { flexDirection: "row", alignItems: "center", gap: 14, padding: 18 },
  premiumBannerTitle: { color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 15 },
  premiumBannerSub: { color: "rgba(255,255,255,0.6)", fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
  section: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#9CA3AF", letterSpacing: 0.8, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 4, textTransform: "uppercase" },
  settingRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingVertical: 14 },
  settingIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  settingLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  settingValue: { fontSize: 13, fontFamily: "Inter_400Regular", color: "#9CA3AF" },
  divider: { height: 0.5, marginLeft: 64 },
  version: { textAlign: "center", fontSize: 12, fontFamily: "Inter_400Regular", color: "#D1D5DB", paddingVertical: 8 },
});
