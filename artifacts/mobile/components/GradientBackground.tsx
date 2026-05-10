import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: "default" | "processing" | "premium";
}

export function GradientBackground({
  children,
  variant = "default",
}: GradientBackgroundProps) {
  const configs: Record<string, [string, string, ...string[]]> = {
    default: ["#FAF7FF", "#F3F0FF"],
    processing: ["#1A0533", "#2D1060", "#1A0533"],
    premium: ["#2D1060", "#1A0533"],
  };

  return (
    <LinearGradient
      colors={configs[variant]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      {children}
    </LinearGradient>
  );
}
