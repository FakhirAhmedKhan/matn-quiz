import type {
  PropsWithChildren,
} from "react";

import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  useResponsiveLayout,
} from "../../hooks/useResponsiveLayout";

import {
  getResponsiveGap,
  shouldStackActions,
} from "../../utils/responsive";

type ResponsiveActionRowProps =
  PropsWithChildren<{
    style?:
      StyleProp<ViewStyle>;

    stackOnPhone?:
      boolean;
  }>;

export function ResponsiveActionRow({
  children,
  style,
  stackOnPhone = true,
}: ResponsiveActionRowProps) {
  const layout =
    useResponsiveLayout();

  const stacked =
    stackOnPhone &&
    shouldStackActions(
      layout.width,
    );

  return (
    <View
      style={[
        styles.container,

        {
          flexDirection:
            stacked
              ? "column"
              : "row",

          gap:
            getResponsiveGap(
              layout.width,
            ),
        },

        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      width: "100%",
      alignItems: "stretch",
    },
  });