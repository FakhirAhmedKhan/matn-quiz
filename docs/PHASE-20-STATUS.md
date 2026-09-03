# Matn Quiz - Phase 20 Status

Phase 20 now uses a no-key demo Arabic TTS provider through `/api/tts`.

## Current Provider

Google Translate TTS demo endpoint.

## Env

No API key is required.

Optional values:

```env
GOOGLE_TRANSLATE_TTS_LANG=ar
GOOGLE_TRANSLATE_TTS_CLIENT=tw-ob
GOOGLE_TRANSLATE_TTS_MAX_CHUNK=180
GOOGLE_TRANSLATE_TTS_ENDPOINT=https://translate.google.com/translate_tts
```

## Safety Rule

Never send hidden answers to `/api/tts`.

Only send safe visible text generated from `lib/quiz/tts-safe-text.ts`.

## Note

This provider is for demo/local usage. For production, use a stable provider with official API terms.
