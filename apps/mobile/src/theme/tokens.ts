import { Platform } from "react-native";

export const colors = {
  background: "#F7F5EE",
  backgroundSoft: "#FBFAF6",

  surface: "#FFFFFF",
  surfaceMuted: "#F2F4F3",
  surfaceEmerald: "#E9F4EF",

  primary: "#0F6B50",
  primaryDark: "#09513D",
  primaryLight: "#17815F",
  primarySoft: "#E8F3EE",

  gold: "#C8A34A",
  goldSoft: "#F5ECD6",

  text: "#14231C",
  textMuted: "#66736D",
  textLight: "#8A9690",
  textInverse: "#FFFFFF",

  border: "#E1E7E4",
  borderStrong: "#CCD7D2",

  success: "#16794F",
  successSoft: "#E8F5EE",

  danger: "#B42318",
  dangerSoft: "#FDECEA",

  warning: "#A86514",
  warningSoft: "#FFF4DD",

  overlay: "rgba(20, 35, 28, 0.45)",
  transparent: "transparent",
} as const;

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  section: 48,
} as const;

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  card: 20,
  pill: 999,
} as const;

export const typography = {
  display: 32,
  title: 28,
  heading: 22,
  subheading: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,

  arabicLarge: 30,
  arabic: 24,
  arabicSmall: 20,
} as const;

export const lineHeight = {
  display: 40,
  title: 36,
  heading: 30,
  subheading: 26,
  body: 24,
  bodySmall: 21,
  caption: 18,

  arabicLarge: 48,
  arabic: 40,
  arabicSmall: 34,
} as const;

export const buttonHeight = {
  sm: 40,
  md: 48,
  lg: 54,
} as const;

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
} as const;

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: "#14231C",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),

  floating: Platform.select({
    ios: {
      shadowColor: "#14231C",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 18,
    },
    android: {
      elevation: 6,
    },
    default: {},
  }),
} as const;