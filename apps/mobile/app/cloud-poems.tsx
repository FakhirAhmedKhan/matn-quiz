import {
  useEffect,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  useRouter,
} from "expo-router";

import {
  RequireAuth,
} from "../src/auth";

import {
  CloudPoemCard,
  PoemCloudSyncCard,
} from "../src/components/poem-cloud";

import {
  AppHeader,
  AppScreen,
} from "../src/components/layout";

import {
  AppCard,
  AppText,
} from "../src/components/ui";

import type {
  RemotePoem,
} from "../src/poem-api/types";

import {
  usePoemCloudStore,
} from "../src/store/poemCloudStore";

import {
  colors,
  radius,
  spacing,
} from "../src/theme";

function CloudPoemsContent() {
  const router =
    useRouter();

  const items =
    usePoemCloudStore(
      (
        state,
      ) =>
        state.items,
    );

  const selected =
    usePoemCloudStore(
      (
        state,
      ) =>
        state.selected,
    );

  const status =
    usePoemCloudStore(
      (
        state,
      ) =>
        state.status,
    );

  const error =
    usePoemCloudStore(
      (
        state,
      ) =>
        state.error,
    );

  const hasMore =
    usePoemCloudStore(
      (
        state,
      ) =>
        state.hasMore,
    );

  const loadPoems =
    usePoemCloudStore(
      (
        state,
      ) =>
        state.loadPoems,
    );

  const loadMore =
    usePoemCloudStore(
      (
        state,
      ) =>
        state.loadMore,
    );

  const loadPoem =
    usePoemCloudStore(
      (
        state,
      ) =>
        state.loadPoem,
    );

  const saveSelectedProgress =
    usePoemCloudStore(
      (
        state,
      ) =>
        state.saveSelectedProgress,
    );

  const deletePoem =
    usePoemCloudStore(
      (
        state,
      ) =>
        state.deletePoem,
    );

  useEffect(
    () => {
      if (
        status ===
        "idle"
      ) {
        void loadPoems();
      }
    },
    [
      loadPoems,
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

  const openPoem =
    async (
      poem: RemotePoem,
    ) => {
      await loadPoem(
        poem.id,
      );
    };

  const syncProgress =
    async (
      poem: RemotePoem,
    ) => {
      const loaded =
        selected?.id ===
        poem.id
          ? true
          : await loadPoem(
              poem.id,
            );

      if (!loaded) {
        return;
      }

      const success =
        await saveSelectedProgress();

      Alert.alert(
        "Poem progress",
        success
          ? "Reading progress synchronized."
          : "Unable to synchronize progress.",
      );
    };

  const remove =
    (
      poem: RemotePoem,
    ) => {
      Alert.alert(
        "Delete poem",
        `Delete "${poem.title}" from your cloud library?`,
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
                void deletePoem(
                  poem.id,
                );
              },
          },
        ],
      );
    };

  return (
    <AppScreen
      scroll
    >
      <AppHeader
        title="Cloud Poems"
        subtitle="Poem library and reading synchronization"
        showBack
        onBack={() =>
          router.back()
        }
      />

      <PoemCloudSyncCard />

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
            Selected poem
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
            Reader mode: {
              selected.readerMode
            }
            {" • "}
            Line {
              selected.currentLineIndex +
              1
            } / {
              Math.max(
                selected.lineCount,
                1,
              )
            }
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            Progress: {
              Math.round(
                selected.progressPercentage,
              )
            }%
          </AppText>

          {selected.text ? (
            <AppText
              variant="bodySmall"
              muted
              numberOfLines={6}
            >
              {selected.text}
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
            Loading cloud poems...
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
            No cloud poems yet
          </AppText>

          <AppText
            variant="bodySmall"
            muted
          >
            Create a poem locally and use Upload local poem.
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
            poem,
          ) => (
            <CloudPoemCard
              key={
                poem.id
              }
              poem={
                poem
              }
              busy={
                busy
              }
              onOpen={() => {
                void openPoem(
                  poem,
                );
              }}
              onSaveProgress={() => {
                void syncProgress(
                  poem,
                );
              }}
              onDelete={() =>
                remove(
                  poem,
                )
              }
            />
          ),
        )}
      </View>

      {hasMore ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Load more poems"
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

export default function CloudPoemsScreen() {
  return (
    <RequireAuth>
      <CloudPoemsContent />
    </RequireAuth>
  );
}

const styles =
  StyleSheet.create({
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
      paddingHorizontal:
        spacing.md,
      backgroundColor:
        colors.primarySoft,
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