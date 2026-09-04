import type {
  ComponentProps,
  ReactNode,
} from "react";

import {
  StyleSheet,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  AppCard,
  AppText,
} from "../ui";

import {
  colors,
  iconSize,
  spacing,
} from "../../theme";

type IconName =
  ComponentProps<
    typeof Ionicons
  >["name"];

type SettingsSectionProps = {
  title: string;

  description?: string;

  icon: IconName;

  children: ReactNode;
};

export function SettingsSection({
  title,
  description,
  icon,
  children,
}: SettingsSectionProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Ionicons
            name={icon}
            size={iconSize.md}
            color={colors.primary}
          />
        </View>

        <View style={styles.heading}>
          <AppText variant="subheading">
            {title}
          </AppText>

          {description ? (
            <AppText
              variant="caption"
              muted
            >
              {description}
            </AppText>
          ) : null}
        </View>
      </View>

      <View style={styles.content}>
        {children}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  icon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor:
      colors.primarySoft,
  },

  heading: {
    flex: 1,
    gap: spacing.xs,
  },

  content: {
    gap: spacing.lg,
  },
});