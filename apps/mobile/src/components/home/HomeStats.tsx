import {
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import type { HomeStat } from "../../types/home";
import { SectionHeader } from "../ui";
import { spacing } from "../../theme";
import { StatCard } from "./StatCard";

type HomeStatsProps = { stats: HomeStat[]; };

function getStatIcon(
  id: HomeStat["id"],
) {
  if (id === "accuracy") {
    return "analytics-outline" as const;
  }

  if (id === "streak") {
    return "flame-outline" as const;
  }

  return "school-outline" as const;
}

export function HomeStats({
  stats,
}: HomeStatsProps) {
  const { width } = useWindowDimensions();

  const compact = width < 340;

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Your Progress"
        description="A quick look at your demo learning activity."
      />

      <View
        style={[
          styles.grid,
          compact && styles.compactGrid,
        ]}
      >
        {stats.map((stat) => (
          <View
            key={stat.id}
            style={
              compact
                ? styles.compactItem
                : styles.normalItem
            }
          >
            <StatCard
              value={stat.value}
              label={stat.label}
              icon={getStatIcon(stat.id)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.lg,
  },

  grid: {
    width: "100%",
    flexDirection: "row",
    gap: spacing.sm,
  },

  compactGrid: {
    flexDirection: "column",
  },

  normalItem: {
    flex: 1,
  },

  compactItem: {
    width: "100%",
  },
});