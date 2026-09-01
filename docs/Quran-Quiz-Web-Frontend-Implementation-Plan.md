# Quran Quiz Web --- Frontend-Only Implementation Plan

> **Scope:** Frontend only (Next.js + TypeScript + Tailwind CSS). No
> backend, database, authentication, or AI integration in the initial
> release.

------------------------------------------------------------------------

# Phase 1 --- Project Foundation

## Goal

Create a clean Next.js frontend project and basic architecture.

## Frontend

-   Next.js 16
-   TypeScript
-   App Router
-   Tailwind CSS
-   ESLint
-   Vitest
-   React Testing Library

## Project Structure

``` text
quran-quiz-web/
├── app/
│   ├── page.tsx
│   ├── quiz/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── quiz/
│   └── ui/
├── lib/
│   └── quiz/
├── types/
└── tests/
```

## Implementation

1.  Create Next.js project.
2.  Configure TypeScript.
3.  Configure Tailwind CSS.
4.  Configure Vitest.
5.  Configure React Testing Library.
6.  Create the application layout.
7.  Define shared quiz types.

## Testing

-   Home page renders.
-   TypeScript passes.
-   ESLint passes.
-   Production build passes.
-   Test runner executes successfully.

## Verification

-   [ ] `npm run dev`
-   [ ] `npm run build`
-   [ ] `npm run lint`
-   [ ] `npm test`

------------------------------------------------------------------------

# Phase 2 --- Quran Text Input

## Goal

Allow users to paste Arabic Quran text without modifying it.

## Features

-   RTL textarea
-   Multiline support
-   Preserve line breaks
-   Preserve Arabic diacritics
-   Preserve Quran symbols
-   Character counter
-   Clear button
-   Empty input validation

## Testing

-   Arabic text renders RTL
-   Diacritics remain unchanged
-   Newlines remain unchanged
-   Empty input validation
-   Multiple lines supported
-   Paste functionality
-   Clear button

------------------------------------------------------------------------

# Phase 3 --- Quiz Method Selection

## Goal

Allow users to choose the quiz generation mode.

## Options

-   Hide Words
-   Hide Lines

## Testing

-   Hide Words selection
-   Hide Lines selection
-   Only one option selected
-   Correct value returned
-   Keyboard accessibility

------------------------------------------------------------------------

# Phase 4 --- Hide Count Selection

## Goal

Allow users to choose how many words or lines to hide.

## Features

-   Increment / Decrement
-   Dynamic maximum based on content
-   Minimum value = 1

## Testing

-   Increment
-   Decrement
-   Minimum validation
-   Maximum validation
-   Updates when quiz mode changes

------------------------------------------------------------------------

# Phase 5 --- Hide Word Engine

## Goal

Generate quizzes by hiding Arabic words.

## Requirements

-   Preserve whitespace
-   Preserve formatting
-   Preserve original text
-   Track answers by position

## Testing

-   Single word hidden
-   Multiple words hidden
-   Original text unchanged
-   Diacritics preserved
-   Whitespace preserved
-   Newlines preserved
-   Correct answers stored
-   Duplicate words handled
-   Arabic punctuation supported

------------------------------------------------------------------------

# Phase 6 --- Hide Line Engine

## Goal

Generate quizzes by hiding complete lines.

## Rules

-   Use newline characters only
-   Ignore empty lines
-   Preserve formatting

## Testing

-   Single line hidden
-   Multiple lines hidden
-   Original line stored
-   Empty lines ignored
-   Windows and Unix newlines supported
-   Original text unchanged

------------------------------------------------------------------------

# Phase 7 --- Unified Quiz Generator

## Goal

Provide a single interface for quiz generation.

## Flow

``` text
generateQuiz()
      ↓
Hide Words → hideWords()
Hide Lines → hideLines()
```

## Testing

-   Correct generator called
-   Correct quiz method returned
-   Invalid hide count handled
-   Original text preserved

------------------------------------------------------------------------

# Phase 8 --- Quiz Creation Screen

## Goal

Connect all UI components.

## Components

-   Quran Text Input
-   Quiz Method Selector
-   Hide Count Selector
-   Generate Button

