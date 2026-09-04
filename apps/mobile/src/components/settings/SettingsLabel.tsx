import {
  StyleSheet,
  View,
} from "react-native";

import {
  AppText,
} from "../ui";

import {
  spacing,
} from "../../theme";

type SettingsLabelProps = {
  title: string;

  description?: string;
};

export function SettingsLabel({
  title,
  description,
}: SettingsLabelProps) {
  return (
    <View style={styles.container}>
      <AppText
        variant="bodySmall"
        style={styles.title}
      >
        {title}
      </AppText>

      {description ? (
        <AppText
          variant="caption"
          muted
        >
          {description}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },

  title: {
    fontWeight: "800",
  },
});