import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppScreen } from "../../src/components/layout";
import {
  AppButton,
  AppCard,
  AppText,
} from "../../src/components/ui";
import {
  colors,
  spacing,
} from "../../src/theme";

export default function BooksTabScreen() {
  return (
    <AppScreen>
      <View style={styles.page}>
        <AppText
          variant="caption"
          style={styles.eyebrow}
        >
          BOOK LIBRARY
        </AppText>

        <AppText variant="title">
          Books
        </AppText>

        <AppText muted>
          Browse demo Islamic books and open the future mobile
          reader experience.
        </AppText>

        <AppCard style={styles.card}>
          <AppText variant="subheading">
            الأربعون النووية
          </AppText>

          <AppText
            variant="bodySmall"
            muted
          >
            Imam al-Nawawi · Demo verified book
          </AppText>

          <AppButton
            label="Open Book"
            variant="secondary"
            onPress={() =>
              router.push({ pathname: "/books/[bookId]", params: { bookId: "demo-book" } })
            }
          />
        </AppCard>

        <AppButton
          label="Add Book"
          onPress={() =>
            router.push("/books/upload")
          }
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: {
    gap: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.section,
  },

  eyebrow: {
    color: colors.primary,
    fontWeight: "800",
  },

  card: {
    gap: spacing.md,
  },
});