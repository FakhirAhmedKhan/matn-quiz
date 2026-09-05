import { Alert, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  BookDescriptionCard,
  BookDetailsHero,
  BookMetadataCard,
  BookReadingProgressCard,
} from "../../../src/components/book-details";
import { AppHeader, AppScreen } from "../../../src/components/layout";
import { AppButton, AppText } from "../../../src/components/ui";
import { useBookStore } from "../../../src/store/bookStore";
import { getBookProgress } from "../../../src/utils/books";
import { colors, iconSize, radius, spacing } from "../../../src/theme";

export default function BookDetailsScreen() {
  const params = useLocalSearchParams();

  const rawBookId = params.bookId;

  const bookId =
    typeof rawBookId === "string"
      ? rawBookId
      : Array.isArray(rawBookId)
        ? (rawBookId[0] ?? "")
        : "";

  const books = useBookStore((state) => state.books);

  const toggleFavorite = useBookStore((state) => state.toggleFavorite);

  const updateReadingProgress = useBookStore(
    (state) => state.updateReadingProgress,
  );

  const markBookOpened = useBookStore((state) => state.markBookOpened);

  const book = books.find((item) => item.id === bookId);

  if (!book) {
    return (
      <AppScreen>
        <View style={styles.page}>
          <AppHeader
            title="Book Details"
            showBack
            onBack={() => router.back()}
          />

          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="book-outline"
                size={iconSize.xl}
                color={colors.primary}
              />
            </View>

            <AppText variant="title" align="center">
              Book Not Found
            </AppText>

            <AppText muted align="center">
              This book is not available in the current demo library.
            </AppText>

            <AppButton
              label="Back to Books"
              onPress={() => router.replace("/books")}
            />
          </View>
        </View>
      </AppScreen>
    );
  }

  const progress = getBookProgress(book);

  function openReader() {
    markBookOpened(book!.id);

    router.push({
      pathname: "/books/[bookId]/read",
      params: {
        bookId: book!.id,
      },
    });
  }

  function restartBook() {
    if (progress.currentPage === 0) {
      return;
    }

    Alert.alert("Restart Book", "Reset reading progress back to page 0?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Restart",
        style: "destructive",
        onPress: () => updateReadingProgress(book!.id, 0),
      },
    ]);
  }

  function handleFavorite() {
    toggleFavorite(book!.id);
  }

  return (
    <AppScreen>
      <View style={styles.page}>
        <AppHeader
          title="Book Details"
          subtitle={
            progress.completed
              ? "Completed"
              : progress.started
                ? "Continue reading"
                : "Ready to read"
          }
          showBack
          onBack={() => router.back()}
        />

        <BookDetailsHero book={book} />

        <BookReadingProgressCard book={book} />

        <View style={styles.primaryActions}>
          <AppButton
            label={
              progress.completed
                ? "Read Again"
                : progress.started
                  ? `Continue from Page ${Math.max(1, progress.currentPage)}`
                  : "Start Reading"
            }
            size="lg"
            onPress={openReader}
          />

          <AppButton
            label={
              book.isFavorite ? "Remove from Favorites" : "Add to Favorites"
            }
            variant="secondary"
            onPress={handleFavorite}
          />
        </View>

        <BookDescriptionCard book={book} />

        <BookMetadataCard book={book} />

        <View style={styles.readerInfo}>
          <Ionicons
            name="reader-outline"
            size={iconSize.md}
            color={colors.primary}
          />

          <View style={styles.readerInfoText}>
            <AppText variant="subheading">Mobile Reader</AppText>

            <AppText variant="bodySmall" muted>
              Open this book in the dedicated reader. M17 will add page
              navigation, reader controls and progress updates.
            </AppText>
          </View>
        </View>

        <View style={styles.secondaryActions}>
          <AppButton
            label="Open Reader"
            variant="secondary"
            onPress={openReader}
          />

          <AppButton
            label="Restart Reading Progress"
            variant="ghost"
            disabled={progress.currentPage === 0}
            onPress={restartBook}
          />
        </View>

        <View style={styles.favoriteNotice}>
          <Ionicons
            name={book.isFavorite ? "heart" : "heart-outline"}
            size={iconSize.md}
            color={book.isFavorite ? colors.warning : colors.primary}
          />

          <AppText variant="bodySmall" style={styles.favoriteNoticeText}>
            {book.isFavorite
              ? "This book is saved in your favorites."
              : "Save this book to favorites for quicker access later."}
          </AppText>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    gap: spacing.xxl,
    paddingBottom: spacing.section,
  },

  primaryActions: {
    gap: spacing.md,
  },

  readerInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  readerInfoText: {
    flex: 1,
    gap: spacing.xs,
  },

  secondaryActions: {
    gap: spacing.md,
  },

  favoriteNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },

  favoriteNoticeText: {
    flex: 1,
    color: colors.primaryDark,
    fontWeight: "600",
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.section,
  },

  emptyIcon: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xxl,
    backgroundColor: colors.primarySoft,
  },
});
