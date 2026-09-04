import {
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
} from "../../utils/books";
import {
  AppCard,
  AppText,
  ArabicText,
} from "../ui";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type BookDetailsHeroProps = {
  book: Book;
};

export function BookDetailsHero({
  book,
}: BookDetailsHeroProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.cover}>
        <Ionicons
          name="book"
          size={40}
          color={colors.primary}
        />
      </View>

      <View style={styles.content}>
        {book.arabicTitle ? (
          <ArabicText
            size="medium"
            center
          >
            {book.arabicTitle}
          </ArabicText>
        ) : null}

        <AppText
          variant="title"
          align="center"
        >
          {book.title}
        </AppText>

        <View style={styles.authorRow}>
          <Ionicons
            name="person-outline"
            size={iconSize.sm}
            color={colors.textMuted}
          />

          <AppText
            variant="bodySmall"
            muted
            align="center"
          >
            {book.author}
          </AppText>
        </View>

        <View style={styles.category}>
          <AppText
            variant="caption"
            style={styles.categoryText}
          >
            {BOOK_CATEGORY_LABELS[
              book.category
            ]}
          </AppText>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    gap: spacing.xl,
    paddingVertical: spacing.xxl,
  },

  cover: {
    width: 88,
    height: 108,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  content: {
    width: "100%",
    alignItems: "center",
    gap: spacing.sm,
  },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },

  category: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },

  categoryText: {
    color: colors.primaryDark,
    fontWeight: "800",
  },
});