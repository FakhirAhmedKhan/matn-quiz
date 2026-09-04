import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  buildProgressAccessibilityValue,
} from "../../accessibility/accessibility";

import {
  colors,
  radius,
} from "../../theme";

type ProgressBarProps = {
  value: number;

  accessibilityLabel?:
    string;

  style?:
    StyleProp<ViewStyle>;
};

export function ProgressBar({
  value,
  accessibilityLabel =
    "Progress",
  style,
}: ProgressBarProps) {
  const normalized =
    Math.min(
      1,
      Math.max(
        0,
        Number.isFinite(value)
          ? value
          : 0,
      ),
    );

  const accessibilityValue =
    buildProgressAccessibilityValue(
      normalized,
    );

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={
        accessibilityLabel
      }
      accessibilityValue={
        accessibilityValue
      }
      style={[
        styles.track,
        style,
      ]}
    >
      <View
        importantForAccessibility="no"
        accessible={false}
        style={[
          styles.progress,

          {
            width:
              `${normalized * 100}%`,
          },
        ]}
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    track: {
      width: "100%",
      height: 8,
      overflow: "hidden",
      borderRadius:
        radius.pill,
      backgroundColor:
        colors.border,
    },

    progress: {
      height: "100%",
      borderRadius:
        radius.pill,
      backgroundColor:
        colors.primary,
    },
  });