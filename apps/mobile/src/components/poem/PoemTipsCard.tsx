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

const TIPS = [
  "Place each poetic line on its own line.",
  "Use blank lines between sections or stanzas.",
  "Arabic punctuation is optional.",
  "You can return and edit the poem at any time.",
];

export function PoemTipsCard() {
  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name="bulb-outline"
          size={iconSize.md}
          color={colors.warning}
        />

        <AppText variant="subheading">
          Poem Input Tips
        </AppText>
      </View>

      <View style={styles.items}>
        {TIPS.map((tip) => (
          <View
            key={tip}
            style={styles.item}
          >
            <View style={styles.dot} />

            <AppText
              variant="bodySmall"
              muted
              style={styles.text}
            >
              {tip}
            </AppText>
          </View>
        ))}
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

  dot: {
    width: 6,
    height: 6,
    marginTop: 7,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },

  text: {
    flex: 1,
  },
});