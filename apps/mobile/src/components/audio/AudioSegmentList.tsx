import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import type {
  AudioSegment,
} from "../../types/audio";
import {
  AppText,
  ArabicText,
} from "../ui";
import {
  colors,
  radius,
  spacing,
} from "../../theme";

type AudioSegmentListProps = {
  segments: AudioSegment[];
  selectedIndex: number;
  onSelect: (
    index: number,
  ) => void;
};

export function AudioSegmentList({
  segments,
  selectedIndex,
  onSelect,
}: AudioSegmentListProps) {
  if (
    segments.length === 0
  ) {
    return (
      <View style={styles.empty}>
        <AppText
          muted
          align="center"
        >
          No readable segments found.
        </AppText>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={
        styles.content
      }
    >
      {segments.map(
        (segment) => {
          const selected =
            segment.index ===
            selectedIndex;

          return (
            <Pressable
              key={segment.id}
              accessibilityRole="button"
              accessibilityLabel={`Select audio segment ${segment.index + 1}`}
              accessibilityState={{
                selected,
              }}
              onPress={() =>
                onSelect(
                  segment.index,
                )
              }
              style={({ pressed }) => [
                styles.segment,
                selected &&
                  styles.selected,
                pressed &&
                  styles.pressed,
              ]}
            >
              <View style={styles.number}>
                <AppText
                  variant="caption"
                  style={[
                    styles.numberText,
                    selected &&
                      styles.selectedNumberText,
                  ]}
                >
                  {segment.index + 1}
                </AppText>
              </View>

              <ArabicText
                size="small"
                numberOfLines={3}
              >
                {segment.text}
              </ArabicText>
            </Pressable>
          );
        },
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },

  segment: {
    width: 260,
    minHeight: 130,
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },

  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },

  pressed: {
    opacity: 0.75,
  },

  number: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.backgroundSoft,
  },

  numberText: {
    color: colors.primaryDark,
    fontWeight: "900",
  },

  selectedNumberText: {
    color: colors.primary,
  },

  empty: {
    padding: spacing.xl,
  },
});