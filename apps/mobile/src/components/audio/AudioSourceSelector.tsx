import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  AudioSource,
  AudioSourceKind,
} from "../../types/audio";
import {
  AppText,
} from "../ui";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type AudioSourceSelectorProps = {
  sources: AudioSource[];
  value: AudioSourceKind;
  onChange: (
    value: AudioSourceKind,
  ) => void;
};

function getIcon(
  kind: AudioSourceKind,
) {
  switch (kind) {
    case "QUIZ":
      return "school-outline" as const;

    case "POEM":
      return "book-outline" as const;

    default:
      return "volume-high-outline" as const;
  }
}

export function AudioSourceSelector({
  sources,
  value,
  onChange,
}: AudioSourceSelectorProps) {
  return (
    <View style={styles.container}>
      {sources.map(
        (source) => {
          const selected =
            source.kind ===
            value;

          return (
            <Pressable
              key={source.kind}
              accessibilityRole="button"
              accessibilityLabel={`Use ${source.title} for audio`}
              accessibilityState={{
                selected,
                disabled:
                  !source.available,
              }}
              disabled={
                !source.available
              }
              onPress={() =>
                onChange(
                  source.kind,
                )
              }
              style={({ pressed }) => [
                styles.card,
                selected &&
                  styles.selected,
                !source.available &&
                  styles.disabled,
                pressed &&
                  source.available &&
                  styles.pressed,
              ]}
            >
              <Ionicons
                name={
                  getIcon(
                    source.kind,
                  )
                }
                size={iconSize.md}
                color={
                  selected
                    ? colors.textInverse
                    : colors.primary
                }
              />

              <AppText
                variant="bodySmall"
                align="center"
                style={[
                  styles.title,
                  selected &&
                    styles.selectedText,
                ]}
                numberOfLines={2}
              >
                {source.title}
              </AppText>

              {!source.available ? (
                <AppText
                  variant="caption"
                  muted
                  align="center"
                >
                  Empty
                </AppText>
              ) : null}
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

  card: {
    flex: 1,
    minHeight: 96,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },

  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },

  disabled: {
    opacity: 0.42,
  },

  pressed: {
    opacity: 0.75,
  },

  title: {
    color: colors.primaryDark,
    fontWeight: "800",
  },

  selectedText: {
    color: colors.textInverse,
  },
});