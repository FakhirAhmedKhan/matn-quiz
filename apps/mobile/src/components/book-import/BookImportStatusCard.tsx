import {
  ActivityIndicator,
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

export type BookImportStatus =
  | "IDLE"
  | "PROCESSING"
  | "SUCCESS"
  | "ERROR";

type BookImportStatusCardProps = {
  status: BookImportStatus;
  message: string;
};

export function BookImportStatusCard({
  status,
  message,
}: BookImportStatusCardProps) {
  if (
    status === "IDLE"
  ) {
    return null;
  }

  const processing =
    status === "PROCESSING";

  const success =
    status === "SUCCESS";

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.container,
        success
          ? styles.success
          : status === "ERROR"
            ? styles.error
            : styles.processing,
      ]}
    >
      {processing ? (
        <ActivityIndicator
          size="small"
          color={colors.primary}
        />
      ) : (
        <Ionicons
          name={
            success
              ? "checkmark-circle-outline"
              : "warning-outline"
          }
          size={iconSize.md}
          color={
            success
              ? colors.success
              : colors.warning
          }
        />
      )}

      <AppText
        variant="bodySmall"
        style={styles.text}
      >
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: radius.lg,
  },

  processing: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },

  success: {
    borderColor: colors.success,
    backgroundColor: colors.successSoft,
  },

  error: {
    borderColor: colors.warning,
    backgroundColor: colors.warningSoft,
  },

  text: {
    flex: 1,
    color: colors.primaryDark,
    fontWeight: "600",
  },
});