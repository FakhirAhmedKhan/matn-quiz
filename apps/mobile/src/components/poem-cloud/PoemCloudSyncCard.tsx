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
  usePoemCloudStore,
} from "../../store/poemCloudStore";

import {
  colors,
  radius,
  spacing,
} from "../../theme";

import {
  AppCard,
  AppText,
} from "../ui";

function formatLastSync(
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

export function PoemCloudSyncCard() {
  const status =
    usePoemCloudStore(
      (
        state,
      ) =>
        state.status,
    );

  const total =
    usePoemCloudStore(
      (
        state,
      ) =>
        state.total,
    );

  const lastSyncedAt =
    usePoemCloudStore(
      (
        state,
      ) =>
        state.lastSyncedAt,
    );

  const refreshPoems =
    usePoemCloudStore(
      (
        state,
      ) =>
        state.refreshPoems,
    );

  const createFromLocal =
    usePoemCloudStore(
      (
        state,
      ) =>
        state.createFromLocal,
    );

  const busy =
    status ===
      "loading" ||
    status ===
      "refreshing" ||
    status ===
      "loading-more" ||
    status ===
      "loading-detail" ||
    status ===
      "creating" ||
    status ===
      "updating" ||
    status ===
      "saving-progress" ||
    status ===
      "deleting";

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
            name="cloud-outline"
            size={22}
            color={
              colors.primary
            }
          />

          <AppText
            variant="subheading"
          >
            Poem cloud
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
          {total} cloud poem
          {total === 1
            ? ""
            : "s"}
          {" • "}
          {formatLastSync(
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
          accessibilityLabel="Refresh cloud poems"
          disabled={
            busy
          }
          onPress={() => {
            void refreshPoems();
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
          accessibilityLabel="Upload local poem"
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
            Upload local poem
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