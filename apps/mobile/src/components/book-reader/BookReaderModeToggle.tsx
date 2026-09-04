import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  BookReaderMode,
} from "../../utils/bookReader";
import {
  AppText,
} from "../ui";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type BookReaderModeToggleProps = {
  value: BookReaderMode;
  onChange: (
    value: BookReaderMode,
  ) => void;
};

export function BookReaderModeToggle({
  value,
  onChange,
}: BookReaderModeToggleProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Normal reading mode"
        accessibilityState={{
          selected:
            value === "READING",
        }}
        onPress={() =>
          onChange("READING")
        }
        style={({ pressed }) => [
          styles.option,
          value === "READING" &&
            styles.selected,
          pressed &&
            styles.pressed,
        ]}
      >
        <Ionicons
          name="book-outline"
          size={iconSize.sm}
          color={
            value === "READING"
              ? colors.textInverse
              : colors.primary
          }
        />

        <AppText
          variant="bodySmall"
          style={[
            styles.text,
            value === "READING" &&
              styles.selectedText,
          ]}
        >
          Reading
        </AppText>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Focus reading mode"
        accessibilityState={{
          selected:
            value === "FOCUS",
        }}
        onPress={() =>
          onChange("FOCUS")
        }
        style={({ pressed }) => [
          styles.option,
          value === "FOCUS" &&
            styles.selected,
          pressed &&
            styles.pressed,
        ]}
      >
        <Ionicons
          name="eye-outline"
          size={iconSize.sm}
          color={
            value === "FOCUS"
              ? colors.textInverse
              : colors.primary
          }
        />

        <AppText
          variant="bodySmall"
          style={[
            styles.text,
            value === "FOCUS" &&
              styles.selectedText,
          ]}
        >
          Focus
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

  text: {
    color: colors.primaryDark,
    fontWeight: "800",
  },

  selectedText: {
    color: colors.textInverse,
  },
});