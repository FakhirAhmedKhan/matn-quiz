import {
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  AppButton,
  AppText,
} from "../ui";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type HistoryEmptyStateProps = {
  onCreateQuiz: () => void;
};

export function HistoryEmptyState({
  onCreateQuiz,
}: HistoryEmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons
          name="time-outline"
          size={iconSize.xl}
          color={colors.primary}
        />
      </View>

      <AppText
        variant="title"
        align="center"
      >
        No Quiz History Yet
      </AppText>

      <AppText
        muted
        align="center"
      >
        Complete your first quiz and its
        score will appear here automatically.
      </AppText>

      <AppButton
        label="Create First Quiz"
        onPress={onCreateQuiz}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.section,
  },

  icon: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xxl,
    backgroundColor: colors.primarySoft,
  },
});