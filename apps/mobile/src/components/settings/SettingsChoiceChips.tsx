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

type Choice<T extends string> = {
  value: T;
  label: string;
};

type SettingsChoiceChipsProps<
  T extends string,
> = {
  value: T;

  options:
    readonly Choice<T>[];

  onChange: (
    value: T,
  ) => void;
};

export function SettingsChoiceChips<
  T extends string,
>({
  value,
  options,
  onChange,
}: SettingsChoiceChipsProps<T>) {
  return (
    <View style={styles.container}>
      {options.map(
        (option) => {
          const selected =
            option.value ===
            value;

          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{
                selected,
              }}
              onPress={() =>
                onChange(
                  option.value,
                )
              }
              style={({ pressed }) => [
                styles.option,
                selected &&
                  styles.selected,
                pressed &&
                  styles.pressed,
              ]}
            >
              <AppText
                variant="bodySmall"
                align="center"
                style={[
                  styles.text,
                  selected &&
                    styles.selectedText,
                ]}
              >
                {option.label}
              </AppText>
            </Pressable>
          );
        },
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  option: {
    flexGrow: 1,
    minWidth: 82,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor:
      colors.borderStrong,
    borderRadius:
      radius.pill,
    backgroundColor:
      colors.surface,
  },

  selected: {
    borderColor:
      colors.primary,
    backgroundColor:
      colors.primary,
  },

  pressed: {
    opacity: 0.75,
  },

  text: {
    color:
      colors.primaryDark,
    fontWeight: "800",
  },

  selectedText: {
    color:
      colors.textInverse,
  },
});