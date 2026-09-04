import {
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import type {
  BookFileMetadata,
} from "../../types/book";
import {
  formatFileSize,
  validateBookImportFile,
} from "../../utils/bookImport";
import {
  AppButton,
  AppCard,
  AppText,
} from "../ui";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type SelectedBookFileCardProps = {
  file: BookFileMetadata;
  onRemove: () => void;
};

export function SelectedBookFileCard({
  file,
  onRemove,
}: SelectedBookFileCardProps) {
  const validation =
    validateBookImportFile(
      file,
    );

  return (
    <AppCard
      style={[
        styles.card,
        validation.valid
          ? styles.validCard
          : styles.invalidCard,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.icon}>
          <Ionicons
            name="document-text-outline"
            size={iconSize.lg}
            color={
              validation.valid
                ? colors.primary
                : colors.warning
            }
          />
        </View>

        <View style={styles.fileInfo}>
          <AppText
            variant="subheading"
            numberOfLines={2}
          >
            {file.fileName}
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            {formatFileSize(
              file.sizeBytes,
            )}
          </AppText>

          <AppText
            variant="caption"
            muted
            numberOfLines={1}
          >
            {file.mimeType ??
              "Unknown MIME type"}
          </AppText>
        </View>

        <Ionicons
          name={
            validation.valid
              ? "checkmark-circle"
              : "warning"
          }
          size={iconSize.md}
          color={
            validation.valid
              ? colors.success
              : colors.warning
          }
        />
      </View>

      <View style={styles.status}>
        <AppText
          variant="bodySmall"
          style={[
            styles.statusText,
            validation.valid
              ? styles.validText
              : styles.invalidText,
          ]}
        >
          {validation.message}
        </AppText>
      </View>

      <AppButton
        label="Remove Selected File"
        variant="ghost"
        onPress={onRemove}
      />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },

  validCard: {
    borderColor: colors.success,
  },

  invalidCard: {
    borderColor: colors.warning,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  icon: {
    width: 48,
    height: 56,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },

  fileInfo: {
    flex: 1,
    gap: spacing.xs,
  },

  status: {
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundSoft,
  },

  statusText: {
    fontWeight: "700",
  },

  validText: {
    color: colors.success,
  },

  invalidText: {
    color: colors.warning,
  },
});