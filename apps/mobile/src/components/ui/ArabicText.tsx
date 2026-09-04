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

type ArabicTextSize =
  | "large"
  | "medium"
  | "small";

type ArabicTextProps = {
  children: string;
  size?: ArabicTextSize;
  muted?: boolean;
  center?: boolean;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

export function ArabicText({
  children,
  size = "medium",
  muted = false,
  center = false,
  style,
  numberOfLines,
}: ArabicTextProps) {
  return (
    <Text
      selectable
      numberOfLines={numberOfLines}
      style={[
        styles.base,
        styles[size],
        muted && styles.muted,
        center && styles.center,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.text,
    textAlign: "right",
    writingDirection: "rtl",
    includeFontPadding: false,
  },

  large: {
    fontSize: typography.arabicLarge,
    lineHeight: lineHeight.arabicLarge,
  },

  medium: {
    fontSize: typography.arabic,
    lineHeight: lineHeight.arabic,
  },

  small: {
    fontSize: typography.arabicSmall,
    lineHeight: lineHeight.arabicSmall,
  },

  muted: {
    color: colors.textMuted,
  },

  center: {
    textAlign: "center",
  },
});