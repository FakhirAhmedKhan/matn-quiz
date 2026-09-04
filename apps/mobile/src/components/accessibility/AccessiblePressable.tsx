import type {
  PropsWithChildren,
} from "react";

import {
  Pressable,
  StyleSheet,
  type PressableProps,
} from "react-native";

import {
  ACCESSIBILITY,
} from "../../accessibility/accessibility";

type AccessiblePressableProps =
  PropsWithChildren<
    Omit<
      PressableProps,
      "children"
    > & {
      accessibilityLabel:
        string;

      accessibilityHint?:
        string;
    }
  >;

export function AccessiblePressable({
  children,
  style,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole =
    "button",
  hitSlop,
  ...props
}: AccessiblePressableProps) {
  return (
    <Pressable
      {...props}
      accessibilityRole={
        accessibilityRole
      }
      accessibilityLabel={
        accessibilityLabel
      }
      accessibilityHint={
        accessibilityHint
      }
      hitSlop={
        hitSlop ?? 8
      }
      style={(
        state,
      ) => [
        styles.target,

        typeof style ===
        "function"
          ? style(
              state,
            )
          : style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    target: {
      minWidth:
        ACCESSIBILITY.minimumTouchTarget,

      minHeight:
        ACCESSIBILITY.minimumTouchTarget,

      alignItems:
        "center",

      justifyContent:
        "center",
    },
  });