import {
  StyleSheet,
  View,
} from "react-native";

import {
  AppButton,
  AppText,
} from "../ui";
import {
  colors,
  spacing,
} from "../../theme";

type BookPageNavigationProps = {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
};

export function BookPageNavigation({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onFirst,
  onLast,
}: BookPageNavigationProps) {
  const canPrevious =
    currentPage > 1;

  const canNext =
    currentPage <
    totalPages;

  return (
    <View style={styles.container}>
      <AppText
        variant="bodySmall"
        align="center"
        style={styles.position}
      >
        Page {currentPage} of {totalPages}
      </AppText>

      <View style={styles.primary}>
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
                ? "Next Page"
                : "Last Page"
            }
            disabled={!canNext}
            onPress={onNext}
          />
        </View>
      </View>

      <View style={styles.secondary}>
        <AppButton
          label="First Page"
          variant="ghost"
          disabled={!canPrevious}
          onPress={onFirst}
        />

        <AppButton
          label="Last Page"
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
    color: colors.primaryDark,
    fontWeight: "900",
  },

  primary: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  button: {
    flex: 1,
  },

  secondary: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
  },
});