import {
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";

import type {
  BookCategory,
} from "../../types/book";
import {
  BOOK_CATEGORY_LABELS,
} from "../../utils/books";
import {
  AppText,
} from "../ui";
import {
  colors,
  radius,
  spacing,
} from "../../theme";

type BookImportCategoryPickerProps = {
  value: BookCategory;
  onChange: (
    value: BookCategory,
  ) => void;
};

const CATEGORIES: BookCategory[] = [
  "QURAN",
  "HADITH",
  "FIQH",
  "AQEEDAH",
  "ARABIC",
  "POETRY",
];

export function BookImportCategoryPicker({
  value,
  onChange,
}: BookImportCategoryPickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={
        styles.container
      }
    >
      {CATEGORIES.map(
        (category) => {
          const selected =
            category ===
            value;

          return (
            <Pressable
              key={category}
              accessibilityRole="button"
              accessibilityLabel={`Set book category ${BOOK_CATEGORY_LABELS[category]}`}
              accessibilityState={{
                selected,
              }}
              onPress={() =>
                onChange(
                  category,
                )
              }
              style={({ pressed }) => [
                styles.option,
                selected &&
                  styles.selected,
                pressed &&
                  styles.pressed,
              ]}
            >
              <AppText
                variant="bodySmall"
                style={[
                  styles.text,
                  selected &&
                    styles.selectedText,
                ]}
              >
                {BOOK_CATEGORY_LABELS[
                  category
                ]}
              </AppText>
            </Pressable>
          );
        },
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },

  option: {
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

  text: {
    color: colors.primaryDark,
    fontWeight: "700",
  },

  selectedText: {
    color: colors.textInverse,
  },
});