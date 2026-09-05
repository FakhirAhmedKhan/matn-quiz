import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";

import {
  authTokenStorage,
} from "../../auth/authTokenStorage";

import type {
  GeneratedTtsAudio,
  TtsRepeat,
  TtsSpeed,
} from "../../tts-api/types";

import {
  colors,
  radius,
  spacing,
} from "../../theme";

import {
  AppCard,
  AppText,
  ProgressBar,
} from "../ui";

type Props = {
  audio:
    GeneratedTtsAudio;
};

const SPEEDS:
  readonly TtsSpeed[] = [
    0.75,
    1,
    1.25,
    1.5,
  ];

const REPEATS:
  readonly TtsRepeat[] = [
    1,
    2,
    3,
    "INFINITE",
  ];

function formatSeconds(
  value: number,
): string {
  const safe =
    Math.max(
      0,
      Math.floor(
        value,
      ),
    );

  const minutes =
    Math.floor(
      safe /
      60,
    );

  const seconds =
    safe %
    60;

  return `${minutes}:${String(
    seconds,
  ).padStart(
    2,
    "0",
  )}`;
}

export function TtsAudioPlayerCard({
  audio,
}: Props) {
  const player =
    useAudioPlayer(
      null,
      {
        updateInterval:
          250,

        downloadFirst:
          true,
      },
    );

  const status =
    useAudioPlayerStatus(
      player,
    );

  const [
    speed,
    setSpeed,
  ] =
    useState<TtsSpeed>(
      1,
    );

  const [
    repeat,
    setRepeat,
  ] =
    useState<TtsRepeat>(
      1,
    );

  const repeatCounter =
    useRef(
      0,
    );

  useEffect(
    () => {
      void setAudioModeAsync({
        playsInSilentMode:
          true,

        interruptionMode:
          "duckOthers",
      });
    },
    [],
  );

  useEffect(
    () => {
      let cancelled =
        false;

      void (
        async () => {
          player.pause();

          repeatCounter.current =
            0;

          const token =
            await authTokenStorage.getAccessToken();

          if (cancelled) {
            return;
          }

          player.replace({
            uri:
              audio.audioUrl,

            name:
              "Matn Quiz TTS",

            ...(token
              ? {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                }
              : {}),
          });
        }
      )();

      return () => {
        cancelled =
          true;
      };
    },
    [
      audio.audioUrl,
      player,
    ],
  );

  useEffect(
    () => {
      player.playbackRate =
        speed;
    },
    [
      player,
      speed,
    ],
  );

  useEffect(
    () => {
      player.loop =
        repeat ===
        "INFINITE";

      repeatCounter.current =
        0;
    },
    [
      player,
      repeat,
    ],
  );

  useEffect(
    () => {
      if (
        !status.didJustFinish ||
        repeat ===
          "INFINITE"
      ) {
        return;
      }

      const target =
        repeat;

      if (
        repeatCounter.current +
          1 <
        target
      ) {
        repeatCounter.current +=
          1;

        void player
          .seekTo(
            0,
          )
          .then(
            () => {
              player.play();
            },
          );
      }
      else {
        repeatCounter.current =
          0;
      }
    },
    [
      player,
      repeat,
      status.didJustFinish,
    ],
  );

  const progress =
    status.duration >
      0
      ? Math.max(
          0,
          Math.min(
            1,
            status.currentTime /
              status.duration,
          ),
        )
      : 0;

  const playPause =
    async () => {
      if (
        status.playing
      ) {
        player.pause();

        return;
      }

      if (
        status.duration >
          0 &&
        status.currentTime >=
          status.duration -
            0.1
      ) {
        await player.seekTo(
          0,
        );
      }

      player.play();
    };

  const seek =
    async (
      amount: number,
    ) => {
      const destination =
        Math.max(
          0,
          Math.min(
            status.duration ||
              Number.MAX_SAFE_INTEGER,

            status.currentTime +
              amount,
          ),
        );

      await player.seekTo(
        destination,
      );
    };

  const cycleSpeed =
    () => {
      const index =
        SPEEDS.indexOf(
          speed,
        );

      setSpeed(
        SPEEDS[
          (
            index +
            1
          ) %
          SPEEDS.length
        ] ??
        1,
      );
    };

  const cycleRepeat =
    () => {
      const index =
        REPEATS.indexOf(
          repeat,
        );

      setRepeat(
        REPEATS[
          (
            index +
            1
          ) %
          REPEATS.length
        ] ??
        1,
      );
    };

  return (
    <AppCard
      style={
        styles.card
      }
    >
      <View
        style={
          styles.heading
        }
      >
        <View
          style={
            styles.titleRow
          }
        >
          <Ionicons
            name="volume-high-outline"
            size={22}
            color={
              colors.primary
            }
          />

          <AppText
            variant="subheading"
          >
            Generated audio
          </AppText>

          {status.isBuffering ? (
            <ActivityIndicator
              size="small"
              color={
                colors.primary
              }
            />
          ) : null}
        </View>

        <AppText
          variant="caption"
          muted
        >
          {
            audio.language ??
            "Default language"
          }
          {" • "}
          {
            audio.voiceId ??
            "Default voice"
          }
          {" • "}
          {
            audio.format.toUpperCase()
          }
        </AppText>
      </View>

      {status.error ? (
        <View
          accessibilityRole="alert"
          style={
            styles.error
          }
        >
          <AppText
            variant="bodySmall"
            style={
              styles.errorText
            }
          >
            {status.error}
          </AppText>
        </View>
      ) : null}

      <View
        style={
          styles.progressArea
        }
      >
        <ProgressBar
          value={
            progress
          }
        />

        <View
          style={
            styles.timeRow
          }
        >
          <AppText
            variant="caption"
            muted
          >
            {formatSeconds(
              status.currentTime,
            )}
          </AppText>

          <AppText
            variant="caption"
            muted
          >
            {formatSeconds(
              status.duration,
            )}
          </AppText>
        </View>
      </View>

      <View
        style={
          styles.playerControls
        }
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Seek backward 10 seconds"
          onPress={() => {
            void seek(
              -10,
            );
          }}
          style={({
            pressed,
          }) => [
            styles.roundButton,

            pressed &&
              styles.pressed,
          ]}
        >
          <Ionicons
            name="play-back-outline"
            size={22}
            color={
              colors.primary
            }
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            status.playing
              ? "Pause audio"
              : "Play audio"
          }
          onPress={() => {
            void playPause();
          }}
          style={({
            pressed,
          }) => [
            styles.playButton,

            pressed &&
              styles.pressed,
          ]}
        >
          <Ionicons
            name={
              status.playing
                ? "pause"
                : "play"
            }
            size={27}
            color={
              colors.textInverse
            }
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Seek forward 10 seconds"
          onPress={() => {
            void seek(
              10,
            );
          }}
          style={({
            pressed,
          }) => [
            styles.roundButton,

            pressed &&
              styles.pressed,
          ]}
        >
          <Ionicons
            name="play-forward-outline"
            size={22}
            color={
              colors.primary
            }
          />
        </Pressable>
      </View>

      <View
        style={
          styles.options
        }
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change playback speed"
          onPress={
            cycleSpeed
          }
          style={({
            pressed,
          }) => [
            styles.optionButton,

            pressed &&
              styles.pressed,
          ]}
        >
          <Ionicons
            name="speedometer-outline"
            size={18}
            color={
              colors.primary
            }
          />

          <AppText
            variant="bodySmall"
            style={
              styles.optionText
            }
          >
            {speed}x
          </AppText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change repeat mode"
          onPress={
            cycleRepeat
          }
          style={({
            pressed,
          }) => [
            styles.optionButton,

            pressed &&
              styles.pressed,
          ]}
        >
          <Ionicons
            name="repeat-outline"
            size={18}
            color={
              colors.primary
            }
          />

          <AppText
            variant="bodySmall"
            style={
              styles.optionText
            }
          >
            {repeat ===
            "INFINITE"
              ? "∞"
              : `${repeat}x`}
          </AppText>
        </Pressable>
      </View>

      <AppText
        variant="caption"
        muted
        numberOfLines={2}
      >
        {
          audio.serverCached
            ? "Server cache hit"
            : "Generated by TTS service"
        }
        {
          audio.durationSeconds !==
          null
            ? ` • ${Math.round(audio.durationSeconds)} sec`
            : ""
        }
      </AppText>
    </AppCard>
  );
}

