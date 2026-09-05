import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  RemoteBook,
} from "../../book-api/types";

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
  book:
    RemoteBook;

  busy?:
    boolean;

  onOpen:
    () =>
      void;

  onToggleFavorite:
    () =>
      void;

  onSaveProgress:
    () =>
      void;

  onDelete:
    () =>
      void;
};

export function CloudBookCard({
  book,
  busy = false,
  onOpen,
  onToggleFavorite,
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
          `Open ${book.title}`
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
              {book.title}
            </AppText>

            <AppText
              variant="caption"
              muted
              numberOfLines={1}
            >
              {book.author
                ? book.author
                : "Unknown author"}
              {" • "}
              {book.pageCount} pages
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
                book.progressPercentage,
              )}%
            </AppText>
          </View>
        </View>

        {book.description ? (
          <AppText
            variant="bodySmall"
            muted
            numberOfLines={3}
          >
            {book.description}
          </AppText>
        ) : null}

        <View
          style={
            styles.meta
          }
        >
          <AppText
            variant="caption"
            muted
          >
            Page {
              book.currentPage
            } / {
              Math.max(
                book.pageCount,
                1,
              )
            }
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            {book.readerMode}
          </AppText>
        </View>
      </Pressable>

      <View
        style={
          styles.actions
        }
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            book.favorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
          disabled={
            busy
          }
          onPress={
            onToggleFavorite
          }
          style={({
            pressed,
          }) => [
            styles.iconButton,

            pressed &&
              styles.pressed,

            busy &&
              styles.disabled,
          ]}
        >
          <Ionicons
            name={
              book.favorite
                ? "heart"
                : "heart-outline"
            }
            size={19}
            color={
              colors.primary
            }
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sync book progress"
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
          accessibilityLabel="Delete cloud book"
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
      paddingHorizontal:
        spacing.sm,
      borderRadius:
        radius.pill,
      backgroundColor:
        colors.successSoft,
    },

    progressText: {
      color:
        colors.success,
      fontWeight:
        "800",
    },

    meta: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      gap:
        spacing.sm,
    },

    actions: {
      flexDirection:
        "row",
      gap:
        spacing.sm,
    },

    iconButton: {
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
        colors.primarySoft,
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
      paddingHorizontal:
        spacing.sm,
      borderRadius:
        radius.lg,
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