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
  BOOK_CATEGORY_LABELS,
} from "../../utils/books";
import {
  AppCard,
  AppText,
} from "../ui";
import {
  colors,
  iconSize,
  spacing,
} from "../../theme";

type BookMetadataCardProps = {
  book: Book;
};

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "Not yet";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Unknown";
  }

  return date.toLocaleDateString();
}

export function BookMetadataCard({
  book,
}: BookMetadataCardProps) {
  const rows = [
    {
      label: "Author",
      value: book.author,
    },
    {
      label: "Category",
      value:
        BOOK_CATEGORY_LABELS[
          book.category
        ],
    },
    {
      label: "Pages",
      value:
        String(
          book.totalPages,
        ),
    },
    {
      label: "Current page",
      value:
        String(
          book.currentPage,
        ),
    },
    {
      label: "Source",
      value:
        book.sourceLabel,
    },
    {
      label: "Added",
      value:
        formatDate(
          book.addedAt,
        ),
    },
    {
      label: "Last opened",
      value:
        formatDate(
          book.lastOpenedAt,
        ),
    },
  ];

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name="information-circle-outline"
          size={iconSize.md}
          color={colors.primary}
        />

        <AppText variant="subheading">
          Book Information
        </AppText>
      </View>

      <View style={styles.rows}>
        {rows.map((row) => (
          <View
            key={row.label}
            style={styles.row}
          >
            <AppText
              variant="bodySmall"
              muted
            >
              {row.label}
            </AppText>

            <AppText
              variant="bodySmall"
              style={styles.value}
              numberOfLines={2}
            >
              {row.value}
            </AppText>
          </View>
        ))}
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
    gap: spacing.sm,
  },

  rows: {
    gap: spacing.md,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  value: {
    flex: 1,
    color: colors.primaryDark,
    fontWeight: "800",
    textAlign: "right",
  },
});