const styles =
  StyleSheet.create({
    card: {
      gap:
        spacing.lg,
    },

    heading: {
      gap:
        spacing.xs,
    },

    titleRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap:
        spacing.sm,
    },

    progressArea: {
      gap:
        spacing.sm,
    },

    timeRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
    },

    playerControls: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap:
        spacing.lg,
    },

    roundButton: {
      width:
        50,
      height:
        50,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderRadius:
        radius.pill,
      backgroundColor:
        colors.primarySoft,
    },

    playButton: {
      width:
        66,
      height:
        66,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderRadius:
        radius.pill,
      backgroundColor:
        colors.primary,
    },

    options: {
      flexDirection:
        "row",
      gap:
        spacing.sm,
    },

    optionButton: {
      flex:
        1,
      minHeight:
        44,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap:
        spacing.sm,
      borderRadius:
        radius.lg,
      paddingHorizontal:
        spacing.md,
      backgroundColor:
        colors.primarySoft,
    },

    optionText: {
      color:
        colors.primary,
      fontWeight:
        "800",
    },

    error: {
      padding:
        spacing.md,
      borderRadius:
        radius.md,
      backgroundColor:
        colors.warningSoft,
    },

    errorText: {
      color:
        colors.warning,
      fontWeight:
        "700",
    },

    pressed: {
      opacity:
        0.7,
    },
  });