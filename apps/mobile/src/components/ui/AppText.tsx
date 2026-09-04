import type { PropsWithChildren } from "react";
import {
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
} from "react-native";

import {
  colors,
  lineHeight,
  typography,
} from "../../theme";

type AppTextVariant =
  | "display"
  | "title"
  | "heading"
  | "subheading"
  | "body"
  | "bodySmall"
  | "caption";

type AppTextProps = PropsWithChildren<{
  variant?: AppTextVariant;
  muted?: boolean;
  inverse?: boolean;
  align?: "left" | "center" | "right";
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}>;

export function AppText({
  children,
  variant = "body",
  muted = false,
  inverse = false,
  align = "left",
  style,
  numberOfLines,
}: AppTextProps) {
  const color = inverse
    ? colors.textInverse
    : muted
      ? colors.textMuted
      : colors.text;

  return (
    <Text allowFontScaling maxFontSizeMultiplier={2}
      numberOfLines={numberOfLines}
      style={[
        styles.base,
        styles[variant],
        { color, textAlign: align },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },

  display: {
    fontSize: typography.display,
    lineHeight: lineHeight.display,
    fontWeight: "800",
  },

  title: {
    fontSize: typography.title,
    lineHeight: lineHeight.title,
    fontWeight: "800",
  },

  heading: {
    fontSize: typography.heading,
    lineHeight: lineHeight.heading,
    fontWeight: "800",
  },

  subheading: {
    fontSize: typography.subheading,
    lineHeight: lineHeight.subheading,
    fontWeight: "700",
  },

  body: {
    fontSize: typography.body,
    lineHeight: lineHeight.body,
    fontWeight: "400",
  },

  bodySmall: {
    fontSize: typography.bodySmall,
    lineHeight: lineHeight.bodySmall,
    fontWeight: "400",
  },

  caption: {
    fontSize: typography.caption,
    lineHeight: lineHeight.caption,
    fontWeight: "600",
  },
});