import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useBookCloudStore,
} from "../../store/bookCloudStore";

import {
  colors,
  radius,
  spacing,
} from "../../theme";

import {
  AppCard,
  AppText,
} from "../ui";

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "Not synced yet";
  }

  const date =
    new Date(
      value,
    );

  return Number.isNaN(
    date.getTime(),
  )
    ? "Recently"
    : date.toLocaleString();
}

export function BookCloudSyncCard() {
  const status =
    useBookCloudStore(
      (
        state,
      ) =>
        state.status,
    );

  const total =
    useBookCloudStore(
      (
        state,
      ) =>
        state.total,
    );

  const lastSyncedAt =
    useBookCloudStore(
      (
        state,
      ) =>
        state.lastSyncedAt,
    );

  const refreshBooks =
    useBookCloudStore(
      (
        state,
      ) =>
        state.refreshBooks,
    );

  const createFromLocal =
    useBookCloudStore(
      (
        state,
      ) =>
        state.createFromLocal,
    );

  const busy =
    status !==
      "idle" &&
    status !==
      "ready" &&
    status !==
      "error";

  return (
    <AppCard
      style={
        styles.card
      }
    >
      <View
        style={
          styles.heading
        }
      >
        <View
          style={
            styles.titleRow
          }
        >
          <Ionicons
            name="library-outline"
            size={22}
            color={
              colors.primary
            }
          />

          <AppText
            variant="subheading"
          >
            Cloud library
          </AppText>

          {busy ? (
            <ActivityIndicator
              size="small"
              color={
                colors.primary
              }
            />
          ) : null}
        </View>

        <AppText
          variant="caption"
          muted
        >
          {total} cloud book
          {total === 1
            ? ""
            : "s"}
          {" • "}
          {formatDate(
            lastSyncedAt,
          )}
        </AppText>
      </View>

      <View
        style={
          styles.actions
        }
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Refresh cloud books"
          disabled={
            busy
          }
          onPress={() => {
            void refreshBooks();
          }}
          style={({
            pressed,
          }) => [
            styles.button,

            pressed &&
              styles.pressed,

            busy &&
              styles.disabled,
          ]}
        >
          <Ionicons
            name="refresh-outline"
            size={18}
            color={
              colors.primary
            }
          />

          <AppText
            variant="bodySmall"
            style={
              styles.buttonText
            }
          >
            Refresh
          </AppText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sync local book metadata"
          disabled={
            busy
          }
          onPress={() => {
            void createFromLocal();
          }}
          style={({
            pressed,
          }) => [
            styles.button,

            pressed &&
              styles.pressed,

            busy &&
              styles.disabled,
          ]}
        >
          <Ionicons
            name="cloud-upload-outline"
            size={18}
            color={
              colors.primary
            }
          />

          <AppText
            variant="bodySmall"
            style={
              styles.buttonText
            }
          >
            Sync local book
          </AppText>
        </Pressable>
      </View>
    </AppCard>
  );
}

const styles =
  StyleSheet.create({
    card: {
      gap:
        spacing.lg,
    },

    heading: {
      gap:
        spacing.xs,
    },

    titleRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap:
        spacing.sm,
    },

    actions: {
      gap:
        spacing.sm,
    },

    button: {
      minHeight:
        44,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap:
        spacing.sm,
      borderRadius:
        radius.lg,
      paddingHorizontal:
        spacing.md,
      backgroundColor:
        colors.primarySoft,
    },

    buttonText: {
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