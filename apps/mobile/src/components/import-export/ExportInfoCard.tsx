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

export function ExportInfoCard() {
  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name="shield-checkmark-outline"
          size={iconSize.md}
          color={colors.primary}
        />

        <AppText variant="subheading">
          What gets exported?
        </AppText>
      </View>

      <View style={styles.items}>
        <View style={styles.item}>
          <Ionicons
            name="checkmark-circle-outline"
            size={iconSize.sm}
            color={colors.success}
          />

          <AppText
            variant="bodySmall"
            muted
            style={styles.text}
          >
            Arabic quiz text
          </AppText>
        </View>

        <View style={styles.item}>
          <Ionicons
            name="checkmark-circle-outline"
            size={iconSize.sm}
            color={colors.success}
          />

          <AppText
            variant="bodySmall"
            muted
            style={styles.text}
          >
            Hide Words or Hide Lines method
          </AppText>
        </View>

        <View style={styles.item}>
          <Ionicons
            name="checkmark-circle-outline"
            size={iconSize.sm}
            color={colors.success}
          />

          <AppText
            variant="bodySmall"
            muted
            style={styles.text}
          >
            Selected hide count
          </AppText>
        </View>

        <View style={styles.item}>
          <Ionicons
            name="lock-closed-outline"
            size={iconSize.sm}
            color={colors.primary}
          />

          <AppText
            variant="bodySmall"
            muted
            style={styles.text}
          >
            History and scores are not included
            in this draft export.
          </AppText>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  items: {
    gap: spacing.md,
  },

  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },

  text: {
    flex: 1,
  },
});