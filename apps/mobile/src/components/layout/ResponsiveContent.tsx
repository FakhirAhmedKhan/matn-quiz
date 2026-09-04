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

type ResponsiveContentProps =
  PropsWithChildren<{
    style?:
      StyleProp<ViewStyle>;

    maxWidth?: number;

    padded?: boolean;
  }>;

export function ResponsiveContent({
  children,
  style,
  maxWidth,
  padded = false,
}: ResponsiveContentProps) {
  const layout =
    useResponsiveLayout();

  return (
    <View
      style={[
        styles.container,

        {
          maxWidth:
            maxWidth ??
            layout.contentMaxWidth,

          paddingHorizontal:
            padded
              ? layout.horizontalPadding
              : 0,
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
      alignSelf: "center",
    },
  });