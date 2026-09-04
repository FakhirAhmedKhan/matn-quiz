import {
  StyleSheet,
  View,
} from "react-native";

import {
  AppButton,
} from "../ui";
import { spacing } from "../../theme";

type StudyControlsProps = {
  hasHidden: boolean;
  allRevealed: boolean;
  onRevealNext: () => void;
  onRevealAll: () => void;
  onHideAll: () => void;
};

export function StudyControls({
  hasHidden,
  allRevealed,
  onRevealNext,
  onRevealAll,
  onHideAll,
}: StudyControlsProps) {
  return (
    <View style={styles.container}>
      {!allRevealed ? (
        <>
          <AppButton
            label="Reveal Next"
            disabled={!hasHidden}
            onPress={onRevealNext}
          />

          <AppButton
            label="Reveal All"
            variant="secondary"
            disabled={!hasHidden}
            onPress={onRevealAll}
          />
        </>
      ) : (
        <AppButton
          label="Hide All Answers"
          variant="secondary"
          onPress={onHideAll}
        />
      )}

      {!allRevealed ? (
        <AppButton
          label="Reset Study"
          variant="ghost"
          onPress={onHideAll}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing.md,
  },
});