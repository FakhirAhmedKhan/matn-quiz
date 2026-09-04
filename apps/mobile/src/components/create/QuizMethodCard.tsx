import type { ComponentProps } from "react";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { QuizMethod } from "../../types/quiz";
import { AppText } from "../ui";
import {
  colors,
  iconSize,
  radius,
  shadows,
  spacing,
} from "../../theme";

type IconName =
  ComponentProps<typeof Ionicons>["name"];

type QuizMethodCardProps = {
  method: QuizMethod;
  title: string;
  description: string;
  detail: string;
  availableCount: number;
  availableLabel: string;
  icon: IconName;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function QuizMethodCard({
  method,
  title,
  description,
  detail,
  availableCount,
  availableLabel,
  icon,
  selected,
  disabled = false,
  onPress,
}: QuizMethodCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      accessibilityState={{
        selected,
        disabled,
      }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.selectedCard,
        disabled && styles.disabledCard,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconContainer,
            selected && styles.selectedIconContainer,
          ]}
        >
          <Ionicons
            name={icon}
            size={iconSize.lg}
            color={
              selected
                ? colors.textInverse
                : disabled
                  ? colors.textMuted
                  : colors.primary
            }
          />
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <AppText variant="subheading">
              {title}
            </AppText>

            {selected ? (
              <Ionicons
                name="checkmark-circle"
                size={iconSize.lg}
                color={colors.primary}
              />
            ) : null}
          </View>

          <AppText
            variant="bodySmall"
            muted
          >
            {description}
          </AppText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailRow}>
        <Ionicons
          name="sparkles-outline"
          size={iconSize.sm}
          color={
            disabled
              ? colors.textMuted
              : colors.textMuted
          }
        />

        <AppText
          variant="bodySmall"
          muted
          style={styles.detailText}
        >
          {detail}
        </AppText>
      </View>

      <View style={styles.footer}>
        <View
          style={[
            styles.countBadge,
            disabled && styles.disabledBadge,
          ]}
        >
          <AppText
            variant="caption"
            style={[
              styles.countText,
              disabled && styles.disabledText,
            ]}
          >
            {availableCount} {availableLabel}
          </AppText>
        </View>

        <AppText
          variant="caption"
          muted
        >
          {disabled
            ? "Unavailable"
            : method === "HIDE_WORD"
              ? "Word recall"
              : "Passage recall"}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    gap: spacing.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    ...shadows.card,
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },

  disabledCard: {
    opacity: 0.55,
  },

  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },

  iconContainer: {
    width: 48,
    height: 48,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  selectedIconContainer: {
    backgroundColor: colors.primary,
  },

  content: {
    flex: 1,
    gap: spacing.xs,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },

  detailText: {
    flex: 1,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },

  countBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },

  disabledBadge: {
    backgroundColor: colors.backgroundSoft,
  },

  countText: {
    color: colors.primaryDark,
    fontWeight: "800",
  },

  disabledText: {
    color: colors.textMuted,
  },
});