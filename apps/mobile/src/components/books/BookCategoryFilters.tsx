import {
  ScrollView,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import type {
  BookCategoryFilter,
} from "../../types/book";
import {
  BOOK_FILTERS,
} from "../../utils/books";
import {
  AppText,
} from "../ui";
import {
  colors,
  radius,
  spacing,
} from "../../theme";

type BookCategoryFiltersProps = {
  value: BookCategoryFilter;
  onChange: (
    value: BookCategoryFilter,
  ) => void;
};

export function BookCategoryFilters({
  value,
  onChange,
}: BookCategoryFiltersProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={
        styles.content
      }
    >
      {BOOK_FILTERS.map(
        (filter) => {
          const selected =
            filter.value ===
            value;

          return (
            <Pressable
              key={filter.value}
              accessibilityRole="button"
              accessibilityState={{
                selected,
              }}
              accessibilityLabel={`Filter books by ${filter.label}`}
              onPress={() =>
                onChange(
                  filter.value,
                )
              }
              style={({ pressed }) => [
                styles.filter,
                selected &&
                  styles.selected,
                pressed &&
                  styles.pressed,
              ]}
            >
              <AppText
                variant="bodySmall"
                style={[
                  styles.label,
                  selected &&
                    styles.selectedLabel,
                ]}
              >
                {filter.label}
              </AppText>
            </Pressable>
          );
        },
      )}

      <View
        style={styles.endSpace}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
  },

  filter: {
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },

  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },

  pressed: {
    opacity: 0.75,
  },

  label: {
    color: colors.primaryDark,
    fontWeight: "700",
  },

  selectedLabel: {
    color: colors.textInverse,
  },

  endSpace: {
    width: spacing.xs,
  },
});