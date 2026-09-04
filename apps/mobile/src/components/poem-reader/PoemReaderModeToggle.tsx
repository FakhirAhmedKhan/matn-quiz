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

export type PoemReaderMode =
  | "FOCUS"
  | "ALL";

type PoemReaderModeToggleProps = {
  mode: PoemReaderMode;
  onChange: (
    mode: PoemReaderMode,
  ) => void;
};

export function PoemReaderModeToggle({
  mode,
  onChange,
}: PoemReaderModeToggleProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Show one verse at a time"
        accessibilityState={{
          selected:
            mode === "FOCUS",
        }}
        onPress={() =>
          onChange("FOCUS")
        }
        style={({ pressed }) => [
          styles.option,
          mode === "FOCUS" &&
            styles.selected,
          pressed &&
            styles.pressed,
        ]}
      >
        <Ionicons
          name="albums-outline"
          size={iconSize.sm}
          color={
            mode === "FOCUS"
              ? colors.textInverse
              : colors.primary
          }
        />

        <AppText
          variant="bodySmall"
          style={[
            styles.label,
            mode === "FOCUS" &&
              styles.selectedLabel,
          ]}
        >
          Focus
        </AppText>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Show all poem verses"
        accessibilityState={{
          selected:
            mode === "ALL",
        }}
        onPress={() =>
          onChange("ALL")
        }
        style={({ pressed }) => [
          styles.option,
          mode === "ALL" &&
            styles.selected,
          pressed &&
            styles.pressed,
        ]}
      >
        <Ionicons
          name="list-outline"
          size={iconSize.sm}
          color={
            mode === "ALL"
              ? colors.textInverse
              : colors.primary
          }
        />

        <AppText
          variant="bodySmall"
          style={[
            styles.label,
            mode === "ALL" &&
              styles.selectedLabel,
          ]}
        >
          Show All
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },

  option: {
    flex: 1,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radius.md,
  },

  selected: {
    backgroundColor: colors.primary,
  },

  pressed: {
    opacity: 0.75,
  },

  label: {
    color: colors.primaryDark,
    fontWeight: "800",
  },

  selectedLabel: {
    color: colors.textInverse,
  },
});