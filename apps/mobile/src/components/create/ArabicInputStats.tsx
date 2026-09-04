import {
  StyleSheet,
  View,
} from "react-native";

import type {
  ArabicInputStats as ArabicInputStatsType,
} from "../../types/quiz";
import { spacing } from "../../theme";
import { InputStatCard } from "./InputStatCard";

type ArabicInputStatsProps = {
  stats: ArabicInputStatsType;
};

export function ArabicInputStats({
  stats,
}: ArabicInputStatsProps) {
  return (
    <View style={styles.row}>
      <InputStatCard
        label="Characters"
        value={stats.characters}
        icon="text-outline"
      />

      <InputStatCard
        label="Words"
        value={stats.words}
        icon="reader-outline"
      />

      <InputStatCard
        label="Lines"
        value={stats.lines}
        icon="reorder-three-outline"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    gap: spacing.sm,
  },
});