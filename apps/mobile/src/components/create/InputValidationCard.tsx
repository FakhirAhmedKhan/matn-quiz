import {
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  AppText,
} from "../ui";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type InputValidationCardProps = {
  valid: boolean;
  message: string;
};

export function InputValidationCard({
  valid,
  message,
}: InputValidationCardProps) {
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
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },

  valid: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },

  invalid: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
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