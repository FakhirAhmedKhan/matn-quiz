import {
  Pressable,
  StyleSheet,
  View,
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
  typography,
} from "../../theme";

type HideCountSelectorProps = {
  value: number;
  minimum?: number;
  maximum: number;
  onChange: (
    value: number,
  ) => void;
};

export function HideCountSelector({
  value,
  minimum = 1,
  maximum,
  onChange,
}: HideCountSelectorProps) {
  const canDecrease =
    value > minimum;

  const canIncrease =
    value < maximum;

  function decrease() {
    if (!canDecrease) {
      return;
    }

    onChange(value - 1);
  }

  function increase() {
    if (!canIncrease) {
      return;
    }

    onChange(value + 1);
  }

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease hide count"
        accessibilityState={{
          disabled: !canDecrease,
        }}
        disabled={!canDecrease}
        onPress={decrease}
        style={({ pressed }) => [
          styles.control,
          !canDecrease &&
            styles.disabled,
          pressed &&
            canDecrease &&
            styles.pressed,
        ]}
      >
        <Ionicons
          name="remove"
          size={iconSize.lg}
          color={
            canDecrease
              ? colors.primary
              : colors.textLight
          }
        />
      </Pressable>

      <View
        accessible
        accessibilityLabel={`Hide count ${value}`}
        style={styles.valueContainer}
      >
        <AppText
          style={styles.value}
          align="center"
        >
          {value}
        </AppText>

        <AppText
          variant="caption"
          muted
          align="center"
        >
          selected
        </AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase hide count"
        accessibilityState={{
          disabled: !canIncrease,
        }}
        disabled={!canIncrease}
        onPress={increase}
        style={({ pressed }) => [
          styles.control,
          !canIncrease &&
            styles.disabled,
          pressed &&
            canIncrease &&
            styles.pressed,
        ]}
      >
        <Ionicons
          name="add"
          size={iconSize.lg}
          color={
            canIncrease
              ? colors.primary
              : colors.textLight
          }
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl,
  },

  control: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadows.card,
  },

  disabled: {
    opacity: 0.4,
    borderColor: colors.border,
  },

  pressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  valueContainer: {
    minWidth: 96,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },

  value: {
    color: colors.primaryDark,
    fontSize: typography.display + 8,
    lineHeight: 48,
    fontWeight: "900",
  },
});