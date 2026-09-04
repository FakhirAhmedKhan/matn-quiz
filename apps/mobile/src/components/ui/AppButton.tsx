import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { buttonHeight, colors, radius, spacing, typography } from "../../theme";

type AppButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type AppButtonSize = "sm" | "md" | "lg";

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
};

export function AppButton({
  label,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  testID,
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      testID={testID}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        styles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary" || variant === "danger"
              ? colors.textInverse
              : colors.primary
          }
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === "primary" && styles.primaryLabel,
            variant === "secondary" && styles.secondaryLabel,
            variant === "ghost" && styles.ghostLabel,
            variant === "danger" && styles.dangerLabel,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
  },

  sm: {
    minHeight: buttonHeight.sm,
  },

  md: {
    minHeight: buttonHeight.md,
  },

  lg: {
    minHeight: buttonHeight.lg,
  },

  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
  },

  ghost: {
    backgroundColor: colors.transparent,
    borderColor: colors.transparent,
  },

  danger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },

  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },

  disabled: {
    opacity: 0.45,
  },

  label: {
    fontSize: typography.body,
    fontWeight: "800",
  },

  primaryLabel: {
    color: colors.textInverse,
  },

  secondaryLabel: {
    color: colors.primary,
  },

  ghostLabel: {
    color: colors.primary,
  },

  dangerLabel: {
    color: colors.textInverse,
  },
});