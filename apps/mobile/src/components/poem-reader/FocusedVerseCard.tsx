import {
  StyleSheet,
  View,
} from "react-native";

import {
  AppCard,
  AppText,
  ArabicText,
} from "../ui";
import type {
  PoemFontSize,
} from "./PoemFontControls";
import {
  colors,
  radius,
  spacing,
} from "../../theme";

type FocusedVerseCardProps = {
  verse: string;
  verseNumber: number;
  totalVerses: number;
  fontSize: PoemFontSize;
};

function getFontStyle(
  fontSize: PoemFontSize,
) {
  switch (fontSize) {
    case "SMALL":
      return {
        fontSize: 24,
        lineHeight: 42,
      };

    case "LARGE":
      return {
        fontSize: 36,
        lineHeight: 58,
      };

    default:
      return {
        fontSize: 30,
        lineHeight: 50,
      };
  }
}

export function FocusedVerseCard({
  verse,
  verseNumber,
  totalVerses,
  fontSize,
}: FocusedVerseCardProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.badge}>
        <AppText
          variant="caption"
          style={styles.badgeText}
        >
          Verse {verseNumber} of {totalVerses}
        </AppText>
      </View>

      <View style={styles.verseContainer}>
        <ArabicText
          center
          style={
            getFontStyle(
              fontSize,
            )
          }
        >
          {verse}
        </ArabicText>
      </View>

      <AppText
        variant="caption"
        muted
        align="center"
      >
        Read slowly and repeat from memory
      </AppText>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 280,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl,
    paddingVertical: spacing.xxl,
  },

  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },

  badgeText: {
    color: colors.primaryDark,
    fontWeight: "800",
  },

  verseContainer: {
    width: "100%",
    minHeight: 130,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSoft,
  },
});