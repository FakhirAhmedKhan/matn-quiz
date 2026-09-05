import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  Book,
} from "../../types/book";

import {
  BOOK_CATEGORY_LABELS,
  getBookProgress,
  getBookStatusLabel,
} from "../../utils/books";

import {
  AppCard,
  AppText,
  ArabicText,
  ProgressBar,
} from "../ui";

import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type BookCardProps = {
  book: Book;

  compact?: boolean;

  onPress: () => void;

  onToggleFavorite: () => void;
};

export function BookCard({
  book,
  compact = false,
  onPress,
  onToggleFavorite,
}: BookCardProps) {
  const progress =
    getBookProgress(
      book,
    );

  return (
    <AppCard
      style={[
        styles.card,

        compact &&
          styles.compactCard,
      ]}
    >
      <View style={styles.header}>
        <View
          accessible={false}
          style={styles.cover}
        >
          <Ionicons
            name="book"
            size={
              compact
                ? iconSize.md
                : iconSize.lg
            }
            color={colors.primary}
          />
        </View>

        <View style={styles.heading}>
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
            numberOfLines={1}
          >
            {book.author}
          </AppText>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            book.isFavorite
              ? `Remove ${book.title} from favorites`
              : `Add ${book.title} to favorites`
          }
          accessibilityState={{
            selected:
              book.isFavorite,
          }}
          hitSlop={8}
          onPress={
            onToggleFavorite
          }
          style={({
            pressed,
          }) => [
            styles.favorite,

            pressed &&
              styles.pressed,
          ]}
        >
          <Ionicons
            name={
              book.isFavorite
                ? "heart"
                : "heart-outline"
            }
            size={iconSize.md}
            color={
              book.isFavorite
                ? colors.warning
                : colors.textMuted
            }
          />
        </Pressable>
      </View>

      {!compact ? (
        <AppText
          variant="bodySmall"
          muted
          numberOfLines={2}
        >
          {book.description}
        </AppText>
      ) : null}

      <View style={styles.categoryRow}>
        <View style={styles.categoryBadge}>
          <AppText
            variant="caption"
            style={styles.categoryText}
          >
            {
              BOOK_CATEGORY_LABELS[
                book.category
              ]
            }
          </AppText>
        </View>

        <AppText
          variant="caption"
          muted
        >
          {progress.currentPage}/
          {progress.totalPages} pages
        </AppText>
      </View>

      <View style={styles.progressArea}>
        <View style={styles.progressHeader}>
          <AppText
            variant="caption"
            style={styles.status}
          >
            {getBookStatusLabel(
              book,
            )}
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            {progress.percentage}%
          </AppText>
        </View>

        <ProgressBar
          value={
            progress.percentage /
            100
          }
          accessibilityLabel={`${book.title} reading progress`}
        />
      </View>

      <View style={styles.footer}>
        <AppText
          variant="caption"
          muted
          numberOfLines={1}
          style={styles.source}
        >
          {book.sourceLabel}
        </AppText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            progress.started
              ? `Continue reading ${book.title}`
              : `Open ${book.title}`
          }
          accessibilityHint="Opens the book details screen."
          onPress={onPress}
          style={({
            pressed,
          }) => [
            styles.openButton,

            pressed &&
              styles.pressed,
          ]}
        >
          <AppText
            variant="bodySmall"
            style={styles.openText}
          >
            {progress.started
              ? "Continue"
              : "Open"}
          </AppText>

          <Ionicons
            name="chevron-forward"
            size={iconSize.sm}
            color={colors.primary}
          />
        </Pressable>
      </View>
    </AppCard>
  );
}

const styles =
  StyleSheet.create({
    card: {
      gap: spacing.lg,
    },

    compactCard: {
      width: 300,
      maxWidth: 320,
    },

    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.md,
    },

    cover: {
      width: 52,
      height: 62,
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius.md,
      backgroundColor:
        colors.primarySoft,
    },

    heading: {
      flex: 1,
      minWidth: 0,
      gap: spacing.xs,
    },

    favorite: {
      width: 44,
      height: 44,
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      borderRadius:
        radius.pill,
    },

    categoryRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: spacing.sm,
    },

    categoryBadge: {
      paddingHorizontal:
        spacing.sm,

      paddingVertical:
        spacing.xs,

      borderRadius:
        radius.pill,

      backgroundColor:
        colors.primarySoft,
    },

    categoryText: {
      color:
        colors.primaryDark,

      fontWeight: "800",
    },

    progressArea: {
      gap: spacing.sm,
    },

    progressHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
    },

    status: {
      color:
        colors.primaryDark,

      fontWeight: "700",
    },

    footer: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
    },

    source: {
      flex: 1,
      minWidth: 0,
    },

    openButton: {
      minWidth: 100,
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      paddingHorizontal:
        spacing.md,
      borderRadius:
        radius.lg,
      backgroundColor:
        colors.primarySoft,
    },

    openText: {
      color:
        colors.primary,

      fontWeight: "800",
    },

    pressed: {
      opacity: 0.65,
    },
  });