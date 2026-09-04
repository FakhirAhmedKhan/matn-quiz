import { Image, StyleSheet, View } from "react-native";

import { AppText, IconButton } from "../ui";
import {
  colors,
  radius,
  spacing,
} from "../../theme";

type HomeHeaderProps = {
  title: string;
  subtitle: string;
  eyebrow?: string;
  onHelpPress?: () => void;
};

export function HomeHeader({
  title,
  subtitle,
  eyebrow,
  onHelpPress,
}: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <Image
          source={require("../../../assets/images/matn-quiz-icon.png")}
          resizeMode="cover"
          style={styles.logo}
          accessibilityIgnoresInvertColors
        />

        <View style={styles.text}>
          <AppText
            variant="subheading"
            numberOfLines={1}
          >
            {title}
          </AppText>

          <AppText
            variant="caption"
            muted
            numberOfLines={1}
          >
            {subtitle}
          </AppText>

          {eyebrow ? (
            <AppText
              variant="caption"
              style={styles.eyebrow}
              numberOfLines={1}
            >
              {eyebrow}
            </AppText>
          ) : null}
        </View>
      </View>

      {onHelpPress ? (
        <View style={styles.action}>
          <IconButton
            icon="help-circle-outline"
            accessibilityLabel="Help"
            onPress={onHelpPress}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  brand: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  logo: {
    width: 52,
    height: 52,
    flexShrink: 0,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  text: {
    flex: 1,
    minWidth: 0,
  },

  eyebrow: {
    marginTop: spacing.xxs,
    color: colors.primary,
    fontWeight: "800",
  },

  action: {
    flexShrink: 0,
  },
});