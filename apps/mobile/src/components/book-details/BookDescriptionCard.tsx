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
  AppCard,
  AppText,
} from "../ui";
import {
  colors,
  iconSize,
  spacing,
} from "../../theme";

type BookDescriptionCardProps = {
  book: Book;
};

export function BookDescriptionCard({
  book,
}: BookDescriptionCardProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name="document-text-outline"
          size={iconSize.md}
          color={colors.primary}
        />

        <AppText variant="subheading">
          About This Book
        </AppText>
      </View>

      <AppText
        variant="bodySmall"
        muted
      >
        {book.description}
      </AppText>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
});