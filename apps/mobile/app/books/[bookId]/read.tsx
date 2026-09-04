import { useSettingsStore } from "../../../src/store/settingsStore";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import {
  Ionicons,
} from "@expo/vector-icons";

import {
  BookJumpToPage,
  BookPageCard,
  BookPageNavigation,
  BookReaderFontControls,
  BookReaderModeToggle,
  BookReaderProgressCard,
} from "../../../src/components/book-reader";
import {
  AppHeader,
  AppScreen,
} from "../../../src/components/layout";
import {
  AppButton,
  AppCard,
  AppText,
  ArabicText,
} from "../../../src/components/ui";
import {
  useBookStore,
} from "../../../src/store/bookStore";
import {
  createDemoBookPage,
  getBookPagePercentage,
  getInitialReaderPage,
  type BookReaderFontSize,
  type BookReaderMode,
} from "../../../src/utils/bookReader";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../../src/theme";

export default function BookReaderScreen() {
  const params =
    useLocalSearchParams();

  const rawBookId =
    params.bookId;

  const bookId =
    typeof rawBookId ===
    "string"
      ? rawBookId
      : Array.isArray(rawBookId)
        ? rawBookId[0] ?? ""
        : "";

  const books =
    useBookStore(
      (state) =>
        state.books,
    );

  const updateReadingProgress =
    useBookStore(
      (state) =>
        state.updateReadingProgress,
    );

  const markBookOpened =
    useBookStore(
      (state) =>
        state.markBookOpened,
    );

  const book =
    books.find(
      (item) =>
        item.id === bookId,
    );

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    readerMode,
    setReaderMode,
  ] = useState<BookReaderMode>(() => useSettingsStore.getState().defaultBookReaderMode);

  const [
    fontSize,
    setFontSize,
  ] = useState<BookReaderFontSize>(() => useSettingsStore.getState().readerFontSize);

  useEffect(() => {
    if (!book) {
      return;
    }

    const initialPage =
      getInitialReaderPage(
        book,
      );

    setCurrentPage(
      initialPage,
    );

    markBookOpened(
      book!.id,
    );
  }, [
    book?.id,
    markBookOpened,
  ]);

  const demoPage =
    useMemo(
      () =>
        book
          ? createDemoBookPage(
              book,
              currentPage,
            )
          : null,
      [
        book,
        currentPage,
      ],
    );

  if (!book) {
    return (
      <AppScreen>
        <View style={styles.page}>
          <AppHeader
            title="Book Reader"
            showBack
            onBack={() =>
              router.back()
            }
          />

          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="book-outline"
                size={iconSize.xl}
                color={colors.primary}
              />
            </View>

            <AppText
              variant="title"
              align="center"
            >
              Book Not Found
            </AppText>

            <AppText
              muted
              align="center"
            >
              This book is not available in the
              current library.
            </AppText>

            <AppButton
              label="Back to Library"
              onPress={() =>
                router.replace(
                  "/books",
                )
              }
            />
          </View>
        </View>
      </AppScreen>
    );
  }

  const totalPages =
    Math.max(
      1,
      book.totalPages,
    );

  const percentage =
    getBookPagePercentage(
      currentPage,
      totalPages,
    );

  const completed =
    currentPage >=
    totalPages;

  function goToPage(
    page: number,
  ) {
    const nextPage =
      Math.min(
        totalPages,
        Math.max(
          1,
          Math.floor(page),
        ),
      );

    setCurrentPage(
      nextPage,
    );

    updateReadingProgress(
      book!.id,
      nextPage,
    );
  }

  function previousPage() {
    goToPage(
      currentPage - 1,
    );
  }

  function nextPage() {
    goToPage(
      currentPage + 1,
    );
  }

  function firstPage() {
    goToPage(1);
  }

  function lastPage() {
    goToPage(
      totalPages,
    );
  }

  function resetControls() {
    setReaderMode(useSettingsStore.getState().defaultBookReaderMode);

    setFontSize(useSettingsStore.getState().readerFontSize);
  }

  function backToDetails() {
    router.replace({
      pathname:
        "/books/[bookId]",
      params: {
        bookId:
          book!.id,
      },
    });
  }

  return (
    <AppScreen>
      <View style={styles.page}>
        <AppHeader
          title={book.title}
          subtitle={
            `Page ${currentPage} of ${totalPages}`
          }
          showBack
          onBack={
            backToDetails
          }
        />

        {readerMode ===
        "READING" ? (
          <AppCard style={styles.bookHeader}>
            <View style={styles.bookIcon}>
              <Ionicons
                name="book-outline"
                size={iconSize.lg}
                color={colors.primary}
              />
            </View>

            <View style={styles.bookInfo}>
              {book.arabicTitle ? (
                <ArabicText
                  size="small"
                  numberOfLines={1}
                >
                  {book.arabicTitle}
                </ArabicText>
              ) : null}

              <AppText
                variant="subheading"
                numberOfLines={2}
              >
                {book.title}
              </AppText>

              <AppText
                variant="caption"
                muted
              >
                {book.author}
              </AppText>
            </View>
          </AppCard>
        ) : (
          <View style={styles.focusHeader}>
            <Ionicons
              name="eye-outline"
              size={iconSize.sm}
              color={colors.primary}
            />

            <AppText
              variant="caption"
              style={styles.focusText}
            >
              Focus Mode · Page {currentPage}
            </AppText>
          </View>
        )}

        <BookReaderProgressCard
          currentPage={
            currentPage
          }
          totalPages={
            totalPages
          }
        />

        <BookReaderModeToggle
          value={
            readerMode
          }
          onChange={
            setReaderMode
          }
        />

        <BookReaderFontControls
          value={
            fontSize
          }
          onChange={
            setFontSize
          }
        />

        {demoPage ? (
          <BookPageCard
            page={
              demoPage
            }
            fontSize={
              fontSize
            }
            focusMode={
              readerMode ===
              "FOCUS"
            }
          />
        ) : null}

        <BookPageNavigation
          currentPage={
            currentPage
          }
          totalPages={
            totalPages
          }
          onPrevious={
            previousPage
          }
          onNext={
            nextPage
          }
          onFirst={
            firstPage
          }
          onLast={
            lastPage
          }
        />

        <BookJumpToPage
          currentPage={
            currentPage
          }
          totalPages={
            totalPages
          }
          onJump={
            goToPage
          }
        />

        {completed ? (
          <AppCard style={styles.completeCard}>
            <View style={styles.completeHeader}>
              <Ionicons
                name="checkmark-circle"
                size={iconSize.lg}
                color={colors.success}
              />

              <View style={styles.completeText}>
                <AppText variant="subheading">
                  Book Completed
                </AppText>

                <AppText
                  variant="bodySmall"
                  muted
                >
                  You reached the final page of
                  this demo reading session.
                </AppText>
              </View>
            </View>

            <AppButton
              label="Read Again from Page 1"
              variant="secondary"
              onPress={
                firstPage
              }
            />
          </AppCard>
        ) : (
          <View style={styles.resumeNotice}>
            <Ionicons
              name="bookmark-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <AppText
              variant="bodySmall"
              style={styles.resumeNoticeText}
            >
              Page {currentPage} is now your
              current reading position. Opening
              this book again will resume here.
            </AppText>
          </View>
        )}

        {readerMode ===
        "READING" ? (
          <AppCard style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <Ionicons
                name="analytics-outline"
                size={iconSize.md}
                color={colors.primary}
              />

              <AppText variant="subheading">
                Reading Session
              </AppText>
            </View>

            <View style={styles.sessionRows}>
              <View style={styles.sessionRow}>
                <AppText
                  variant="bodySmall"
                  muted
                >
                  Current page
                </AppText>

                <AppText
                  variant="bodySmall"
                  style={styles.sessionValue}
                >
                  {currentPage}
                </AppText>
              </View>

              <View style={styles.sessionRow}>
                <AppText
                  variant="bodySmall"
                  muted
                >
                  Remaining pages
                </AppText>

                <AppText
                  variant="bodySmall"
                  style={styles.sessionValue}
                >
                  {Math.max(
                    0,
                    totalPages -
                      currentPage,
                  )}
                </AppText>
              </View>

              <View style={styles.sessionRow}>
                <AppText
                  variant="bodySmall"
                  muted
                >
                  Progress
                </AppText>

                <AppText
                  variant="bodySmall"
                  style={styles.sessionValue}
                >
                  {percentage}%
                </AppText>
              </View>
            </View>
          </AppCard>
        ) : null}

        <View style={styles.actions}>
          <AppButton
            label="Back to Book Details"
            variant="secondary"
            onPress={
              backToDetails
            }
          />

          <AppButton
            label="Reset Reader Controls"
            variant="ghost"
            onPress={
              resetControls
            }
          />
        </View>

        <View style={styles.demoNotice}>
          <Ionicons
            name="flask-outline"
            size={iconSize.md}
            color={colors.primary}
          />

          <AppText
            variant="bodySmall"
            style={styles.demoNoticeText}
          >
            Reader pages currently contain
            generated demo study text. They are
            not presented as the original content
            of this book. Real imported book
            content will be connected in the book
            import phase.
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

  bookHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  bookIcon: {
    width: 52,
    height: 62,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },

  bookInfo: {
    flex: 1,
    gap: spacing.xs,
  },

  focusHeader: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },

  focusText: {
    color: colors.primaryDark,
    fontWeight: "800",
  },

  completeCard: {
    gap: spacing.lg,
    borderColor: colors.success,
    backgroundColor: colors.successSoft,
  },

  completeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  completeText: {
    flex: 1,
    gap: spacing.xs,
  },

  resumeNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  resumeNoticeText: {
    flex: 1,
    color: colors.primaryDark,
    fontWeight: "600",
  },

  sessionCard: {
    gap: spacing.lg,
  },

  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  sessionRows: {
    gap: spacing.md,
  },

  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  sessionValue: {
    color: colors.primaryDark,
    fontWeight: "900",
  },

  actions: {
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