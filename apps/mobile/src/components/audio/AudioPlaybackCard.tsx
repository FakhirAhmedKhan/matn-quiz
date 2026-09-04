import {
  StyleSheet,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import {
  AppButton,
  AppCard,
  AppText,
  ArabicText,
  ProgressBar,
} from "../ui";
import {
  formatAudioTime,
} from "../../utils/audio";
import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

type AudioPlaybackCardProps = {
  text: string;
  prepared: boolean;
  preparing: boolean;
  playing: boolean;
  positionMs: number;
  durationMs: number;
  repeatCompleted: number;
  onPrepare: () => void;
  onTogglePlayback: () => void;
  onRestart: () => void;
};

export function AudioPlaybackCard({
  text,
  prepared,
  preparing,
  playing,
  positionMs,
  durationMs,
  repeatCompleted,
  onPrepare,
  onTogglePlayback,
  onRestart,
}: AudioPlaybackCardProps) {
  const progress =
    durationMs <= 0
      ? 0
      : Math.min(
          1,
          positionMs /
            durationMs,
        );

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Ionicons
            name="volume-high-outline"
            size={iconSize.lg}
            color={colors.primary}
          />
        </View>

        <View style={styles.headerText}>
          <AppText variant="subheading">
            Audio Player
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            Mock Arabic TTS playback
          </AppText>
        </View>
      </View>

      <View style={styles.textPreview}>
        <ArabicText
          size="medium"
          numberOfLines={5}
        >
          {text}
        </ArabicText>
      </View>

      <View style={styles.timeRow}>
        <AppText
          variant="caption"
          muted
        >
          {formatAudioTime(
            positionMs,
          )}
        </AppText>

        <AppText
          variant="caption"
          muted
        >
          {formatAudioTime(
            durationMs,
          )}
        </AppText>
      </View>

      <ProgressBar
        value={progress}
      />

      <View style={styles.repeatStatus}>
        <Ionicons
          name="repeat-outline"
          size={iconSize.sm}
          color={colors.primary}
        />

        <AppText
          variant="caption"
          muted
        >
          Completed plays: {repeatCompleted}
        </AppText>
      </View>

      {!prepared ? (
        <AppButton
          label={
            preparing
              ? "Preparing Mock Audio..."
              : "Prepare Mock Audio"
          }
          disabled={
            preparing ||
            !text.trim()
          }
          onPress={onPrepare}
        />
      ) : (
        <View style={styles.controls}>
          <View style={styles.control}>
            <AppButton
              label={
                playing
                  ? "Pause"
                  : "Play"
              }
              onPress={
                onTogglePlayback
              }
            />
          </View>

          <View style={styles.control}>
            <AppButton
              label="Restart"
              variant="secondary"
              onPress={onRestart}
            />
          </View>
        </View>
      )}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  icon: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  headerText: {
    flex: 1,
    gap: spacing.xs,
  },

  textPreview: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSoft,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  repeatStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  controls: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  control: {
    flex: 1,
  },
});