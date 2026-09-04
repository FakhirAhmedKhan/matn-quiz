import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppHeader, AppScreen } from "../../../src/components/layout";
import {
  AppCard,
  AppText,
  ArabicText,
} from "../../../src/components/ui";
import { spacing } from "../../../src/theme";

export default function BookReaderScreen() {
  const { bookId } = useLocalSearchParams<{
    bookId: string;
  }>();

  return (
    <AppScreen>
      <AppHeader
        title="Book Reader"
        showBack
        onBack={() => router.back()}
      />

      <View style={styles.page}>
        <AppText
          variant="caption"
          muted
        >
          Demo Book: {bookId} · Page 1
        </AppText>

        <AppCard>
          <ArabicText size="large">
            إنما الأعمال بالنيات وإنما لكل امرئ ما نوى
          </ArabicText>
        </AppCard>

        <AppText muted>
          Real PDF rendering will be added in a later mobile phase.
        </AppText>
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
});