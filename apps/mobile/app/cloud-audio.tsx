import {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import {
  useRouter,
} from "expo-router";

import {
  RequireAuth,
} from "../src/auth";

import {
  AppHeader,
  AppScreen,
} from "../src/components/layout";

import {
  TtsAudioPlayerCard,
} from "../src/components/tts-cloud";

import {
  AppCard,
  AppText,
} from "../src/components/ui";

import {
  getCurrentLocalTtsText,
} from "../src/tts-api/ttsAdapter";

import {
  TTS_CONFIG,
} from "../src/tts-api/ttsConfig";

import type {
  TtsSpeed,
} from "../src/tts-api/types";

import {
  useTtsCloudStore,
} from "../src/store/ttsCloudStore";

import {
  colors,
  radius,
  spacing,
} from "../src/theme";

const GENERATION_SPEEDS:
  readonly TtsSpeed[] = [
    0.75,
    1,
    1.25,
    1.5,
  ];

function CloudAudioContent() {
  const router =
    useRouter();

  const [
    text,
    setText,
  ] =
    useState("");

  const [
    language,
    setLanguage,
  ] =
    useState(
      TTS_CONFIG.defaultLanguage,
    );

  const [
    speed,
    setSpeed,
  ] =
    useState<TtsSpeed>(
      1,
    );

  const [
    selectedVoiceId,
    setSelectedVoiceId,
  ] =
    useState<string | undefined>(
      undefined,
    );

  const voices =
    useTtsCloudStore(
      (
        state,
      ) =>
        state.voices,
    );

  const currentAudio =
    useTtsCloudStore(
      (
        state,
      ) =>
        state.currentAudio,
    );

  const status =
    useTtsCloudStore(
      (
        state,
      ) =>
        state.status,
    );

  const error =
    useTtsCloudStore(
      (
        state,
      ) =>
        state.error,
    );

  const lastCacheHit =
    useTtsCloudStore(
      (
        state,
      ) =>
        state.lastCacheHit,
    );

  const loadVoices =
    useTtsCloudStore(
      (
        state,
      ) =>
        state.loadVoices,
    );

  const generate =
    useTtsCloudStore(
      (
        state,
      ) =>
        state.generate,
    );

  const clearCache =
    useTtsCloudStore(
      (
        state,
      ) =>
        state.clearCache,
    );

  useEffect(
    () => {
      void loadVoices();
    },
    [
      loadVoices,
    ],
  );

  const generating =
    status ===
    "generating";

  const loadLocalText =
    () => {
      const localText =
        getCurrentLocalTtsText();

      if (localText) {
        setText(
          localText.slice(
            0,
            TTS_CONFIG.maxCharacters,
          ),
        );
      }
    };

  const createAudio =
    (
      force = false,
    ) => {
      void generate(
        {
          text,

          language,

          voiceId:
            selectedVoiceId,

          speed,

          format:
            TTS_CONFIG.defaultFormat,
        },
        force,
      );
    };

  const cycleSpeed =
    () => {
      const index =
        GENERATION_SPEEDS.indexOf(
          speed,
        );

      setSpeed(
        GENERATION_SPEEDS[
          (
            index +
            1
          ) %
          GENERATION_SPEEDS.length
        ] ??
        1,
      );
    };

  return (
    <AppScreen
      scroll
      keyboardAware
    >
      <AppHeader
        title="Cloud Audio"
        subtitle="Real text-to-speech generation"
        showBack
        onBack={() =>
          router.back()
        }
      />

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
          <AppText
            variant="subheading"
          >
            Text to speech
          </AppText>

          <AppText
            variant="bodySmall"
            muted
          >
            Generate real server audio from your matn, poem, book text, or any custom text.
          </AppText>
        </View>

        <TextInput
          accessibilityLabel="Text to convert to speech"
          value={
            text
          }
          onChangeText={
            setText
          }
          multiline
          textAlignVertical="top"
          maxLength={
            TTS_CONFIG.maxCharacters
          }
          placeholder="Enter Arabic or other study text..."
          placeholderTextColor={
            colors.textMuted
          }
          style={
            styles.textInput
          }
        />

        <View
          style={
            styles.counter
          }
        >
          <AppText
            variant="caption"
            muted
          >
            {text.length} / {
              TTS_CONFIG.maxCharacters
            }
          </AppText>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Use current local study text"
          disabled={
            generating
          }
          onPress={
            loadLocalText
          }
          style={({
            pressed,
          }) => [
            styles.secondaryButton,

            pressed &&
              styles.pressed,
          ]}
        >
          <AppText
            variant="bodySmall"
            style={
              styles.secondaryText
            }
          >
            Use current local text
          </AppText>
        </Pressable>
      </AppCard>

      <AppCard
        style={
          styles.card
        }
      >
        <AppText
          variant="subheading"
        >
          Speech settings
        </AppText>

        <View
          style={
            styles.field
          }
        >
          <AppText
            variant="caption"
            muted
          >
            Language
          </AppText>

          <TextInput
            accessibilityLabel="TTS language"
            value={
              language
            }
            onChangeText={
              setLanguage
            }
            autoCapitalize="none"
            placeholder="ar"
            placeholderTextColor={
              colors.textMuted
            }
            style={
              styles.smallInput
            }
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change TTS generation speed"
          onPress={
            cycleSpeed
          }
          style={({
            pressed,
          }) => [
            styles.secondaryButton,

            pressed &&
              styles.pressed,
          ]}
        >
          <AppText
            variant="bodySmall"
            style={
              styles.secondaryText
            }
          >
            Generation speed: {speed}x
          </AppText>
        </Pressable>

        <View
          style={
            styles.voiceSection
          }
        >
          <AppText
            variant="caption"
            muted
          >
            Voice
          </AppText>

          {status ===
          "loading-voices" ? (
            <ActivityIndicator
              size="small"
              color={
                colors.primary
              }
            />
          ) : null}

          <View
            style={
              styles.voiceList
            }
          >
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                setSelectedVoiceId(
                  undefined,
                )
              }
              style={({
                pressed,
              }) => [
                styles.voiceButton,

                !selectedVoiceId &&
                  styles.voiceButtonActive,

                pressed &&
                  styles.pressed,
              ]}
            >
              <AppText
                variant="caption"
                style={
                  !selectedVoiceId
                    ? styles.voiceTextActive
                    : undefined
                }
              >
                Default
              </AppText>
            </Pressable>

            {voices
              .slice(
                0,
                8,
              )
              .map(
                (
                  voice,
                ) => {
                  const active =
                    selectedVoiceId ===
                    voice.id;

                  return (
                    <Pressable
                      key={
                        voice.id
                      }
                      accessibilityRole="button"
                      accessibilityLabel={
                        `Use voice ${voice.name}`
                      }
                      onPress={() =>
                        setSelectedVoiceId(
                          voice.id,
                        )
                      }
                      style={({
                        pressed,
                      }) => [
                        styles.voiceButton,

                        active &&
                          styles.voiceButtonActive,

                        pressed &&
                          styles.pressed,
                      ]}
                    >
                      <AppText
                        variant="caption"
                        style={
                          active
                            ? styles.voiceTextActive
                            : undefined
                        }
                        numberOfLines={1}
                      >
                        {voice.name}
                      </AppText>
                    </Pressable>
                  );
                },
              )}
          </View>

          {voices.length ===
          0 ? (
            <AppText
              variant="caption"
              muted
            >
              No voice list returned. The backend default voice can still be used.
            </AppText>
          ) : null}
        </View>

        {error ? (
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
              {error}
            </AppText>
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Generate TTS audio"
          disabled={
            generating ||
            !text.trim()
          }
          onPress={() =>
            createAudio(
              false,
            )
          }
          style={({
            pressed,
          }) => [
            styles.primaryButton,

            pressed &&
              styles.pressed,

            (
              generating ||
              !text.trim()
            ) &&
              styles.disabled,
          ]}
        >
          {generating ? (
            <ActivityIndicator
              color={
                colors.textInverse
              }
            />
          ) : (
            <AppText
              variant="bodySmall"
              style={
                styles.primaryText
              }
            >
              Generate audio
            </AppText>
          )}
        </Pressable>

        {currentAudio ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Regenerate TTS audio"
            disabled={
              generating
            }
            onPress={() =>
              createAudio(
                true,
              )
            }
            style={({
              pressed,
            }) => [
              styles.secondaryButton,

              pressed &&
                styles.pressed,
            ]}
          >
            <AppText
              variant="bodySmall"
              style={
                styles.secondaryText
              }
            >
              Force regenerate
            </AppText>
          </Pressable>
        ) : null}

        {lastCacheHit ? (
          <View
            style={
              styles.cacheNotice
            }
          >
            <AppText
              variant="caption"
              style={
                styles.cacheText
              }
            >
              Loaded instantly from the current app TTS cache.
            </AppText>
          </View>
        ) : null}
      </AppCard>

      {currentAudio ? (
        <TtsAudioPlayerCard
          audio={
            currentAudio
          }
        />
      ) : null}

      <AppCard
        style={
          styles.card
        }
      >
        <AppText
          variant="subheading"
        >
          Cache
        </AppText>

        <AppText
          variant="bodySmall"
          muted
        >
          Repeated generation requests with the same text, language, voice and speed reuse the current session cache.
        </AppText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear TTS cache"
          onPress={
            clearCache
          }
          style={({
            pressed,
          }) => [
            styles.secondaryButton,

            pressed &&
              styles.pressed,
          ]}
        >
          <AppText
            variant="bodySmall"
            style={
              styles.secondaryText
            }
          >
            Clear TTS cache
          </AppText>
        </Pressable>
      </AppCard>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open original audio screen"
        onPress={() =>
          router.push(
            "/audio" as never,
          )
        }
        style={({
          pressed,
        }) => [
          styles.originalButton,

          pressed &&
            styles.pressed,
        ]}
      >
        <AppText
          variant="bodySmall"
          style={
            styles.secondaryText
          }
        >
          Open original Audio screen
        </AppText>
      </Pressable>
    </AppScreen>
  );
}

export default function CloudAudioScreen() {
  return (
    <RequireAuth>
      <CloudAudioContent />
    </RequireAuth>
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
        spacing.sm,
    },

    textInput: {
      minHeight:
        180,
      borderWidth:
        1,
      borderColor:
        colors.border,
      borderRadius:
        radius.lg,
      padding:
        spacing.md,
      backgroundColor:
        colors.surface,
      color:
        colors.text,
      fontSize:
        17,
    },

    counter: {
      alignItems:
        "flex-end",
    },

    field: {
      gap:
        spacing.sm,
    },

    smallInput: {
      minHeight:
        48,
      borderWidth:
        1,
      borderColor:
        colors.border,
      borderRadius:
        radius.lg,
      paddingHorizontal:
        spacing.md,
      backgroundColor:
        colors.surface,
      color:
        colors.text,
      fontSize:
        16,
    },

    voiceSection: {
      gap:
        spacing.sm,
    },

    voiceList: {
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      gap:
        spacing.sm,
    },

    voiceButton: {
      minHeight:
        40,
      maxWidth:
        160,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderWidth:
        1,
      borderColor:
        colors.border,
      borderRadius:
        radius.pill,
      paddingHorizontal:
        spacing.md,
      backgroundColor:
        colors.surface,
    },

    voiceButtonActive: {
      borderColor:
        colors.primary,
      backgroundColor:
        colors.primarySoft,
    },

    voiceTextActive: {
      color:
        colors.primary,
      fontWeight:
        "800",
    },

    primaryButton: {
      minHeight:
        52,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderRadius:
        radius.lg,
      paddingHorizontal:
        spacing.md,
      backgroundColor:
        colors.primary,
    },

    primaryText: {
      color:
        colors.textInverse,
      fontWeight:
        "800",
    },

    secondaryButton: {
      minHeight:
        46,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderRadius:
        radius.lg,
      paddingHorizontal:
        spacing.md,
      backgroundColor:
        colors.primarySoft,
    },

    secondaryText: {
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

    cacheNotice: {
      padding:
        spacing.md,
      borderRadius:
        radius.md,
      backgroundColor:
        colors.successSoft,
    },

    cacheText: {
      color:
        colors.success,
      fontWeight:
        "700",
    },

    originalButton: {
      minHeight:
        48,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderRadius:
        radius.lg,
      backgroundColor:
        colors.primarySoft,
    },

    pressed: {
      opacity:
        0.7,
    },

    disabled: {
      opacity:
        0.5,
    },
  });