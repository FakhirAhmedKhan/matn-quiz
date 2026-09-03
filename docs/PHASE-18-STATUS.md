# Matn Quiz — Phase 18 Status

## Scope

Phase 18 adds Arabic Text-to-Speech with strict hidden text protection.

## Completed

- Safe TTS text builder
- Word-level visible-only speech text
- Line-level visible-line speech text
- Browser SpeechSynthesis hook
- Arabic TTS controls
- Quiz TTS panel
- Hidden word leakage tests
- Hidden line leakage tests
- UI integration test

## Critical Rule

Never pass `quiz.originalText` or `quiz.quizText` directly to the browser audio engine.

All TTS audio must use safe derived text from:

- visible word tokens only
- visible line only
- no hidden answers
- no placeholders

## Verification

```bash
pnpm run verify:phase18
````

