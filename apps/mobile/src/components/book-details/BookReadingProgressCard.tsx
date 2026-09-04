import {
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  Book,
} from "../../types/book";
import {
  getBookProgress,
  getBookStatusLabel,
} from "../../utils/books";
import {
  AppCard,
  AppText,
  ProgressBar,
} from "../ui";
import {
  colors,
  iconSize,
  spacing,
} from "../../theme";

type BookReadingProgressCardProps = {
  book: Book;
};

export function BookReadingProgressCard({
  book,
}: BookReadingProgressCardProps) {
  const progress =
    getBookProgress(book);

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Ionicons
            name="book-outline"
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
          {progress.percentage}%
        </AppText>
      </View>

      <ProgressBar
        value={
          progress.percentage /
          100
        }
      />

      <View style={styles.stats}>
        <View style={styles.stat}>
          <AppText
            variant="subheading"
            style={styles.value}
          >
            {progress.currentPage}
          </AppText>

          <AppText
            variant="caption"
            muted
            align="center"
          >
            Current Page
          </AppText>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <AppText
            variant="subheading"
            style={styles.value}
          >
            {progress.totalPages}
          </AppText>

          <AppText
            variant="caption"
            muted
            align="center"
          >
            Total Pages
          </AppText>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <AppText
            variant="bodySmall"
            style={styles.status}
            align="center"
          >
            {getBookStatusLabel(
              book,
            )}
          </AppText>

          <AppText
            variant="caption"
            muted
            align="center"
          >
            Status
          </AppText>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  heading: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  percentage: {
    color: colors.primary,
    fontWeight: "900",
  },

  stats: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  stat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },

  divider: {
    width: 1,
    marginVertical: spacing.sm,
    backgroundColor: colors.border,
  },

  value: {
    color: colors.primaryDark,
    fontWeight: "900",
  },

  status: {
    color: colors.primaryDark,
    fontWeight: "800",
  },
});