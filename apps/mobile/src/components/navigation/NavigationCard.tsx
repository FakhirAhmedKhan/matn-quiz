import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";
import { AppText } from "../ui";

type NavigationCardProps = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export function NavigationCard({
  title,
  description,
  icon,
  onPress,
}: NavigationCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.icon}>
        <Ionicons
          name={icon}
          size={iconSize.lg}
          color={colors.primary}
        />
      </View>

      <View style={styles.content}>
        <AppText variant="subheading">
          {title}
        </AppText>

        <AppText
          variant="bodySmall"
          muted
        >
          {description}
        </AppText>
      </View>

      <Ionicons
        name="chevron-forward"
        size={iconSize.md}
        color={colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  pressed: {
    opacity: 0.82,
  },

  icon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  content: {
    flex: 1,
    gap: spacing.xs,
  },
});