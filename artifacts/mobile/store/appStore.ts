import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export type Gender = "boy" | "girl" | "surprise";
export type AgeGroup = "baby" | "toddler" | "child" | "teen";

export interface Generation {
  id: string;
  motherPhoto: string | null;
  fatherPhoto: string | null;
  resultImageIndex: number;
  gender: Gender;
  ageGroup: AgeGroup;
  timestamp: number;
  isHD: boolean;
}

interface AppState {
  motherPhoto: string | null;
  fatherPhoto: string | null;
  gender: Gender;
  ageGroup: AgeGroup;
  generations: Generation[];
  isPremium: boolean;
  currentGeneration: Generation | null;
}

interface AppActions {
  setMotherPhoto: (uri: string | null) => void;
  setFatherPhoto: (uri: string | null) => void;
  setGender: (gender: Gender) => void;
  setAgeGroup: (age: AgeGroup) => void;
  addGeneration: (gen: Generation) => void;
  setCurrentGeneration: (gen: Generation | null) => void;
  loadGenerations: () => Promise<void>;
  upgradeToPremium: () => void;
  reset: () => void;
}

type AppStore = AppState & AppActions;

const GENERATIONS_KEY = "@futurebaby_generations";
const PREMIUM_KEY = "@futurebaby_premium";

export const useAppStore = create<AppStore>((set, get) => ({
  motherPhoto: null,
  fatherPhoto: null,
  gender: "surprise",
  ageGroup: "baby",
  generations: [],
  isPremium: false,
  currentGeneration: null,

  setMotherPhoto: (uri) => set({ motherPhoto: uri }),
  setFatherPhoto: (uri) => set({ fatherPhoto: uri }),
  setGender: (gender) => set({ gender }),
  setAgeGroup: (ageGroup) => set({ ageGroup }),
  setCurrentGeneration: (gen) => set({ currentGeneration: gen }),

  addGeneration: (gen) => {
    const newGenerations = [gen, ...get().generations].slice(0, 30);
    set({ generations: newGenerations });
    AsyncStorage.setItem(GENERATIONS_KEY, JSON.stringify(newGenerations)).catch(
      () => {}
    );
  },

  loadGenerations: async () => {
    try {
      const stored = await AsyncStorage.getItem(GENERATIONS_KEY);
      if (stored) set({ generations: JSON.parse(stored) });
      const premium = await AsyncStorage.getItem(PREMIUM_KEY);
      if (premium === "true") set({ isPremium: true });
    } catch {
      // fail silently
    }
  },

  upgradeToPremium: () => {
    set({ isPremium: true });
    AsyncStorage.setItem(PREMIUM_KEY, "true").catch(() => {});
  },

  reset: () =>
    set({ motherPhoto: null, fatherPhoto: null, gender: "surprise", ageGroup: "baby" }),
}));
