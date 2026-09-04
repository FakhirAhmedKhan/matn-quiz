import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "../../theme";

type StepIndicatorProps = {
  current: number;
  total: number;
};

export function StepIndicator({
  current,
  total,
}: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const step = index + 1;
        const active = step === current;
        const complete = step < current;

        return (
          <View key={step} style={styles.item}>
            <View
              style={[
                styles.circle,
                complete && styles.completeCircle,
                active && styles.activeCircle,
              ]}
            >
              <Text
                style={[
                  styles.label,
                  (complete || active) && styles.activeLabel,
                ]}
              >
                {step}
              </Text>
            </View>

            {step < total ? (
              <View
                style={[
                  styles.line,
                  complete && styles.completeLine,
                ]}
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
  },

  circle: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.backgroundSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },

  activeCircle: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  completeCircle: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
  },

  label: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "800",
  },

  activeLabel: {
    color: colors.primaryDark,
  },

  line: {
    width: 34,
    height: 2,
    marginHorizontal: spacing.xs,
    backgroundColor: colors.border,
  },

  completeLine: {
    backgroundColor: colors.primary,
  },
});