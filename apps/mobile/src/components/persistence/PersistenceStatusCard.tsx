import {
  StyleSheet,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  AppCard,
  AppText,
} from "../ui";

import {
  colors,
  iconSize,
  spacing,
} from "../../theme";

type PersistenceStatusCardProps = {
  hydrated: boolean;
};

export function PersistenceStatusCard({
  hydrated,
}: PersistenceStatusCardProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name={
            hydrated
              ? "cloud-done-outline"
              : "sync-outline"
          }
          size={iconSize.md}
          color={
            hydrated
              ? colors.success
              : colors.primary
          }
        />

        <View style={styles.text}>
          <AppText variant="subheading">
            Local Persistence
          </AppText>

          <AppText
            variant="bodySmall"
            muted
          >
            {hydrated
              ? "Stored app data has been restored from this device."
              : "Restoring saved app data..."}
          </AppText>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },

  text: {
    flex: 1,
    gap: spacing.xs,
  },
});