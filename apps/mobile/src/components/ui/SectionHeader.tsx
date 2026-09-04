import { StyleSheet, View } from "react-native";

import { spacing } from "../../theme";
import { AppText } from "./AppText";

type SectionHeaderProps = {
  title: string;
  description?: string;
};

export function SectionHeader({
  title,
  description,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <AppText variant="subheading">{title}</AppText>

      {description ? (
        <AppText variant="bodySmall" muted>
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
});