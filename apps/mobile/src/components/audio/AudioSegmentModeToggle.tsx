import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import type {
  AudioSegmentMode,
} from "../../types/audio";
import {
  AppText,
} from "../ui";
import {
  colors,
  radius,
  spacing,
} from "../../theme";

type AudioSegmentModeToggleProps = {
  value: AudioSegmentMode;
  onChange: (
    value: AudioSegmentMode,
  ) => void;
};

export function AudioSegmentModeToggle({
  value,
  onChange,
}: AudioSegmentModeToggleProps) {
  return (
    <View style={styles.container}>
      {(
        [
          {
            value:
              "SENTENCE",
            label:
              "Sentences",
          },
          {
            value:
              "VERSE",
            label:
              "Verses / Lines",
          },
        ] as const
      ).map(
        (option) => {
          const selected =
            value ===
            option.value;

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
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSoft,
  },

  option: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },

  selected: {
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