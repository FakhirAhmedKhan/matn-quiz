import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import type {
  AudioSpeed,
} from "../../types/audio";
import {
  AUDIO_SPEEDS,
} from "../../utils/audio";
import {
  AppText,
} from "../ui";
import {
  colors,
  radius,
  spacing,
} from "../../theme";

type AudioSpeedSelectorProps = {
  value: AudioSpeed;
  onChange: (
    value: AudioSpeed,
  ) => void;
};

export function AudioSpeedSelector({
  value,
  onChange,
}: AudioSpeedSelectorProps) {
  return (
    <View style={styles.container}>
      {AUDIO_SPEEDS.map(
        (speed) => {
          const selected =
            speed === value;

          return (
            <Pressable
              key={speed}
              accessibilityRole="button"
              accessibilityLabel={`Set playback speed ${speed} times`}
              accessibilityState={{
                selected,
              }}
              onPress={() =>
                onChange(speed)
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
                {speed}×
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
    flex: 1,
    minWidth: 66,
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