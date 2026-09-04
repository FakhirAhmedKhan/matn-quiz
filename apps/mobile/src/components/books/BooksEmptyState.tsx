import {
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import {
  AppButton,
  AppText,
} from "../ui";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type BooksEmptyStateProps = {
  filtered: boolean;
  onResetFilters: () => void;
  onUpload: () => void;
};

export function BooksEmptyState({
  filtered,
  onResetFilters,
  onUpload,
}: BooksEmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons
          name={
            filtered
              ? "search-outline"
              : "library-outline"
          }
          size={iconSize.xl}
          color={colors.primary}
        />
      </View>

      <AppText
        variant="title"
        align="center"
      >
        {filtered
          ? "No Books Found"
          : "Your Library is Empty"}
      </AppText>

      <AppText
        muted
        align="center"
      >
        {filtered
          ? "Try a different search term or clear the current category filter."
          : "Add a book to start building your reading library."}
      </AppText>

      {filtered ? (
        <AppButton
          label="Reset Search & Filters"
          variant="secondary"
          onPress={
            onResetFilters
          }
        />
      ) : (
        <AppButton
          label="Add a Book"
          onPress={
            onUpload
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.section,
  },

  icon: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xxl,
    backgroundColor: colors.primarySoft,
  },
});