## Validation

-   Empty text
-   Invalid hide count
-   Not enough words
-   Not enough lines

## Testing

-   Complete creation flow
-   Validation messages
-   Button state

------------------------------------------------------------------------

# Phase 9 --- Quiz Display

## Goal

Display generated quizzes correctly.

## Requirements

-   RTL
-   Preserve line breaks
-   Responsive layout
-   Large Arabic typography

## Testing

-   RTL rendering
-   Hidden words
-   Hidden lines
-   Responsive layouts

------------------------------------------------------------------------

# Phase 10 --- Reveal Answers

## Goal

Reveal hidden content.

## Features

-   Reveal Answers
-   Hide Answers

## Testing

-   Reveal works
-   Hide works
-   Multiple answers
-   Word mode
-   Line mode

------------------------------------------------------------------------

# Phase 11 --- Generate Again

## Goal

Generate another quiz using the same configuration.

## Testing

-   Configuration preserved
-   Text preserved
-   New valid hidden positions
-   Previous reveal state reset

------------------------------------------------------------------------

# Phase 12 --- User Experience Improvements

## Features

-   Start Over
-   Copy Text
-   Better error states
-   Loading state
-   Empty state
-   Responsive layout
-   Accessibility
-   Dark / Light mode

## Testing

-   Desktop
-   Tablet
-   Mobile
-   Keyboard navigation
-   Focus states
-   Long passages
-   Short passages

------------------------------------------------------------------------

# Phase 13 --- Local Persistence

## Goal

Save progress locally.

## Storage

-   localStorage

## Persist

-   Quran text
-   Quiz method
-   Hide count

## Testing

-   Refresh restores state
-   Clear removes state
-   Invalid storage handled safely

------------------------------------------------------------------------

# Phase 14 --- Unit Testing

## Focus

Quiz engine and reusable components.

### Test Files

``` text
tests/
├── quiz/
│   ├── hide-words.test.ts
│   ├── hide-lines.test.ts
│   ├── generate-quiz.test.ts
│   └── arabic-text.test.ts
└── components/
```

## Coverage

-   Arabic text
-   Diacritics
-   Duplicate words
-   Large passages
-   Empty lines
-   Different newline formats

------------------------------------------------------------------------

# Phase 15 --- Integration Testing

## Complete User Flow

``` text
Paste Quran Text
        ↓
Choose Method
        ↓
Choose Hide Count
        ↓
Generate Quiz
        ↓
Reveal Answers
```

## Testing

-   Hide Words flow
-   Hide Lines flow
-   Generate Again
-   Refresh
-   Validation

------------------------------------------------------------------------

# Phase 16 --- Playwright E2E

## Tests

-   Home page
-   Hide Words
-   Hide Lines
-   Reveal Answers
-   Generate Again
-   Validation
-   Responsive layouts
-   Persistence

------------------------------------------------------------------------

# Phase 17 --- Final Quality Verification

## Run

``` bash
npm run lint
npm test
npm run build
npx playwright test
```

## Final Checklist

-   [ ] Quran text never modified
-   [ ] Diacritics preserved
-   [ ] Hide Words works
-   [ ] Hide Lines works
-   [ ] Reveal Answers works
-   [ ] Generate Again works
-   [ ] RTL verified
-   [ ] Responsive UI
-   [ ] Unit tests pass
-   [ ] Integration tests pass
-   [ ] Playwright passes
-   [ ] TypeScript passes
-   [ ] ESLint passes
-   [ ] Production build passes

------------------------------------------------------------------------

# Development Roadmap

``` text
Phase 1  → Foundation
Phase 2  → Quran Input
Phase 3  → Quiz Method
Phase 4  → Hide Count
Phase 5  → Hide Word Engine
Phase 6  → Hide Line Engine
Phase 7  → Unified Generator
Phase 8  → Creation Screen
Phase 9  → Quiz Display
Phase 10 → Reveal Answers
Phase 11 → Generate Again
Phase 12 → UX Improvements
Phase 13 → Local Persistence
Phase 14 → Unit Testing
Phase 15 → Integration Testing
Phase 16 → Playwright E2E
Phase 17 → Final Verification
```
