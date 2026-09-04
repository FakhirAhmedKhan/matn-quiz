import type {
  ComponentProps,
} from "react";
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

type IconName =
  ComponentProps<
    typeof Ionicons
  >["name"];

type HistoryStatCardProps = {
  label: string;
  value: string;
  icon: IconName;
};

export function HistoryStatCard({
  label,
  value,
  icon,
}: HistoryStatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Ionicons
          name={icon}
          size={iconSize.md}
          color={colors.primary}
        />
      </View>

      <AppText
        variant="subheading"
        align="center"
        style={styles.value}
      >
        {value}
      </AppText>

      <AppText
        variant="caption"
        muted
        align="center"
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
    alignItems: "center",
    gap: spacing.xs,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },

  icon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },

  value: {
    color: colors.primaryDark,
  },
});