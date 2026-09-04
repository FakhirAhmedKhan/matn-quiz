import { StyleSheet, View } from "react-native";

import { colors, radius } from "../../theme";

type ProgressBarProps = {
  value: number;
  height?: number;
};

export function ProgressBar({
  value,
  height = 8,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value));
  const width = `${Math.round(clamped * 100)}%` as `${number}%`;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: 100,
        now: Math.round(clamped * 100),
      }}
      style={[styles.track, { height }]}
    >
      <View style={[styles.fill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: colors.backgroundSoft,
    borderRadius: radius.pill,
  },

  fill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
});