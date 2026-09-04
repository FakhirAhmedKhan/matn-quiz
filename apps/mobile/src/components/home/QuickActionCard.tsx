import type { ComponentProps } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  AppText,
} from "../ui";
import {
  colors,
  iconSize,
  radius,
  shadows,
  spacing,
} from "../../theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

type QuickActionCardProps = {
  title: string;
  description: string;
  icon: IconName;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function QuickActionCard({
  title,
  description,
  icon,
  onPress,
  style,
}: QuickActionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        style,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconContainer}>
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
        name="arrow-forward-circle-outline"
        size={iconSize.md}
        color={colors.primary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 150,
    justifyContent: "space-between",
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    ...shadows.card,
  },

  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },

  iconContainer: {
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