import {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import {
  useRouter,
} from "expo-router";

import {
  RequireAuth,
} from "../src/auth";

import {
  BookCloudSyncCard,
  CloudBookCard,
} from "../src/components/book-cloud";

import {
  AppHeader,
  AppScreen,
} from "../src/components/layout";

import {
  AppCard,
  AppText,
} from "../src/components/ui";

import type {
  RemoteBook,
} from "../src/book-api/types";

import {
  useBookCloudStore,
} from "../src/store/bookCloudStore";

import {
  colors,
  radius,
  spacing,
} from "../src/theme";

function CloudBooksContent() {
  const router =
    useRouter();

  const [
    searchText,
    setSearchText,
  ] =
    useState("");

  const items =
    useBookCloudStore(
      (
        state,
      ) =>
        state.items,
    );

  const selected =
    useBookCloudStore(
      (
        state,
      ) =>
        state.selected,
    );

  const status =
    useBookCloudStore(
      (
        state,
      ) =>
        state.status,
    );

  const error =
    useBookCloudStore(
      (
        state,
      ) =>
        state.error,
    );

  const hasMore =
    useBookCloudStore(
      (
        state,
      ) =>
        state.hasMore,
    );

  const loadBooks =
    useBookCloudStore(
      (
        state,
      ) =>
        state.loadBooks,
    );

  const loadMore =
    useBookCloudStore(
      (
        state,
      ) =>
        state.loadMore,
    );

  const loadBook =
    useBookCloudStore(
      (
        state,
      ) =>
        state.loadBook,
    );

  const toggleFavorite =
    useBookCloudStore(
      (
        state,
      ) =>
        state.toggleFavorite,
    );

  const saveSelectedProgress =
    useBookCloudStore(
      (
        state,
      ) =>
        state.saveSelectedProgress,
    );

  const deleteBook =
    useBookCloudStore(
      (
        state,
      ) =>
        state.deleteBook,
    );

  useEffect(
    () => {
      if (
        status ===
        "idle"
      ) {
        void loadBooks();
      }
    },
    [
      loadBooks,
      status,
    ],
  );

  const busy =
    status !==
      "idle" &&
    status !==
      "ready" &&
    status !==
      "error";

  const openBook =
    async (
      book: RemoteBook,
    ) => {
      await loadBook(
        book.id,
      );
    };

  const saveProgress =
    async (
      book: RemoteBook,
    ) => {
      const loaded =
        selected?.id ===
        book.id
          ? true
          : await loadBook(
              book.id,
            );

      if (!loaded) {
        return;
      }

      const success =
        await saveSelectedProgress();

      Alert.alert(
        "Book progress",
        success
          ? "Reading progress synchronized."
          : "Unable to synchronize progress.",
      );
    };

  const removeBook =
    (
      book: RemoteBook,
    ) => {
      Alert.alert(
        "Delete book",
        `Delete "${book.title}" from your cloud library?`,
        [
          {
            text:
              "Cancel",

            style:
              "cancel",
          },

          {
            text:
              "Delete",

            style:
              "destructive",

            onPress:
              () => {
                void deleteBook(
                  book.id,
                );
              },
          },
        ],
      );
    };

  const runSearch =
    () => {
      void loadBooks(
        searchText.trim(),
      );
    };

  return (
    <AppScreen
      scroll
      keyboardAware
    >
      <AppHeader
        title="Cloud Books"
        subtitle="Book library and reader synchronization"
        showBack
        onBack={() =>
          router.back()
        }
      />

      <BookCloudSyncCard />

      <AppCard
        style={
          styles.searchCard
        }
      >
        <AppText
          variant="subheading"
        >
          Search library
        </AppText>

        <TextInput
          accessibilityLabel="Search cloud books"
          value={
            searchText
          }
          onChangeText={
            setSearchText
          }
          placeholder="Search by title or author"
          placeholderTextColor={
            colors.textMuted
          }
          returnKeyType="search"
          onSubmitEditing={
            runSearch
          }
          style={
            styles.input
          }
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search books"
          disabled={
            busy
          }
          onPress={
            runSearch
          }
          style={({
            pressed,
          }) => [
            styles.searchButton,

            pressed &&
              styles.pressed,

            busy &&
              styles.disabled,
          ]}
        >
          <AppText
            variant="bodySmall"
            style={
              styles.searchButtonText
            }
          >
            Search
          </AppText>
        </Pressable>
      </AppCard>

      {error ? (
        <View
          accessibilityRole="alert"
          style={
            styles.error
          }
        >
          <AppText
            variant="bodySmall"
            style={
              styles.errorText
            }
          >
            {error}
          </AppText>
        </View>
      ) : null}

      {selected ? (
        <AppCard
          style={
            styles.selectedCard
          }
        >
          <AppText
            variant="subheading"
          >
            Selected book
          </AppText>

          <AppText
            variant="bodySmall"
          >
            {selected.title}
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            ID: {
              selected.id
            }
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            Page {
              selected.currentPage
            } / {
              Math.max(
                selected.pageCount,
                1,
              )
            }
            {" • "}
            {
              Math.round(
                selected.progressPercentage,
              )
            }%
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            File: {
              selected.fileUrl
                ? "Available"
                : "Metadata only"
            }
          </AppText>

          {selected.description ? (
            <AppText
              variant="bodySmall"
              muted
              numberOfLines={5}
            >
              {selected.description}
            </AppText>
          ) : null}
        </AppCard>
      ) : null}

      {status ===
        "loading" &&
      items.length ===
        0 ? (
        <View
          style={
            styles.loading
          }
        >
          <ActivityIndicator
            size="large"
            color={
              colors.primary
            }
          />

          <AppText
            muted
          >
            Loading cloud books...
          </AppText>
        </View>
      ) : null}

      {status !==
        "loading" &&
      items.length ===
        0 ? (
        <AppCard
          style={
            styles.empty
          }
        >
          <AppText
            variant="subheading"
          >
            No cloud books yet
          </AppText>

          <AppText
            variant="bodySmall"
            muted
          >
            Sync a local book now. Real PDF/document upload is added in P2-M8.
          </AppText>
        </AppCard>
      ) : null}

      <View
        style={
          styles.list
        }
      >
        {items.map(
          (
            book,
          ) => (
            <CloudBookCard
              key={
                book.id
              }
              book={
                book
              }
              busy={
                busy
              }
              onOpen={() => {
                void openBook(
                  book,
                );
              }}
              onToggleFavorite={() => {
                void toggleFavorite(
                  book.id,
                );
              }}
              onSaveProgress={() => {
                void saveProgress(
                  book,
                );
              }}
              onDelete={() =>
                removeBook(
                  book,
                )
              }
            />
          ),
        )}
      </View>

      {hasMore ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Load more cloud books"
          disabled={
            busy
          }
          onPress={() => {
            void loadMore();
          }}
          style={({
            pressed,
          }) => [
            styles.loadMore,

            pressed &&
              styles.pressed,

            busy &&
              styles.disabled,
          ]}
        >
          {status ===
          "loading-more" ? (
            <ActivityIndicator
              color={
                colors.primary
              }
            />
          ) : (
            <AppText
              variant="bodySmall"
              style={
                styles.loadMoreText
              }
            >
              Load more
            </AppText>
          )}
        </Pressable>
      ) : null}
    </AppScreen>
  );
}

