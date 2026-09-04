import {
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import {
  AppButton,
  AppText,
} from "../ui";
import {
  colors,
  iconSize,
  spacing,
} from "../../theme";

type PoemNavigationControlsProps = {
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
};

export function PoemNavigationControls({
  currentIndex,
  total,
  onPrevious,
  onNext,
  onFirst,
  onLast,
}: PoemNavigationControlsProps) {
  const canPrevious =
    currentIndex > 0;

  const canNext =
    currentIndex <
    total - 1;

  return (
    <View style={styles.container}>
      <View style={styles.position}>
        <Ionicons
          name="navigate-outline"
          size={iconSize.sm}
          color={colors.primary}
        />

        <AppText
          variant="bodySmall"
          style={styles.positionText}
        >
          {currentIndex + 1} / {total}
        </AppText>
      </View>

      <View style={styles.primaryActions}>
        <View style={styles.button}>
          <AppButton
            label="Previous"
            variant="secondary"
            disabled={!canPrevious}
            onPress={onPrevious}
          />
        </View>

        <View style={styles.button}>
          <AppButton
            label={
              canNext
                ? "Next Verse"
                : "Last Verse"
            }
            disabled={!canNext}
            onPress={onNext}
          />
        </View>
      </View>

      <View style={styles.jumpActions}>
        <AppButton
          label="First"
          variant="ghost"
          disabled={!canPrevious}
          onPress={onFirst}
        />

        <AppButton
          label="Last"
          variant="ghost"
          disabled={!canNext}
          onPress={onLast}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },

  position: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },

  positionText: {
    color: colors.primaryDark,
    fontWeight: "900",
  },

  primaryActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  button: {
    flex: 1,
  },

  jumpActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
  },
});