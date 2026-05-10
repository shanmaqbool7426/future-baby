import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { BABY_IMAGES } from "@/constants/babyImages";
import { useColors } from "@/hooks/useColors";
import { useAppStore, type Generation } from "@/store/appStore";

const AGE_LABELS: Record<string, string> = {
  baby: "Baby",
  toddler: "Toddler",
  child: "Child",
  teen: "Teen",
};

function HistoryCard({ gen, index }: { gen: Generation; index: number }) {
  const colors = useColors();

  const handlePress = () => {
    useAppStore.getState().setCurrentGeneration(gen);
    router.push("/result");
  };

  const date = new Date(gen.timestamp);
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <Animated.View entering={FadeInDown.duration(350).delay(index * 60)}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.88}
        style={[styles.card, { backgroundColor: colors.card }]}
      >
        <Image
          source={BABY_IMAGES[gen.resultImageIndex]}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={styles.cardOverlay}
        />

        <View style={styles.cardBadges}>
          <View style={[styles.badge, { backgroundColor: "rgba(139,92,246,0.85)" }]}>
            <Text style={styles.badgeText}>AI</Text>
          </View>
          {gen.isHD && (
            <View style={[styles.badge, { backgroundColor: "rgba(246,231,178,0.9)" }]}>
              <Text style={[styles.badgeText, { color: "#92400E" }]}>HD</Text>
            </View>
          )}
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardGender}>
            {gen.gender === "surprise" ? "✦ Surprise" : gen.gender === "boy" ? "Boy" : "Girl"}
          </Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardAge}>{AGE_LABELS[gen.ageGroup]}</Text>
            <Text style={styles.cardDate}>{dateStr}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const colors = useColors();
  const generations = useAppStore((s) => s.generations);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        entering={FadeIn.duration(300)}
        style={[styles.header, { paddingTop: topPad + 8 }]}
      >
        <Text style={styles.headerTitle}>Predictions</Text>
        <Text style={styles.headerCount}>
          {generations.length} {generations.length === 1 ? "result" : "results"}
        </Text>
      </Animated.View>

      {generations.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.purple100 }]}>
            <Feather name="clock" size={32} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Predictions Yet</Text>
          <Text style={styles.emptySubtitle}>
            Your AI-generated baby predictions will appear here after your first generation.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.88}
          >
            <Text style={styles.emptyBtnText}>Create Your First Prediction</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={generations}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={[
            styles.grid,
            { paddingBottom: bottomPad + 90 },
          ]}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item, index }) => (
            <View style={{ flex: 1 }}>
              <HistoryCard gen={item} index={index} />
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 4,
  },
  headerTitle: { fontSize: 28, fontFamily: "Inter_700Bold", color: "#1A1A2E" },
  headerCount: { fontSize: 14, fontFamily: "Inter_400Regular", color: "#9CA3AF" },
  grid: { paddingHorizontal: 16, paddingTop: 8 },
  gridRow: { gap: 12, marginBottom: 12 },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    aspectRatio: 0.78,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  cardImage: { width: "100%", height: "100%" },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
  },
  cardBadges: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    gap: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  cardInfo: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    gap: 3,
  },
  cardGender: {
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  cardMeta: { flexDirection: "row", justifyContent: "space-between" },
  cardAge: { color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular", fontSize: 12 },
  cardDate: { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_400Regular", fontSize: 12 },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#1A1A2E", textAlign: "center" },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 22,
  },
  emptyBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, marginTop: 8 },
  emptyBtnText: { color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 15 },
});
