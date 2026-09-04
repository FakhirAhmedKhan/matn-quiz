import {
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  AppCard,
  AppText,
} from "../ui";
import {
  colors,
  iconSize,
  spacing,
} from "../../theme";

const tips = [
  "Paste Quran, hadith, or Islamic matn text in Arabic.",
  "Use line breaks when you want Hide Lines quizzes.",
  "Longer text gives you more hiding options.",
  "You can edit the text before generating the quiz.",
];

export function InputTipsCard() {
  return (
    <AppCard style={styles.card}>
      <View style={styles.heading}>
        <Ionicons
          name="bulb-outline"
          size={iconSize.md}
          color={colors.warning}
        />

        <AppText variant="subheading">
          Input Tips
        </AppText>
      </View>

      <View style={styles.list}>
        {tips.map((tip) => (
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

  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  list: {
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