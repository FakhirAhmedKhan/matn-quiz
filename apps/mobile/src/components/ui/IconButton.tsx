import type { ComponentProps } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, iconSize, radius, spacing } from "../../theme";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type IconButtonProps = {
  icon: IoniconName;
  onPress: () => void;
  accessibilityLabel: string;
  size?: "sm" | "md" | "lg";
};

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  size = "md",
}: IconButtonProps) {
  const iconPixels =
    size === "sm"
      ? iconSize.sm
      : size === "lg"
        ? iconSize.lg
        : iconSize.md;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name={icon}
        size={iconPixels}
        color={colors.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 42,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm,
    borderRadius: radius.md,
  },

  pressed: {
    backgroundColor: colors.backgroundSoft,
  },
});