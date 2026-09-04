import type {
  PropsWithChildren,
} from "react";

import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type KeyboardAwareContentProps =
  PropsWithChildren<{
    enabled?: boolean;

    style?:
      StyleProp<ViewStyle>;

    keyboardVerticalOffset?:
      number;
  }>;

export function KeyboardAwareContent({
  children,
  enabled = true,
  style,
  keyboardVerticalOffset = 0,
}: KeyboardAwareContentProps) {
  if (!enabled) {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
      keyboardVerticalOffset={
        keyboardVerticalOffset
      }
      style={[
        styles.container,
        style,
      ]}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });