import {
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  BookReaderFontSize,
  DemoBookPage,
} from "../../utils/bookReader";
import {
  getReaderFontStyle,
} from "../../utils/bookReader";
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

type BookPageCardProps = {
  page: DemoBookPage;
  fontSize: BookReaderFontSize;
  focusMode: boolean;
};

export function BookPageCard({
  page,
  fontSize,
  focusMode,
}: BookPageCardProps) {
  const textStyle =
    getReaderFontStyle(
      fontSize,
    );

  return (
    <AppCard
      style={[
        styles.card,
        focusMode &&
          styles.focusCard,
      ]}
    >
      {!focusMode ? (
        <View style={styles.header}>
          <View style={styles.pageBadge}>
            <AppText
              variant="caption"
              style={styles.pageBadgeText}
            >
              Page {page.pageNumber}
            </AppText>
          </View>

          <View style={styles.demoBadge}>
            <Ionicons
              name="flask-outline"
              size={iconSize.sm}
              color={colors.primary}
            />

            <AppText
              variant="caption"
              style={styles.demoText}
            >
              Demo Content
            </AppText>
          </View>
        </View>
      ) : null}

      {!focusMode ? (
        <View style={styles.heading}>
          <ArabicText
            size="medium"
            center
          >
            {page.heading}
          </ArabicText>
        </View>
      ) : null}

      <View
        style={[
          styles.textContainer,
          focusMode &&
            styles.focusTextContainer,
        ]}
      >
        <ArabicText
          style={textStyle}
        >
          {page.arabicText}
        </ArabicText>
      </View>

      {!focusMode ? (
        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={iconSize.sm}
            color={colors.primary}
          />

          <AppText
            variant="caption"
            muted
            style={styles.noticeText}
          >
            {page.note}
          </AppText>
        </View>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xl,
    paddingVertical: spacing.xxl,
  },

  focusCard: {
    minHeight: 420,
    justifyContent: "center",
    borderColor: colors.primary,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },

  pageBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },

  pageBadgeText: {
    color: colors.primaryDark,
    fontWeight: "800",
  },

  demoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  demoText: {
    color: colors.primary,
    fontWeight: "700",
  },

  heading: {
    paddingHorizontal: spacing.md,
  },

  textContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSoft,
  },

  focusTextContainer: {
    paddingVertical: spacing.xxl,
    backgroundColor: colors.surface,
  },

  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },

  noticeText: {
    flex: 1,
  },
});