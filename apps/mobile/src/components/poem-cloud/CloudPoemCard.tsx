import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  RemotePoem,
} from "../../poem-api/types";

import {
  colors,
  radius,
  spacing,
} from "../../theme";

import {
  AppCard,
  AppText,
} from "../ui";

type Props = {
  poem:
    RemotePoem;

  busy?:
    boolean;

  onOpen:
    () =>
      void;

  onSaveProgress:
    () =>
      void;

  onDelete:
    () =>
      void;
};

export function CloudPoemCard({
  poem,
  busy = false,
  onOpen,
  onSaveProgress,
  onDelete,
}: Props) {
  return (
    <AppCard
      style={
        styles.card
      }
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          `Open ${poem.title}`
        }
        disabled={
          busy
        }
        onPress={
          onOpen
        }
        style={({
          pressed,
        }) => [
          styles.main,

          pressed &&
            styles.pressed,
        ]}
      >
        <View
          style={
            styles.heading
          }
        >
          <View
            style={
              styles.titleArea
            }
          >
            <AppText
              variant="subheading"
              numberOfLines={2}
            >
              {poem.title}
            </AppText>

            <AppText
              variant="caption"
              muted
              numberOfLines={1}
            >
              {poem.author
                ? poem.author
                : "Unknown author"}
              {" • "}
              {poem.lineCount} lines
            </AppText>
          </View>

          <View
            style={
              styles.progressBadge
            }
          >
            <AppText
              variant="bodySmall"
              style={
                styles.progressText
              }
            >
              {Math.round(
                poem.progressPercentage,
              )}%
            </AppText>
          </View>
        </View>

        {poem.text ? (
          <AppText
            variant="bodySmall"
            muted
            numberOfLines={4}
          >
            {poem.text}
          </AppText>
        ) : null}
      </Pressable>

      <View
        style={
          styles.actions
        }
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save poem reading progress"
          disabled={
            busy
          }
          onPress={
            onSaveProgress
          }
          style={({
            pressed,
          }) => [
            styles.syncButton,

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
              styles.syncText
            }
          >
            Sync progress
          </AppText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete cloud poem"
          disabled={
            busy
          }
          onPress={
            onDelete
          }
          style={({
            pressed,
          }) => [
            styles.deleteButton,

            pressed &&
              styles.pressed,

            busy &&
              styles.disabled,
          ]}
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={
              colors.warning
            }
          />
        </Pressable>
      </View>
    </AppCard>
  );
}

const styles =
  StyleSheet.create({
    card: {
      gap:
        spacing.md,
    },

    main: {
      gap:
        spacing.md,
    },

    heading: {
      flexDirection:
        "row",
      alignItems:
        "flex-start",
      gap:
        spacing.md,
    },

    titleArea: {
      flex:
        1,
      minWidth:
        0,
      gap:
        spacing.xs,
    },

    progressBadge: {
      minWidth:
        54,
      minHeight:
        40,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderRadius:
        radius.pill,
      backgroundColor:
        colors.successSoft,
      paddingHorizontal:
        spacing.sm,
    },

    progressText: {
      color:
        colors.success,
      fontWeight:
        "800",
    },

    actions: {
      flexDirection:
        "row",
      gap:
        spacing.sm,
    },

    syncButton: {
      flex:
        1,
      minHeight:
        44,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap:
        spacing.xs,
      borderRadius:
        radius.lg,
      paddingHorizontal:
        spacing.md,
      backgroundColor:
        colors.primarySoft,
    },

    syncText: {
      color:
        colors.primary,
      fontWeight:
        "800",
    },

    deleteButton: {
      width:
        48,
      minHeight:
        44,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderRadius:
        radius.lg,
      backgroundColor:
        colors.warningSoft,
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