import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  AppText,
} from "../ui";

import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type SettingsStepperProps = {
  value: number;

  minimum: number;

  maximum: number;

  onChange: (
    value: number,
  ) => void;
};

export function SettingsStepper({
  value,
  minimum,
  maximum,
  onChange,
}: SettingsStepperProps) {
  const canDecrease =
    value > minimum;

  const canIncrease =
    value < maximum;

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease value"
        accessibilityState={{
          disabled:
            !canDecrease,
        }}
        disabled={!canDecrease}
        onPress={() =>
          onChange(
            value - 1,
          )
        }
        style={[
          styles.button,
          !canDecrease &&
            styles.disabled,
        ]}
      >
        <Ionicons
          name="remove"
          size={iconSize.md}
          color={
            canDecrease
              ? colors.primary
              : colors.textMuted
          }
        />
      </Pressable>

      <View style={styles.value}>
        <AppText
          variant="title"
          align="center"
          style={styles.valueText}
        >
          {value}
        </AppText>

        <AppText
          variant="caption"
          muted
          align="center"
        >
          hidden
        </AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase value"
        accessibilityState={{
          disabled:
            !canIncrease,
        }}
        disabled={!canIncrease}
        onPress={() =>
          onChange(
            value + 1,
          )
        }
        style={[
          styles.button,
          !canIncrease &&
            styles.disabled,
        ]}
      >
        <Ionicons
          name="add"
          size={iconSize.md}
          color={
            canIncrease
              ? colors.primary
              : colors.textMuted
          }
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl,
  },

  button: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor:
      colors.primary,
    borderRadius:
      radius.lg,
    backgroundColor:
      colors.surface,
  },

  disabled: {
    opacity: 0.4,
    borderColor:
      colors.border,
  },

  value: {
    minWidth: 80,
    gap: spacing.xs,
  },

  valueText: {
    color:
      colors.primaryDark,
    fontWeight: "900",
  },
});