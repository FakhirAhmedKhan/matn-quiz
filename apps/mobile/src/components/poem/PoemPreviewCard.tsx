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
  ArabicText,
} from "../ui";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type PoemPreviewCardProps = {
  title: string;
  text: string;
};

export function PoemPreviewCard({
  title,
  text,
}: PoemPreviewCardProps) {
  if (
    !title.trim() &&
    !text.trim()
  ) {
    return null;
  }

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name="eye-outline"
          size={iconSize.md}
          color={colors.primary}
        />

        <View style={styles.headingText}>
          <AppText variant="subheading">
            Reader Preview
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            Preview before opening reader mode
          </AppText>
        </View>
      </View>

      {title.trim() ? (
        <View style={styles.titleContainer}>
          <ArabicText
            size="medium"
            center
          >
            {title.trim()}
          </ArabicText>
        </View>
      ) : null}

      {text.trim() ? (
        <View style={styles.textContainer}>
          <ArabicText
            size="small"
            numberOfLines={6}
          >
            {text.trim()}
          </ArabicText>
        </View>
      ) : null}
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

  headingText: {
    flex: 1,
    gap: spacing.xs,
  },

  titleContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  textContainer: {
    maxHeight: 260,
    overflow: "hidden",
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSoft,
  },
});