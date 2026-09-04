import {
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import {
  AppCard,
  AppText,
  ProgressBar,
} from "../ui";
import {
  getBookPagePercentage,
  getBookPageProgress,
} from "../../utils/bookReader";
import {
  colors,
  iconSize,
  spacing,
} from "../../theme";

type BookReaderProgressCardProps = {
  currentPage: number;
  totalPages: number;
};

export function BookReaderProgressCard({
  currentPage,
  totalPages,
}: BookReaderProgressCardProps) {
  const percentage =
    getBookPagePercentage(
      currentPage,
      totalPages,
    );

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Ionicons
            name="bookmark-outline"
            size={iconSize.md}
            color={colors.primary}
          />

          <AppText variant="subheading">
            Reading Progress
          </AppText>
        </View>

        <AppText
          variant="subheading"
          style={styles.percentage}
        >
          {percentage}%
        </AppText>
      </View>

      <ProgressBar
        value={
          getBookPageProgress(
            currentPage,
            totalPages,
          )
        }
      />

      <View style={styles.footer}>
        <AppText
          variant="caption"
          muted
        >
          Page {currentPage}
        </AppText>

        <AppText
          variant="caption"
          muted
        >
          {totalPages} total pages
        </AppText>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  title: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  percentage: {
    color: colors.primary,
    fontWeight: "900",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
});