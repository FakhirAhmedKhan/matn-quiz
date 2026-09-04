import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import type {
  Book,
} from "../../types/book";
import {
  AppText,
} from "../ui";
import {
  spacing,
} from "../../theme";
import {
  BookCard,
} from "./BookCard";

type RecentBooksProps = {
  books: Book[];
  onOpenBook: (
    book: Book,
  ) => void;
  onToggleFavorite: (
    bookId: string,
  ) => void;
};

export function RecentBooks({
  books,
  onOpenBook,
  onToggleFavorite,
}: RecentBooksProps) {
  if (
    books.length === 0
  ) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <AppText variant="subheading">
          Continue Reading
        </AppText>

        <AppText
          variant="caption"
          muted
        >
          Recently opened
        </AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {books.map(
          (book) => (
            <BookCard
              key={book.id}
              book={book}
              compact
              onPress={() =>
                onOpenBook(
                  book,
                )
              }
              onToggleFavorite={() =>
                onToggleFavorite(
                  book.id,
                )
              }
            />
          ),
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  content: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
});