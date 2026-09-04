import {
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  BookCategory,
  BookFileMetadata,
} from "../../types/book";
import {
  BOOK_CATEGORY_LABELS,
} from "../../utils/books";
import {
  formatFileSize,
} from "../../utils/bookImport";
import {
  AppCard,
  AppText,
  ArabicText,
} from "../ui";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type BookImportPreviewCardProps = {
  title: string;
  arabicTitle: string;
  author: string;
  description: string;
  category: BookCategory;
  totalPages: number;
  file: BookFileMetadata | null;
};

export function BookImportPreviewCard({
  title,
  arabicTitle,
  author,
  description,
  category,
  totalPages,
  file,
}: BookImportPreviewCardProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name="eye-outline"
          size={iconSize.md}
          color={colors.primary}
        />

        <AppText variant="subheading">
          Import Preview
        </AppText>
      </View>

      <View style={styles.book}>
        <View style={styles.cover}>
          <Ionicons
            name="book"
            size={iconSize.lg}
            color={colors.primary}
          />
        </View>

        <View style={styles.bookInfo}>
          {arabicTitle.trim() ? (
            <ArabicText
              size="small"
              numberOfLines={1}
            >
              {arabicTitle.trim()}
            </ArabicText>
          ) : null}

          <AppText
            variant="subheading"
            numberOfLines={2}
          >
            {title.trim() ||
              "Untitled Book"}
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            {author.trim() ||
              "Unknown author"}
          </AppText>
        </View>
      </View>

      {description.trim() ? (
        <AppText
          variant="bodySmall"
          muted
          numberOfLines={3}
        >
          {description.trim()}
        </AppText>
      ) : null}

      <View style={styles.rows}>
        <View style={styles.row}>
          <AppText
            variant="bodySmall"
            muted
          >
            Category
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.value}
          >
            {BOOK_CATEGORY_LABELS[
              category
            ]}
          </AppText>
        </View>

        <View style={styles.row}>
          <AppText
            variant="bodySmall"
            muted
          >
            Estimated pages
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.value}
          >
            {totalPages || 0}
          </AppText>
        </View>

        <View style={styles.row}>
          <AppText
            variant="bodySmall"
            muted
          >
            File
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.value}
            numberOfLines={1}
          >
            {file
              ? file.fileName
              : "Not selected"}
          </AppText>
        </View>

        <View style={styles.row}>
          <AppText
            variant="bodySmall"
            muted
          >
            Size
          </AppText>

          <AppText
            variant="bodySmall"
            style={styles.value}
          >
            {file
              ? formatFileSize(
                  file.sizeBytes,
                )
              : "—"}
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
    gap: spacing.sm,
  },

  book: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  cover: {
    width: 52,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },

  bookInfo: {
    flex: 1,
    gap: spacing.xs,
  },

  rows: {
    gap: spacing.md,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
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