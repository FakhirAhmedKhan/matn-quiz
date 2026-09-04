import {
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import {
  colors,
  iconSize,
  radius,
  spacing,
  typography,
} from "../../theme";

type BookSearchBarProps = {
  value: string;
  onChangeText: (
    value: string,
  ) => void;
};

export function BookSearchBar({
  value,
  onChangeText,
}: BookSearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={iconSize.md}
        color={colors.textMuted}
      />

      <TextInput
        value={value}
        onChangeText={
          onChangeText
        }
        placeholder="Search books or authors"
        placeholderTextColor={
          colors.textMuted
        }
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel="Search book library"
        style={styles.input}
      />

      {value.length > 0 ? (
        <Ionicons
          name="filter-outline"
          size={iconSize.sm}
          color={colors.primary}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },

  input: {
    flex: 1,
    minHeight: 50,
    color: colors.text,
    fontSize: typography.body,
  },
});