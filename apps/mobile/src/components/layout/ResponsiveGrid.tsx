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
} from "../../utils/responsive";

type ResponsiveGridProps =
  PropsWithChildren<{
    style?:
      StyleProp<ViewStyle>;

    forceSingleColumn?:
      boolean;
  }>;

export function ResponsiveGrid({
  children,
  style,
  forceSingleColumn = false,
}: ResponsiveGridProps) {
  const layout =
    useResponsiveLayout();

  const columns =
    forceSingleColumn
      ? 1
      : layout.gridColumns;

  const itemBasis =
    columns === 1
      ? "100%"
      : columns === 2
        ? "48%"
        : "31%";

  return (
    <View
      style={[
        styles.container,

        {
          gap:
            getResponsiveGap(
              layout.width,
            ),
        },

        style,
      ]}
    >
      {Array.isArray(children)
        ? children.map(
            (
              child,
              index,
            ) => (
              <View
                key={index}
                style={{
                  flexGrow: 1,
                  flexBasis:
                    itemBasis,
                  maxWidth:
                    columns === 1
                      ? "100%"
                      : undefined,
                }}
              >
                {child}
              </View>
            ),
          )
        : (
          <View
            style={{
              flexGrow: 1,
              flexBasis:
                itemBasis,
            }}
          >
            {children}
          </View>
        )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      width: "100%",
      flexDirection: "row",
      flexWrap: "wrap",
    },
  });