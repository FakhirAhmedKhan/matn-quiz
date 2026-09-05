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
  useProfileStore,
} from "../../store/profileStore";

import {
  colors,
  iconSize,
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

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Recently synced";
  }

  return date.toLocaleString();
}

export function AccountSyncCard() {
  const status =
    useProfileStore(
      (
        state,
      ) =>
        state.status,
    );

  const error =
    useProfileStore(
      (
        state,
      ) =>
        state.error,
    );

  const lastSyncedAt =
    useProfileStore(
      (
        state,
      ) =>
        state.lastSyncedAt,
    );

  const refreshProfile =
    useProfileStore(
      (
        state,
      ) =>
        state.refreshProfile,
    );

  const pullPreferences =
    useProfileStore(
      (
        state,
      ) =>
        state.pullPreferences,
    );

  const pushPreferences =
    useProfileStore(
      (
        state,
      ) =>
        state.pushPreferences,
    );

  const busy =
    status ===
      "loading" ||
    status ===
      "saving" ||
    status ===
      "syncing";

  const button = (
    label: string,
    icon:
      | "refresh-outline"
      | "cloud-download-outline"
      | "cloud-upload-outline",
    onPress:
      () => void,
  ) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        label
      }
      disabled={
        busy
      }
      onPress={
        onPress
      }
      style={({
        pressed,
      }) => [
        styles.action,

        pressed &&
          styles.pressed,

        busy &&
          styles.disabled,
      ]}
    >
      <Ionicons
        name={
          icon
        }
        size={
          iconSize.sm
        }
        color={
          colors.primary
        }
      />

      <AppText
        variant="bodySmall"
        style={
          styles.actionText
        }
      >
        {label}
      </AppText>
    </Pressable>
  );

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
            name="cloud-done-outline"
            size={
              iconSize.md
            }
            color={
              colors.primary
            }
          />

          <AppText
            variant="subheading"
          >
            Account sync
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
          Last sync: {
            formatLastSync(
              lastSyncedAt,
            )
          }
        </AppText>
      </View>

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

      <View
        style={
          styles.actions
        }
      >
        {button(
          "Refresh profile",
          "refresh-outline",
          () => {
            void refreshProfile();
          },
        )}

        {button(
          "Download settings",
          "cloud-download-outline",
          () => {
            void pullPreferences();
          },
        )}

        {button(
          "Upload settings",
          "cloud-upload-outline",
          () => {
            void pushPreferences();
          },
        )}
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

    action: {
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

    actionText: {
      color:
        colors.primary,
      fontWeight:
        "800",
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

    pressed: {
      opacity:
        0.7,
    },

    disabled: {
      opacity:
        0.5,
    },
  });