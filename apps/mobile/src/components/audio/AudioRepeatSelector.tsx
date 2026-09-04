import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import type {
  AudioRepeatMode,
} from "../../types/audio";
import {
  AUDIO_REPEAT_OPTIONS,
} from "../../utils/audio";
import {
  AppText,
} from "../ui";
import {
  colors,
  radius,
  spacing,
} from "../../theme";

type AudioRepeatSelectorProps = {
  value: AudioRepeatMode;
  onChange: (
    value: AudioRepeatMode,
  ) => void;
};

export function AudioRepeatSelector({
  value,
  onChange,
}: AudioRepeatSelectorProps) {
  return (
    <View style={styles.container}>
      {AUDIO_REPEAT_OPTIONS.map(
        (option) => {
          const selected =
            value ===
            option.value;

          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityLabel={`Repeat ${option.label}`}
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
    gap: spacing.sm,
  },

  option: {
    flex: 1,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },

  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },

  pressed: {
    opacity: 0.75,
  },

  text: {
    color: colors.primaryDark,
    fontWeight: "900",
  },

  selectedText: {
    color: colors.textInverse,
  },
});