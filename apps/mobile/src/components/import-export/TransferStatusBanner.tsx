import {
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import {
  AppText,
} from "../ui";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type TransferStatusBannerProps = {
  valid: boolean;
  message: string;
};

export function TransferStatusBanner({
  valid,
  message,
}: TransferStatusBannerProps) {
  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.container,
        valid
          ? styles.valid
          : styles.invalid,
      ]}
    >
      <Ionicons
        name={
          valid
            ? "checkmark-circle-outline"
            : "information-circle-outline"
        }
        size={iconSize.md}
        color={
          valid
            ? colors.success
            : colors.warning
        }
      />

      <AppText
        variant="bodySmall"
        style={[
          styles.text,
          valid
            ? styles.validText
            : styles.invalidText,
        ]}
      >
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: radius.lg,
  },

  valid: {
    borderColor: colors.success,
    backgroundColor: colors.successSoft,
  },

  invalid: {
    borderColor: colors.warning,
    backgroundColor: colors.warningSoft,
  },

  text: {
    flex: 1,
    fontWeight: "600",
  },

  validText: {
    color: colors.success,
  },

  invalidText: {
    color: colors.warning,
  },
});