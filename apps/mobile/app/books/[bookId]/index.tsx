import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppHeader, AppScreen } from "../../../src/components/layout";
import {
  AppButton,
  AppCard,
  AppText,
  ArabicText,
} from "../../../src/components/ui";
import {
  colors,
  spacing,
} from "../../../src/theme";

export default function BookDetailsScreen() {
  const { bookId } = useLocalSearchParams<{
    bookId: string;
  }>();

  return (
    <AppScreen>
      <AppHeader
        title="Book Details"
        showBack
        onBack={() => router.back()}
      />

      <View style={styles.page}>
        <AppText
          variant="caption"
          style={styles.eyebrow}
        >
          VERIFIED BOOK
        </AppText>

        <ArabicText size="large">
          الأربعون النووية
        </ArabicText>

        <AppText muted>
          Demo Book ID: {bookId}
        </AppText>

        <AppCard style={styles.card}>
          <AppText variant="subheading">
            Imam al-Nawawi
          </AppText>

          <AppText
            variant="bodySmall"
            muted
          >
            Demo metadata for the M3 navigation architecture.
          </AppText>
        </AppCard>

        <AppButton
          label="Open Reader"
          onPress={() =>
            router.push({ pathname: "/books/[bookId]/read", params: { bookId: String(bookId) } })
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
    gap: spacing.sm,
  },
});