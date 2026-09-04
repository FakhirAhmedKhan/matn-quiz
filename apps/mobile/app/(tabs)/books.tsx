import {
  router,
} from "expo-router";
import {
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import {
  BookCard,
  BookCategoryFilters,
  BookLibraryStats,
  BookSearchBar,
  BooksEmptyState,
  RecentBooks,
} from "../../src/components/books";
import {
  AppHeader,
  AppScreen,
} from "../../src/components/layout";
import {
  AppButton,
  AppText,
} from "../../src/components/ui";
import {
  useBookStore,
} from "../../src/store/bookStore";
import type {
  Book,
} from "../../src/types/book";
import {
  filterBooks,
  getBookLibraryStats,
  getRecentBooks,
} from "../../src/utils/books";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../src/theme";

export default function BooksScreen() {
  const books =
    useBookStore(
      (state) =>
        state.books,
    );

  const searchQuery =
    useBookStore(
      (state) =>
        state.searchQuery,
    );

  const categoryFilter =
    useBookStore(
      (state) =>
        state.categoryFilter,
    );

  const setSearchQuery =
    useBookStore(
      (state) =>
        state.setSearchQuery,
    );

  const setCategoryFilter =
    useBookStore(
      (state) =>
        state.setCategoryFilter,
    );

  const toggleFavorite =
    useBookStore(
      (state) =>
        state.toggleFavorite,
    );

  const markBookOpened =
    useBookStore(
      (state) =>
        state.markBookOpened,
    );

  const stats =
    getBookLibraryStats(
      books,
    );

  const filteredBooks =
    filterBooks(
      books,
      searchQuery,
      categoryFilter,
    );

  const recentBooks =
    getRecentBooks(
      books,
      3,
    );

  const filtered =
    Boolean(
      searchQuery.trim() ||
      categoryFilter !== "ALL",
    );

  function openBook(
    book: Book,
  ) {
    markBookOpened(
      book.id,
    );

    router.push({
      pathname:
        "/books/[bookId]",
      params: {
        bookId:
          book.id,
      },
    });
  }

  function resetFilters() {
    setSearchQuery("");
    setCategoryFilter(
      "ALL",
    );
  }

  return (
    <AppScreen>
      <View style={styles.page}>
        <AppHeader
          title="Books"
          subtitle={`${books.length} books in your library`}
          rightIcon="add-circle-outline"
          onRightPress={() =>
            router.push(
              "/books/upload",
            )
          }
        />

        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons
              name="library-outline"
              size={iconSize.lg}
              color={colors.primary}
            />
          </View>

          <View style={styles.introText}>
            <AppText variant="title">
              Your Reading Library
            </AppText>

            <AppText muted>
              Read Arabic and Islamic books,
              continue recent sessions and track
              your progress.
            </AppText>
          </View>
        </View>

        <BookLibraryStats
          stats={stats}
        />

        <View style={styles.searchSection}>
          <BookSearchBar
            value={searchQuery}
            onChangeText={
              setSearchQuery
            }
          />

          <BookCategoryFilters
            value={categoryFilter}
            onChange={
              setCategoryFilter
            }
          />
        </View>

        {!filtered ? (
          <RecentBooks
            books={recentBooks}
            onOpenBook={
              openBook
            }
            onToggleFavorite={
              toggleFavorite
            }
          />
        ) : null}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitle}>
            <Ionicons
              name="book-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <AppText variant="subheading">
              {filtered
                ? "Search Results"
                : "All Books"}
            </AppText>
          </View>

          <AppText
            variant="caption"
            muted
          >
            {filteredBooks.length}{" "}
            {filteredBooks.length === 1
              ? "book"
              : "books"}
          </AppText>
        </View>

        {filteredBooks.length > 0 ? (
          <View style={styles.books}>
            {filteredBooks.map(
              (book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onPress={() =>
                    openBook(
                      book,
                    )
                  }
                  onToggleFavorite={() =>
                    toggleFavorite(
                      book.id,
                    )
                  }
                />
              ),
            )}
          </View>
        ) : (
          <BooksEmptyState
            filtered={filtered}
            onResetFilters={
              resetFilters
            }
            onUpload={() =>
              router.push(
                "/books/upload",
              )
            }
          />
        )}

        <View style={styles.libraryActions}>
          <AppButton
            label="Add / Import Book"
            variant="secondary"
            onPress={() =>
              router.push(
                "/books/upload",
              )
            }
          />
        </View>

        <View style={styles.demoNotice}>
          <Ionicons
            name="information-circle-outline"
            size={iconSize.md}
            color={colors.primary}
          />

          <AppText
            variant="bodySmall"
            style={styles.demoNoticeText}
          >
            M15 uses demo library data. The next
            phases will build real book details,
            reading mode and local book import.
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

  intro: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingTop: spacing.md,
  },

  introIcon: {
    width: 52,
    height: 52,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  introText: {
    flex: 1,
    gap: spacing.xs,
  },

  searchSection: {
    gap: spacing.md,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  sectionTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  books: {
    gap: spacing.lg,
  },

  libraryActions: {
    gap: spacing.md,
  },

  demoNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  demoNoticeText: {
    flex: 1,
    color: colors.primaryDark,
  },
});