export default function CloudBooksScreen() {
  return (
    <RequireAuth>
      <CloudBooksContent />
    </RequireAuth>
  );
}

const styles =
  StyleSheet.create({
    searchCard: {
      gap:
        spacing.md,
    },

    input: {
      minHeight:
        50,
      borderWidth:
        1,
      borderColor:
        colors.border,
      borderRadius:
        radius.lg,
      paddingHorizontal:
        spacing.md,
      backgroundColor:
        colors.surface,
      color:
        colors.text,
      fontSize:
        16,
    },

    searchButton: {
      minHeight:
        44,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderRadius:
        radius.lg,
      backgroundColor:
        colors.primarySoft,
      paddingHorizontal:
        spacing.md,
    },

    searchButtonText: {
      color:
        colors.primary,
      fontWeight:
        "800",
    },

    list: {
      gap:
        spacing.md,
    },

    selectedCard: {
      gap:
        spacing.sm,
    },

    empty: {
      gap:
        spacing.sm,
    },

    loading: {
      minHeight:
        180,
      alignItems:
        "center",
      justifyContent:
        "center",
      gap:
        spacing.md,
    },

    error: {
      padding:
        spacing.md,
      borderRadius:
        radius.md,
      backgroundColor:
        colors.warningSoft,
    },

    errorText: {
      color:
        colors.warning,
      fontWeight:
        "700",
    },

    loadMore: {
      minHeight:
        48,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderRadius:
        radius.lg,
      backgroundColor:
        colors.primarySoft,
      paddingHorizontal:
        spacing.md,
    },

    loadMoreText: {
      color:
        colors.primary,
      fontWeight:
        "800",
    },

    pressed: {
      opacity:
        0.7,
    },

    disabled: {
      opacity:
        0.5,
    },
  });