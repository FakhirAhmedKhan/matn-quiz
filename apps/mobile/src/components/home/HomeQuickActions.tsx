import { StyleSheet, useWindowDimensions, View } from "react-native";

import type {
  HomeQuickAction,
} from "../../types/home";
import { SectionHeader } from "../ui";
import { spacing } from "../../theme";
import { QuickActionCard } from "./QuickActionCard";

type HomeQuickActionsProps = {
  actions: HomeQuickAction[];
  onActionPress: (
    id: HomeQuickAction["id"],
  ) => void;
};

export function HomeQuickActions({
  actions,
  onActionPress,
}: HomeQuickActionsProps) {
  const { width } = useWindowDimensions();

  const singleColumn = width < 360;

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Explore"
        description="More ways to study and organize your learning."
      />

      <View style={styles.grid}>
        {actions.map((action) => (
          <QuickActionCard
            key={action.id}
            title={action.title}
            description={action.description}
            icon={action.icon}
            onPress={() =>
              onActionPress(action.id)
            }
            style={
              singleColumn
                ? styles.fullWidth
                : styles.halfWidth
            }
          />
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
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  halfWidth: {
    width: "47.5%",
  },

  fullWidth: {
    width: "100%",
  },
});