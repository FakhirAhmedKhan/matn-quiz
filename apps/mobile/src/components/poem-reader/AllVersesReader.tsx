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

type AllVersesReaderProps = {
  verses: string[];
  activeIndex: number;
  fontSize: PoemFontSize;
};

function getFontStyle(
  fontSize: PoemFontSize,
) {
  switch (fontSize) {
    case "SMALL":
      return {
        fontSize: 22,
        lineHeight: 38,
      };

    case "LARGE":
      return {
        fontSize: 32,
        lineHeight: 52,
      };

    default:
      return {
        fontSize: 27,
        lineHeight: 46,
      };
  }
}

export function AllVersesReader({
  verses,
  activeIndex,
  fontSize,
}: AllVersesReaderProps) {
  return (
    <View style={styles.container}>
      {verses.map(
        (verse, index) => {
          const active =
            index === activeIndex;

          return (
            <AppCard
              key={`${index}-${verse}`}
              style={[
                styles.card,
                active &&
                  styles.activeCard,
              ]}
            >
              <View style={styles.number}>
                <AppText
                  variant="caption"
                  style={styles.numberText}
                >
                  {index + 1}
                </AppText>
              </View>

              <View style={styles.verse}>
                <ArabicText
                  style={
                    getFontStyle(
                      fontSize,
                    )
                  }
                >
                  {verse}
                </ArabicText>
              </View>
            </AppCard>
          );
        },
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },

  card: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
  },

  activeCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },

  number: {
    width: 34,
    height: 34,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },

  numberText: {
    color: colors.primaryDark,
    fontWeight: "900",
  },

  verse: {
    flex: 1,
  },
});