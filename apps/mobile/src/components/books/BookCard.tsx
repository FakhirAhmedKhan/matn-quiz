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
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${book.title}`}
      onPress={onPress}
      style={({ pressed }) => [
        pressed &&
          styles.pressed,
      ]}
    >
      <AppCard
        style={[
          styles.card,
          compact &&
            styles.compactCard,
        ]}
      >
        <View style={styles.header}>
          <View style={styles.cover}>
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
                ? "Remove from favorites"
                : "Add to favorites"
            }
            onPress={(event) => {
              event.stopPropagation();
              onToggleFavorite();
            }}
            hitSlop={8}
            style={({ pressed }) => [
              styles.favorite,
              pressed &&
                styles.favoritePressed,
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
              {BOOK_CATEGORY_LABELS[
                book.category
              ]}
            </AppText>
          </View>

          <AppText
            variant="caption"
            muted
          >
            {progress.currentPage}/{progress.totalPages} pages
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
          />
        </View>

        <View style={styles.footer}>
          <AppText
            variant="caption"
            muted
          >
            {book.sourceLabel}
          </AppText>

          <View style={styles.open}>
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
          </View>
        </View>
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },

  compactCard: {
    minWidth: 280,
    maxWidth: 320,
  },

  pressed: {
    opacity: 0.8,
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
    backgroundColor: colors.primarySoft,
  },

  heading: {
    flex: 1,
    gap: spacing.xs,
  },

  favorite: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  favoritePressed: {
    opacity: 0.55,
  },

  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },

  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },

  categoryText: {
    color: colors.primaryDark,
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
    color: colors.primaryDark,
    fontWeight: "700",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  open: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  openText: {
    color: colors.primary,
    fontWeight: "800",
  },
});