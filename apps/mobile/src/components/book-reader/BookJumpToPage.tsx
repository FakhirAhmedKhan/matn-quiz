import {
  useEffect,
  useState,
} from "react";
import {
  StyleSheet,
  TextInput,
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
  clampBookPage,
} from "../../utils/bookReader";
import {
  colors,
  iconSize,
  radius,
  spacing,
  typography,
} from "../../theme";

type BookJumpToPageProps = {
  currentPage: number;
  totalPages: number;
  onJump: (
    page: number,
  ) => void;
};

export function BookJumpToPage({
  currentPage,
  totalPages,
  onJump,
}: BookJumpToPageProps) {
  const [
    value,
    setValue,
  ] = useState(
    String(currentPage),
  );

  useEffect(() => {
    setValue(
      String(currentPage),
    );
  }, [currentPage]);

  const numericValue =
    Number.parseInt(
      value,
      10,
    );

  const valid =
    Number.isFinite(
      numericValue,
    ) &&
    numericValue >= 1 &&
    numericValue <=
      totalPages;

  function jump() {
    if (!valid) {
      return;
    }

    onJump(
      clampBookPage(
        numericValue,
        totalPages,
      ),
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Ionicons
          name="navigate-outline"
          size={iconSize.sm}
          color={colors.primary}
        />

        <AppText
          variant="bodySmall"
          muted
        >
          Jump to page
        </AppText>
      </View>

      <View style={styles.controls}>
        <TextInput
          value={value}
          onChangeText={(next) =>
            setValue(
              next.replace(
                /[^0-9]/g,
                "",
              ),
            )
          }
          keyboardType="number-pad"
          accessibilityLabel="Book page number"
          placeholder="Page"
          placeholderTextColor={
            colors.textMuted
          }
          style={styles.input}
          returnKeyType="go"
          onSubmitEditing={
            jump
          }
        />

        <View style={styles.button}>
          <AppButton
            label="Go"
            disabled={!valid}
            onPress={jump}
          />
        </View>
      </View>

      {!valid &&
      value.length > 0 ? (
        <AppText
          variant="caption"
          style={styles.error}
        >
          Enter a page from 1 to {totalPages}.
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },

  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  input: {
    flex: 1,
    minHeight: 50,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    color: colors.text,
    backgroundColor: colors.surface,
    fontSize: typography.body,
    textAlign: "center",
  },

  button: {
    minWidth: 88,
  },

  error: {
    color: colors.warning,
    fontWeight: "600",
  },
});