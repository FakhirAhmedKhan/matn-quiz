import type {
  PropsWithChildren,
} from "react";

import {
  Pressable,
  StyleSheet,
  type PressableProps,
} from "react-native";

import {
  MOBILE_LAYOUT,
} from "../../utils/responsive";

type TouchTargetProps =
  PropsWithChildren<
    Omit<
      PressableProps,
      "children"
    >
  >;

export function TouchTarget({
  children,
  style,
  ...props
}: TouchTargetProps) {
  return (
    <Pressable
      {...props}
      hitSlop={
        props.hitSlop ??
        8
      }
      style={(
        state,
      ) => [
        styles.target,

        typeof style ===
        "function"
          ? style(state)
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
        MOBILE_LAYOUT.minimumTouchTarget,

      minHeight:
        MOBILE_LAYOUT.minimumTouchTarget,

      alignItems:
        "center",

      justifyContent:
        "center",
    },
  });