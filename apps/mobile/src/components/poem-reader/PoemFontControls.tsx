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

export type PoemFontSize =
  | "SMALL"
  | "MEDIUM"
  | "LARGE";

type PoemFontControlsProps = {
  value: PoemFontSize;
  onChange: (
    value: PoemFontSize,
  ) => void;
};

const OPTIONS: {
  value: PoemFontSize;
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

export function PoemFontControls({
  value,
  onChange,
}: PoemFontControlsProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.heading}>
        <Ionicons
          name="text-outline"
          size={iconSize.sm}
          color={colors.primary}
        />

        <AppText
          variant="bodySmall"
          muted
        >
          Arabic text size
        </AppText>
      </View>

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
                accessibilityLabel={`Set poem text size ${option.value.toLowerCase()}`}
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
                    styles.label,
                    selected &&
                      styles.selectedLabel,
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
  wrapper: {
    gap: spacing.sm,
  },

  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
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

  label: {
    color: colors.primaryDark,
    fontWeight: "900",
  },

  selectedLabel: {
    color: colors.textInverse,
  },
});