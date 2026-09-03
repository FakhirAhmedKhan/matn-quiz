
# Arabic TTS Safety Notes

## Word Mode

When the quiz method is Hide Words, selected hidden token indexes are removed before the text is passed to the speech engine.

## Line Mode

When the quiz method is Hide Lines, each line gets its own speak button. Hidden line buttons are disabled and pass an empty string.

## Never Do This

```ts
speechSynthesis.speak(new SpeechSynthesisUtterance(quiz.originalText));
speechSynthesis.speak(new SpeechSynthesisUtterance(quiz.quizText));
```

## Always Do This

```ts
const speakableText = buildSpeakableTextFromQuiz({ quiz, lineTokenIndex });

if (speakableText.trim()) {
  speakArabicText(speakableText);
}
```

