import {
  StyleSheet,
  View,
} from "react-native";

import type {
  PoemStats,
} from "../../types/poem";
import {
  spacing,
} from "../../theme";
import {
  PoemStatCard,
} from "./PoemStatCard";

type PoemInputStatsProps = {
  stats: PoemStats;
};

export function PoemInputStats({
  stats,
}: PoemInputStatsProps) {
  return (
    <View style={styles.container}>
      <PoemStatCard
        label="Words"
        value={stats.words}
        icon="text-outline"
      />

      <PoemStatCard
        label="Verses"
        value={stats.verses}
        icon="reader-outline"
      />

      <PoemStatCard
        label="Lines"
        value={stats.lines}
        icon="reorder-three-outline"
      />

      <PoemStatCard
        label="Stanzas"
        value={stats.stanzas}
        icon="layers-outline"
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