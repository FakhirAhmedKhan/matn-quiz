import {
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  BookLibraryStats as BookLibraryStatsType,
} from "../../types/book";
import {
  AppText,
} from "../ui";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type BookLibraryStatsProps = {
  stats: BookLibraryStatsType;
};

export function BookLibraryStats({
  stats,
}: BookLibraryStatsProps) {
  const items = [
    {
      label: "Books",
      value:
        stats.totalBooks,
      icon:
        "library-outline" as const,
    },
    {
      label: "Reading",
      value:
        stats.startedBooks,
      icon:
        "book-outline" as const,
    },
    {
      label: "Completed",
      value:
        stats.completedBooks,
      icon:
        "checkmark-circle-outline" as const,
    },
    {
      label: "Favorites",
      value:
        stats.favoriteBooks,
      icon:
        "heart-outline" as const,
    },
  ];

  return (
    <View style={styles.container}>
      {items.map(
        (item) => (
          <View
            key={item.label}
            style={styles.card}
          >
            <Ionicons
              name={item.icon}
              size={iconSize.sm}
              color={colors.primary}
            />

            <AppText
              variant="subheading"
              style={styles.value}
              align="center"
            >
              {item.value}
            </AppText>

            <AppText
              variant="caption"
              muted
              align="center"
            >
              {item.label}
            </AppText>
          </View>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    gap: spacing.sm,
  },

  card: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },

  value: {
    color: colors.primaryDark,
    fontWeight: "900",
  },
});