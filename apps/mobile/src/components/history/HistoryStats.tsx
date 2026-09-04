import {
  StyleSheet,
  View,
} from "react-native";

import type {
  QuizHistoryStats,
} from "../../types/history";
import {
  spacing,
} from "../../theme";
import {
  HistoryStatCard,
} from "./HistoryStatCard";

type HistoryStatsProps = {
  stats: QuizHistoryStats;
};

export function HistoryStats({
  stats,
}: HistoryStatsProps) {
  return (
    <View style={styles.container}>
      <HistoryStatCard
        label="Sessions"
        value={String(
          stats.totalSessions,
        )}
        icon="library-outline"
      />

      <HistoryStatCard
        label="Average"
        value={`${stats.averageScore}%`}
        icon="stats-chart-outline"
      />

      <HistoryStatCard
        label="Best"
        value={`${stats.bestScore}%`}
        icon="trophy-outline"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    gap: spacing.sm,
  },
});