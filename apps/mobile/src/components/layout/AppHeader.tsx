import { StyleSheet, View } from "react-native";

import { colors, spacing } from "../../theme";
import { AppText } from "../ui/AppText";
import { IconButton } from "../ui/IconButton";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: "help-circle-outline" | "settings-outline" | "ellipsis-horizontal";
  onRightPress?: () => void;
};

export function AppHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightIcon,
  onRightPress,
}: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {showBack && onBack ? (
          <IconButton
            icon="chevron-back"
            accessibilityLabel="Go back"
            onPress={onBack}
          />
        ) : null}
      </View>

      <View style={styles.center}>
        <AppText
          variant="subheading"
          align="center"
          numberOfLines={1}
        >
          {title}
        </AppText>

        {subtitle ? (
          <AppText
            variant="caption"
            muted
            align="center"
            numberOfLines={1}
          >
            {subtitle}
          </AppText>
        ) : null}
      </View>

      <View style={styles.side}>
        {rightIcon && onRightPress ? (
          <IconButton
            icon={rightIcon}
            accessibilityLabel="More options"
            onPress={onRightPress}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },

  side: {
    width: 52,
    alignItems: "center",
  },

  center: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
});