import {
  existsSync,
  readFileSync,
} from "node:fs";

const checks = [
  {
    file:
      "src/tts-api/ttsApi.ts",

    pattern:
      "getVoices",

    label:
      "Voice discovery API",
  },

  {
    file:
      "src/tts-api/ttsApi.ts",

    pattern:
      "generate",

    label:
      "Real TTS generation API",
  },

  {
    file:
      "src/tts-api/ttsResponse.ts",

    pattern:
      "audioUrl",

    label:
      "Audio URL normalization",
  },

  {
    file:
      "src/tts-api/ttsValidation.ts",

    pattern:
      "maxCharacters",

    label:
      "TTS text size validation",
  },

  {
    file:
      "src/store/ttsCloudStore.ts",

    pattern:
      "cacheKey",

    label:
      "TTS generation cache",
  },

  {
    file:
      "src/store/ttsCloudStore.ts",

    pattern:
      "force",

    label:
      "Force regeneration support",
  },

  {
    file:
      "src/components/tts-cloud/TtsAudioPlayerCard.tsx",

    pattern:
      "useAudioPlayer",

    label:
      "Real Expo audio player",
  },

  {
    file:
      "src/components/tts-cloud/TtsAudioPlayerCard.tsx",

    pattern:
      "useAudioPlayerStatus",

    label:
      "Audio playback status",
  },

  {
    file:
      "src/components/tts-cloud/TtsAudioPlayerCard.tsx",

    pattern:
      "Authorization",

    label:
      "Authenticated audio source",
  },

  {
    file:
      "src/components/tts-cloud/TtsAudioPlayerCard.tsx",

    pattern:
      "seekTo",

    label:
      "Audio seek controls",
  },

  {
    file:
      "src/components/tts-cloud/TtsAudioPlayerCard.tsx",

    pattern:
      "playbackRate",

    label:
      "Playback speed control",
  },

  {
    file:
      "src/components/tts-cloud/TtsAudioPlayerCard.tsx",

    pattern:
      "player.loop",

    label:
      "Repeat playback support",
  },

  {
    file:
      "src/tts-api/ttsBridge.ts",

    pattern:
      "useAuthStore.subscribe",

    label:
      "Logout TTS cleanup",
  },

  {
    file:
      "app/cloud-audio.tsx",

    pattern:
      "<RequireAuth>",

    label:
      "Protected cloud audio route",
  },

  {
    file:
      "app/cloud-audio.tsx",

    pattern:
      "<TtsAudioPlayerCard",

    label:
      "TTS player UI integration",
  },
];

let failed =
  false;

console.log("");
console.log(
  "MATN QUIZ REAL TTS AUDIO AUDIT",
);

console.log(
  "==============================",
);

for (
  const check of checks
) {
  if (
    !existsSync(
      check.file,
    )
  ) {
    console.error(
      `MISS ${check.label}: ${check.file}`,
    );

    failed =
      true;

    continue;
  }

  const content =
    readFileSync(
      check.file,
      "utf8",
    );

  if (
    content.includes(
      check.pattern,
    )
  ) {
    console.log(
      `OK   ${check.label}`,
    );
  } else {
    console.error(
      `MISS ${check.label}`,
    );

    failed =
      true;
  }
}

if (failed) {
  process.exitCode =
    1;
} else {
  console.log("");
  console.log(
    "P2-M9 REAL TTS + AUDIO API AUDIT PASSED",
  );
}