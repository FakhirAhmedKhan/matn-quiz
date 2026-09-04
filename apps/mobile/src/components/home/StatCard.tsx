import type { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  AppCard,
  AppText,
} from "../ui";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

type StatCardProps = {
  value: string;
  label: string;
  icon: IconName;
};

export function StatCard({
  value,
  label,
  icon,
}: StatCardProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={iconSize.md}
          color={colors.primary}
        />
      </View>

      <AppText
        variant="heading"
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
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.lg,
  },

  iconContainer: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },

  value: {
    color: colors.primaryDark,
  },
});