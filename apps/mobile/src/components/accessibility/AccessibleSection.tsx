import type {
  PropsWithChildren,
} from "react";

import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type AccessibleSectionProps =
  PropsWithChildren<{
    label: string;

    style?:
      StyleProp<ViewStyle>;
  }>;

export function AccessibleSection({
  label,
  children,
  style,
}: AccessibleSectionProps) {
  return (
    <View
      accessible={false}
      accessibilityLabel={
        label
      }
      style={[
        styles.section,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles =
  StyleSheet.create({
    section: {
      width: "100%",
    },
  });