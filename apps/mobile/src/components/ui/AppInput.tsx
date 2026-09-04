import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

import { colors, radius, spacing, typography } from "../../theme";

type AppInputProps = TextInputProps & {
  label?: string;
  error?: string;
  arabic?: boolean;
};

export function AppInput({
  label,
  error,
  arabic = false,
  multiline,
  style,
  ...props
}: AppInputProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          multiline && styles.multiline,
          arabic && styles.arabic,
          error && styles.errorInput,
          style,
        ]}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing.sm,
  },

  label: {
    color: colors.text,
    fontSize: typography.bodySmall,
    fontWeight: "700",
  },

  input: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: typography.body,
  },

  multiline: {
    minHeight: 150,
    textAlignVertical: "top",
  },

  arabic: {
    textAlign: "right",
    writingDirection: "rtl",
    fontSize: typography.arabic,
    lineHeight: 40,
  },

  errorInput: {
    borderColor: colors.danger,
  },

  error: {
    color: colors.danger,
    fontSize: typography.caption,
    fontWeight: "600",
  },
});