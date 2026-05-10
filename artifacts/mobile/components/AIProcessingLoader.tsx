import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface AIProcessingLoaderProps {
  size?: number;
}

export function AIProcessingLoader({ size = 200 }: AIProcessingLoaderProps) {
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);
  const ring3 = useSharedValue(0);
  const glowOpacity = useSharedValue(0.4);
  const glowScale = useSharedValue(0.8);
  const dotScale1 = useSharedValue(1);
  const dotScale2 = useSharedValue(1);
  const dotScale3 = useSharedValue(1);

  useEffect(() => {
    ring1.value = withRepeat(
      withTiming(360, { duration: 3500, easing: Easing.linear }),
      -1,
      false
    );
    ring2.value = withRepeat(
      withTiming(-360, { duration: 5000, easing: Easing.linear }),
      -1,
      false
    );
    ring3.value = withRepeat(
      withTiming(360, { duration: 7000, easing: Easing.linear }),
      -1,
      false
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1200 }),
        withTiming(0.3, { duration: 1200 })
      ),
      -1,
      true
    );
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1200 }),
        withTiming(0.85, { duration: 1200 })
      ),
      -1,
      true
    );

    const pulseDot = (sv: Animated.SharedValue<number>, delay: number) => {
      sv.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1.4, { duration: 400 }),
            withTiming(1, { duration: 400 })
          ),
          -1,
          true
        )
      );
    };
    pulseDot(dotScale1, 0);
    pulseDot(dotScale2, 200);
    pulseDot(dotScale3, 400);
  }, []);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ring1.value}deg` }],
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ring2.value}deg` }],
  }));
  const ring3Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ring3.value}deg` }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));
  const dot1Style = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale1.value }],
  }));
  const dot2Style = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale2.value }],
  }));
  const dot3Style = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale3.value }],
  }));

  const s = size;

  return (
    <View style={[styles.container, { width: s, height: s }]}>
      <Animated.View
        style={[
          styles.glow,
          {
            width: s * 0.55,
            height: s * 0.55,
            borderRadius: s * 0.275,
          },
          glowStyle,
        ]}
      />

      <Animated.View
        style={[
          styles.ring,
          {
            width: s,
            height: s,
            borderRadius: s / 2,
            borderColor: "rgba(139,92,246,0.3)",
          },
          ring3Style,
        ]}
      >
        <View
          style={[styles.dot, { backgroundColor: "#8B5CF6", top: -4, left: s / 2 - 4 }]}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.ring,
          {
            width: s * 0.78,
            height: s * 0.78,
            borderRadius: s * 0.39,
            borderColor: "rgba(167,139,250,0.5)",
          },
          ring2Style,
        ]}
      >
        <View
          style={[
            styles.dot,
            { backgroundColor: "#A78BFA", top: -5, left: s * 0.39 - 5, width: 10, height: 10, borderRadius: 5 },
          ]}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.ring,
          {
            width: s * 0.55,
            height: s * 0.55,
            borderRadius: s * 0.275,
            borderColor: "rgba(139,92,246,0.6)",
            borderWidth: 2,
          },
          ring1Style,
        ]}
      >
        <View
          style={[
            styles.dot,
            { backgroundColor: "#7C3AED", top: -6, left: s * 0.275 - 6, width: 12, height: 12, borderRadius: 6 },
          ]}
        />
      </Animated.View>

      <View style={styles.center}>
        <Animated.View style={[styles.innerDot, dot1Style]} />
        <Animated.View
          style={[styles.innerDot, { backgroundColor: "#A78BFA" }, dot2Style]}
        />
        <Animated.View
          style={[styles.innerDot, { backgroundColor: "#7C3AED" }, dot3Style]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    backgroundColor: "#8B5CF6",
    opacity: 0.15,
  },
  ring: {
    position: "absolute",
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  dot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8B5CF6",
  },
  center: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8B5CF6",
  },
});
