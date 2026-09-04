import { StyleSheet, Text, View } from "react-native";

import { AppScreen } from "../src/components/layout/AppScreen";
import {
  colors,
  radius,
  spacing,
  typography,
} from "../src/theme";

export default function HomeScreen() {
  return (
    <AppScreen>
      <View style={styles.container}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>م</Text>
        </View>

        <Text style={styles.title}>Matn Quiz</Text>

        <Text style={styles.subtitle}>
          Quran & Matn Memorization
        </Text>

        <View style={styles.card}>
          <Text style={styles.badge}>M1 FOUNDATION</Text>

          <Text style={styles.cardTitle}>
            Mobile foundation ready
          </Text>

          <Text style={styles.description}>
            Expo Router, safe areas, design tokens and the shared screen
            foundation are ready for the Matn Quiz mobile experience.
          </Text>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },

  logo: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    marginBottom: spacing.sm,
  },

  logoText: {
    color: colors.surface,
    fontSize: 32,
    fontWeight: "700",
  },

  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "800",
  },

  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
  },

  card: {
    width: "100%",
    marginTop: spacing.xxxl,
    padding: spacing.xxl,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  badge: {
    alignSelf: "flex-start",
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: "800",
    marginBottom: spacing.md,
  },

  cardTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },

  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
  },
});