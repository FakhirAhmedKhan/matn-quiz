import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import type {
  BookReaderFontSize,
} from "../../utils/bookReader";
import {
  AppText,
} from "../ui";
import {
  colors,
  radius,
  spacing,
} from "../../theme";

type BookReaderFontControlsProps = {
  value: BookReaderFontSize;
  onChange: (
    value: BookReaderFontSize,
  ) => void;
};

const OPTIONS: {
  value: BookReaderFontSize;
  label: string;
}[] = [
  {
    value: "SMALL",
    label: "A",
  },
  {
    value: "MEDIUM",
    label: "A+",
  },
  {
    value: "LARGE",
    label: "A++",
  },
];

export function BookReaderFontControls({
  value,
  onChange,
}: BookReaderFontControlsProps) {
  return (
    <View style={styles.container}>
      <AppText
        variant="bodySmall"
        muted
        align="center"
      >
        Arabic text size
      </AppText>

      <View style={styles.options}>
        {OPTIONS.map(
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
                accessibilityLabel={`Set reader font size ${option.value.toLowerCase()}`}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },

  options: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
  },

  option: {
    minWidth: 64,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
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