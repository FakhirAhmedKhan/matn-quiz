import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  AppText,
} from "../ui";
import {
  colors,
  radius,
  spacing,
} from "../../theme";

type HideCountPresetsProps = {
  values: number[];
  selectedValue: number;
  onSelect: (
    value: number,
  ) => void;
};

export function HideCountPresets({
  values,
  selectedValue,
  onSelect,
}: HideCountPresetsProps) {
  if (values.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {values.map((value) => {
        const selected =
          selectedValue === value;

        return (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityLabel={`Set hide count to ${value}`}
            accessibilityState={{
              selected,
            }}
            onPress={() =>
              onSelect(value)
            }
            style={({ pressed }) => [
              styles.preset,
              selected &&
                styles.selectedPreset,
              pressed &&
                styles.pressed,
            ]}
          >
            <AppText
              variant="bodySmall"
              style={[
                styles.text,
                selected &&
                  styles.selectedText,
              ]}
            >
              {value}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.sm,
  },

  preset: {
    minWidth: 48,
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },

  selectedPreset: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },

  pressed: {
    opacity: 0.75,
  },

  text: {
    color: colors.primaryDark,
    fontWeight: "800",
  },

  selectedText: {
    color: colors.textInverse,
  },
});