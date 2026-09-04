import {
  StyleSheet,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useAccessibilityPreferences,
} from "../../hooks/useAccessibilityPreferences";

import {
  AppCard,
  AppText,
} from "../ui";

import {
  colors,
  iconSize,
  spacing,
} from "../../theme";

export function AccessibilityStatusCard() {
  const preferences =
    useAccessibilityPreferences();

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name="accessibility-outline"
          size={iconSize.md}
          color={colors.primary}
        />

        <View style={styles.heading}>
          <AppText variant="subheading">
            Accessibility
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            Device accessibility preferences
          </AppText>
        </View>
      </View>

      <View style={styles.rows}>
        <View style={styles.row}>
          <AppText
            variant="bodySmall"
            muted
          >
            Screen Reader
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.value}
          >
            {!preferences.loaded
              ? "Checking..."
              : preferences.screenReaderEnabled
                ? "Enabled"
                : "Off"}
          </AppText>
        </View>

        <View style={styles.row}>
          <AppText
            variant="bodySmall"
            muted
          >
            Reduced Motion
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.value}
          >
            {!preferences.loaded
              ? "Checking..."
              : preferences.reduceMotionEnabled
                ? "Enabled"
                : "Off"}
          </AppText>
        </View>

        <View style={styles.row}>
          <AppText
            variant="bodySmall"
            muted
          >
            Text Scaling
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.value}
          >
            Supported
          </AppText>
        </View>
      </View>
    </AppCard>
  );
}

const styles =
  StyleSheet.create({
    card: {
      gap: spacing.lg,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },

    heading: {
      flex: 1,
      gap: spacing.xs,
    },

    rows: {
      gap: spacing.md,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
    },

    value: {
      color:
        colors.primaryDark,
      fontWeight:
        "800",
    },
  });