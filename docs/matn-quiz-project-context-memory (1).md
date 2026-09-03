# Matn Quiz â€” Project Context Memory

Use this document as the handoff context for a new ChatGPT chat or another AI model.

---

## 1. Project Identity

**Project name:** Matn Quiz  
**Local folder:** `C:\Users\Dell\OneDrive\Desktop\Programs\matn-quiz`  
**Project type:** Frontend-only Quran / Islamic matn quiz generator  
**Primary user flow:** Paste Arabic Quran or matn text, generate a quiz by hiding words or lines, study the quiz, reveal answers, review answers, save history, import/export JSON, and resume unfinished sessions.

The project is web-first. Mobile app can come later.

---

## 2. Tech Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **UI:** React + Tailwind CSS
- **Testing:** Vitest + React Testing Library
- **Package manager:** pnpm
- **Storage:** Browser `localStorage`
- **Backend:** None for current version
- **Deployment target:** Frontend-only Next.js hosting, recommended Vercel

---

## 3. Core Product Scope

Matn Quiz helps users create study quizzes from Arabic Quran or Islamic matn text.

Main features:

- Paste Arabic text
- Validate Quran / matn input
- Select quiz generation method
- Hide selected words
- Hide selected full lines
- Choose hide count
- Generate quiz preview
- Study quiz with hidden answers
- Reveal individual answers
- Reveal all / hide all answers
- Reset study state
- Copy generated quiz
- Copy answers
- Export TXT
- Review answers as correct / incorrect
- Track review progress and accuracy
- Save quiz history locally
- Reopen saved quizzes
- Delete saved quizzes
- Clear full quiz history
- Export shareable JSON
- Copy shareable JSON
- Import quiz JSON
- Validate imported quiz JSON
- Resume unfinished study sessions
- Clear saved study sessions
- Mobile-first responsive layout
- Empty / loading / error state polish
- Accessibility improvements
- Release hardening
- Deployment readiness
- Monitoring / performance budget readiness

---

## 4. Important User Workflow Preference

The user prefers:

- Full PowerShell commands
- One complete copy-paste block per phase
- Windows PowerShell compatible scripts
- Commands that run from the project root
- No half snippets
- No unclosed here-strings
- Keep terminal open using `Read-Host` when debugging
- Use `pnpm` when `pnpm-lock.yaml` exists
- Save logs to `.txt` files when troubleshooting

Avoid giving Linux-only commands unless specifically requested.

---

## 5. Completed Phase Summary

### Phase 1 â€” Foundation

Created base Next.js project structure, shared UI foundation, tests, and verification setup.

### Phase 2 â€” Quran / Matn Text Input

Added Arabic input textarea, stats, validation, clear action, and homepage connection.

Important files:

- `components/quiz/QuranTextInput.tsx`
- `lib/utils/arabic.ts`
- `lib/quiz/validation.ts`

### Phase 3 â€” Quiz Method Selection

Added quiz method types and selector.

Methods:

- `HIDE_WORD`
- `HIDE_LINE`

Important files:

- `lib/constants/quiz.ts`
- `components/quiz/QuizMethodSelector.tsx`

### Phase 4 â€” Hide Count Selection

Added hide count rules, min/max helpers, and counter UI.

Important files:

- `lib/quiz/hide-count.ts`
- `components/quiz/HideCountSelector.tsx`

### Phase 5 â€” Hide Word Quiz Engine

Added word tokenizer, deterministic word selection, and hide-word quiz generation.

Important files:

- `lib/quiz/word-tokenizer.ts`
- `lib/quiz/word-selection.ts`
- `lib/quiz/hide-word-engine.ts`

Known important fix:

- Arabic harakat / diacritics should not remain visible beside placeholders.
- `preserveEdgePunctuation()` must treat Arabic letters and diacritics as word core characters.

### Phase 6 â€” Hide Line Quiz Engine

Added line tokenizer, line selection, and hide-line quiz generation.

Important files:

- `lib/quiz/line-tokenizer.ts`
- `lib/quiz/line-selection.ts`
- `lib/quiz/hide-line-engine.ts`

### Phase 7 â€” Unified Quiz Generator

Added a single generator dispatcher for `HIDE_WORD` and `HIDE_LINE`.

Important files:

- `lib/quiz/unified-quiz.ts`
- `lib/quiz/generate-quiz.ts`

### Phase 8 â€” Quiz Display and Study UX

Added study mode, answer reveal controls, copy/reset/export actions.

Important files:

- `lib/quiz/study-session.ts`
- `components/quiz/AnswerRevealControls.tsx`
- `components/quiz/GeneratedQuizPreview.tsx`
- `components/quiz/QuizActionBar.tsx`
- `lib/quiz/quiz-export.ts`

### Phase 9 â€” Responsive and UX Polish

Added design tokens, responsive layout polish, Arabic reading polish, accessibility and micro-interaction improvements.

Important files:

- `lib/ui/design-system.ts`
- `components/layout/AppResponsiveLayout.tsx`
- `lib/quiz/arabic-reading.ts`
- `components/quiz/ArabicReadingPanel.tsx`

### Phase 10 â€” Local History Persistence

Added saved quiz history using browser localStorage.

Important files:

- `lib/quiz/quiz-history.ts`
- `lib/quiz/quiz-history-repository.ts`
- `components/quiz/SavedQuizHistory.tsx`

LocalStorage key:

```ts
matn-quiz:history:v1
```

### Phase 11 â€” Shareable Quiz JSON Import / Export

Added shareable JSON model, export, copy, import validation, and UI.

Important files:

- `lib/quiz/shareable-quiz.ts`
- `lib/quiz/shareable-quiz-export.ts`
- `lib/quiz/shareable-quiz-import.ts`
- `components/quiz/ShareableQuizPanel.tsx`

### Phase 12 â€” Review Mode and Scoring

Added correct / incorrect answer review mode and progress summary.

Important files:

- `lib/quiz/review-session.ts`
- `components/quiz/ReviewAnswerControls.tsx`
- `components/quiz/ReviewProgressSummary.tsx`

### Phase 13 â€” Study Session Persistence

Added unfinished study session persistence and resume flow.

Important files:

- `lib/quiz/study-session-persistence.ts`
- `lib/quiz/study-session-repository.ts`
- `components/quiz/StudySessionResumePanel.tsx`
- `components/quiz/GeneratedQuizPreview.tsx`

LocalStorage key:

```ts
matn-quiz:study-session:v1
```

### Phase 14 â€” Mobile UX and Accessibility Polish

Added mobile UX tokens, responsive layout components, feedback states, and accessibility helpers.

Important files:

- `lib/ui/mobile-ux.ts`
- `components/layout/AppResponsiveLayout.tsx`
- `lib/ui/feedback-state.ts`
- `components/ui/FeedbackStatePanel.tsx`
- `components/ui/AccessibleSkipLink.tsx`
- `lib/ui/accessibility-final-pass.ts`

### Phase 15 â€” Final Release Hardening

Added production metadata, PWA basics, release pages, documentation, and smoke checks.

Important files:

- `lib/release/product-metadata.ts`
- `lib/release/release-readiness.ts`
- `app/layout.tsx`
- `app/manifest.ts`
- `app/robots.ts`
- `app/sitemap.ts`
- `app/not-found.tsx`
- `app/error.tsx`
- `public/icon.svg`
- `public/apple-icon.svg`
- `public/maskable-icon.svg`
- `README.md`
- `RELEASE-CHECKLIST.md`
- `scripts/production-smoke.cjs`

### Phase 16 â€” Deployment Automation and Hosting Readiness

Added deployment config, docs, CI workflow, smoke script, and deployment report.

Important files:

- `lib/deploy/deployment-config.ts`
- `lib/deploy/deployment-report.ts`
- `.env.example`
- `.github/workflows/ci.yml`
- `DEPLOYMENT.md`
- `DEPLOYMENT-CHECKLIST.md`
- `DEPLOYMENT-REPORT.md`
- `scripts/deployment-smoke.cjs`
- `scripts/deployment-report.cjs`
- `scripts/verify-phase-16.cjs`

### Phase 17 â€” Observability, Monitoring, and Performance Budget Readiness

Added client observability model, performance budget utilities, monitoring docs, monitoring report script, and Phase 17 verification.

Important files:

- `lib/monitoring/client-observability.ts`
- `lib/monitoring/performance-budget.ts`
- `OBSERVABILITY.md`
- `MONITORING-CHECKLIST.md`
- `MONITORING-REPORT.md`
- `scripts/monitoring-report.cjs`
- `scripts/performance-budget-check.cjs`
- `scripts/verify-phase-17.cjs`

---

## 6. Core Types

Important quiz types exist in `types/quiz.ts`.

Main concepts:

```ts
export type QuizMethod = "HIDE_WORD" | "HIDE_LINE";

export interface GeneratedQuizAnswer {
  index: number;
  tokenIndex: number;
  answer: string;
  kind: "word" | "line";
}

export interface GeneratedQuiz {
  originalText: string;
  quizText: string;
  method: QuizMethod;
  requestedCount: number;
  hiddenCount: number;
  answers: GeneratedQuizAnswer[];
  selectedTokenIndexes: number[];
}
```

There are more specific types for word and line quizzes.

---

## 7. Current Known Status

The project reached Phase 17, but the latest visible verification was still being repaired.

Recent status:

- Most tests pass.
- The latest full test run showed only two failing tests:
  - `tests/integration/accessibility-study-flow.test.tsx`
  - `tests/integration/study-session-resume-flow.test.tsx`
- Fixes were provided to:
  - replace all old `screen.getByRole("progressbar")` queries with `screen.getByTestId("study-progress-bar")`
  - update the study session resume expectation from `1 of 2 reviewed Â· 50% accuracy` to `1 of 1 reviewed Â· 100% accuracy`
- The final pass after those two fixes has not yet been confirmed in this conversation.

Recommended verification after opening the project:

```powershell
pnpm test
pnpm run build
pnpm run lint
pnpm run verify:phase17
```

---

## 8. Known Troubleshooting Notes

### PowerShell Here-string Issue

A previous Phase 17 command got stuck because the README append block used an unclosed here-string. Avoid very long PowerShell commands with unclosed `@' ... '@` blocks.

### Terminal Auto-close Issue

The terminal appeared to auto-close because commands used `exit` after failure. For debugging, use:

```powershell
$ErrorActionPreference = "Continue"
Start-Transcript -Path "LOG.txt" -Force
# commands...
Stop-Transcript
Read-Host "Press Enter to close"
```

### Multiple Textareas

Since Phase 11 added JSON import textarea, older tests using:

```ts
screen.getByRole("textbox")
```

may fail. Prefer:

```ts
screen.getAllByRole("textbox")[0]!
```

for the main Arabic input.

### Multiple Progressbars

Study mode now has two progressbars:

- `study-progress-bar`
- `review-progress-bar`

Avoid:

```ts
screen.getByRole("progressbar")
```

Use:

```ts
screen.getByTestId("study-progress-bar")
```

or:

```ts
screen.getByTestId("review-progress-bar")
```

### Clipboard Tests

`navigator.clipboard.writeText` may not be a Vitest spy. Either define it with `vi.fn()` or avoid spy-only assertions and assert UI status text instead.

### Shareable Quiz Export Typing

`ExportShareableQuizFileOptions` should allow `title?: string`; tests sometimes call export helpers with only `exportedAt`.

### FeedbackStatePanel Typing

Preset components like `EmptyStatePanel`, `LoadingStatePanel`, and `ErrorStatePanel` should use:

```ts
type PresetFeedbackStatePanelProps = Omit<FeedbackStatePanelProps, "kind">;
```

And render like:

```tsx
<FeedbackStatePanel {...props} kind="empty" />
```

Do not render like:

```tsx
<FeedbackStatePanel kind="empty" {...props} />
```

because TypeScript may warn that `kind` is specified more than once.

---

## 9. Important Package Scripts

Expected scripts in `package.json`:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "lint": "eslint",
  "build": "next build",
  "smoke:production": "node scripts/production-smoke.cjs",
  "smoke:deployment": "node scripts/deployment-smoke.cjs",
  "deployment:report": "node scripts/deployment-report.cjs",
  "monitoring:report": "node scripts/monitoring-report.cjs",
  "monitoring:budget": "node scripts/performance-budget-check.cjs",
  "verify:phase16": "node scripts/verify-phase-16.cjs",
  "verify:phase17": "node scripts/verify-phase-17.cjs"
}
```

---

## 10. Suggested Next Phase

### Phase 18 â€” Real Deployment and Public Launch

Goal:

Prepare and deploy the project publicly.

Suggested work:

- Final full verification
- Clean old phase drift tests
- Set production domain
- Configure `NEXT_PUBLIC_SITE_URL`
- Deploy to Vercel
- Check production routes:
  - `/`
  - `/manifest.webmanifest` or `/manifest.json` depending on Next route output
  - `/robots.txt`
  - `/sitemap.xml`
- Manual mobile QA
- Manual keyboard QA
- Create launch README section
- Create LinkedIn launch post
- Create demo GIF/video script

---

## 11. Prompt for New Chat

Copy this into a new chat:

```text
You are helping me continue my Matn Quiz project.

Project path:
C:\Users\Dell\OneDrive\Desktop\Programs\matn-quiz

It is a frontend-only Next.js + TypeScript + Tailwind + Vitest app for Quran / Islamic matn quizzes.

Main flow:
User pastes Arabic Quran or matn text, selects Hide Words or Hide Lines, selects hide count, generates quiz, studies with reveal answers, reviews answers as correct or incorrect, saves history, imports/exports shareable JSON, and resumes unfinished study sessions.

Use Windows PowerShell commands only. Give me one full copy-paste command at a time. Use pnpm because pnpm-lock.yaml exists. Keep commands safe for VS Code terminal and avoid unclosed here-strings.

Current phase:
Phase 17 observability / monitoring / performance budget readiness is being finalized.

Current likely status:
Most tests are passing. Last known issues were two test drifts:
1. accessibility-study-flow should use screen.getByTestId("study-progress-bar") instead of screen.getByRole("progressbar") because there are now study and review progressbars.
2. study-session-resume-flow expected "1 of 2 reviewed Â· 50% accuracy", but current app shows "1 of 1 reviewed Â· 100% accuracy".

After fixing, run:
pnpm test
pnpm run build
pnpm run lint
pnpm run verify:phase17

Continue from here and help me finish Phase 17, then start Phase 18 deployment/public launch.
```

<!-- MATN-QUIZ-PHASE-17-TO-END-START -->

# Matn Quiz Project Memory Context — Phase 17 to Current End

Updated: 2026-09-03

## Project

Matn Quiz is a frontend-first Quran and Islamic matn memorization quiz app.

Current root:

C:\Users\Dell\OneDrive\Desktop\Programs\matn-quiz

Current stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vitest
- React Testing Library
- Browser/local-first storage
- Provider-based Arabic audio through /api/tts

Core product flow:

1. User pastes Arabic Quran or matn text.
2. User chooses quiz method:
   - Hide Words
   - Hide Lines
3. User chooses hide count.
4. App generates quiz.
5. User studies by revealing answers.
6. User reviews answers as correct or incorrect.
7. User can save quiz history.
8. User can reopen saved quizzes.
9. User can import/export shareable JSON.
10. User can resume unfinished study sessions.
11. User can play Arabic audio for visible text only.

Important rule:

Hidden answers must never be sent to audio provider, copied accidentally, or spoken.

---

## Phase 17 — Observability and Monitoring Readiness

Goal:

Prepare Matn Quiz for production-quality monitoring and reliability checks.

Implemented/verified areas:

- Client observability utilities
- Monitoring readiness tests
- Performance budget tests
- Deployment report utilities
- Deployment config tests
- Phase 17 completion tests

Important files/tests:

- tests/unit/monitoring/client-observability.test.ts
- tests/unit/monitoring/performance-budget.test.ts
- tests/unit/monitoring/phase-17-complete.test.ts
- tests/unit/deploy/deployment-report.test.ts
- tests/unit/deploy/deployment-config.test.ts

Status:

Phase 17 tests are passing in the current test suite.

---

## Phase 18 — Arabic Text-to-Speech Safety

Goal:

Add Arabic audio support while protecting hidden answers.

Initial approach:

Browser SpeechSynthesis API.

Problem found:

Chrome on Windows had no Arabic voices installed.

Confirmed browser voice check:

speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith("ar"))

Result:

Empty array.

Meaning:

The app triggered speech correctly, but Chrome had no Arabic voice available. Browser TTS was not reliable for Arabic.

Key safety implementation:

- Safe text builder only speaks visible Arabic text.
- Hidden words are removed.
- Hidden lines are blocked.
- Placeholder blanks such as ____ are never spoken.
- TTS tests prove hidden answers do not leak.

Important files/tests:

- lib/quiz/tts-safe-text.ts
- hooks/useArabicTts.ts
- components/quiz/ArabicTtsControls.tsx
- components/quiz/QuizTtsPanel.tsx
- tests/unit/quiz/tts-safe-text.test.ts
- tests/unit/quiz/phase-18-complete.test.ts
- tests/unit/components/ArabicTtsControls.test.tsx
- tests/unit/components/QuizTtsPanel.test.tsx
- tests/integration/tts-hidden-text-safety-flow.test.tsx

Status:

Phase 18 safety logic remains valid, but browser-only audio was replaced in Phase 20.

---

## Phase 19 — Page Architecture Refactor

Goal:

Refactor the home page into a cleaner single-route architecture without breaking the main workflow.

Route decision:

The app still uses one main route:

app/page.tsx

Architecture:

app/page.tsx calls usePage() and passes the returned state/actions into page section components.

Important section components:

- components/page/home/HomePageView.tsx
- components/page/home/HomeHeroSection.tsx
- components/page/home/QuranTextSection.tsx
- components/page/home/QuizOptionsSection.tsx
- components/page/home/QuizSetupSummarySection.tsx
- components/page/home/GeneratedQuizSection.tsx
- components/page/home/ResumeStudySection.tsx
- components/page/home/ShareableQuizSection.tsx
- components/page/home/SavedHistorySection.tsx
- components/page/home/HistoryStatusSection.tsx
- components/page/home/types.ts
- components/page/home/index.ts

Important Phase 19 fixes:

1. Direct imports were preferred over dynamic imports to avoid stale dynamic chunk issues.
2. Multiple textbox test failure was fixed by using findAllByRole/getAllByRole where needed.
3. Missing history-status rendering was fixed with HistoryStatusSection.
4. Missing app hero eyebrow was identified later and fixed by adding:
   - data-testid="app-hero-eyebrow"
   - text: Phase 19.5

Important tests:

- tests/unit/pages/HomePageArchitecture.test.ts
- tests/unit/pages/HomePageSections.test.tsx
- tests/unit/pages/HomePageHistoryFlow.test.tsx
- tests/unit/pages/HomePageMobileLayout.test.tsx
- tests/unit/layout/AppResponsiveLayout.test.tsx
- tests/unit/pages/HomePageDeploymentReadiness.test.tsx

Status before final hero eyebrow fix:

- 96 test files passed
- 783 tests passed
- 4 tests failed
- Root cause: missing data-testid="app-hero-eyebrow"

The failed tests were not related to TTS.

---

## Phase 19.5 — Mobile Polish and Hero Label

Goal:

Keep the UI mobile-first and ensure layout tests confirm the polished hero section.

Required hero label:

Phase 19.5

Required test id:

app-hero-eyebrow

Expected hero structure:

- data-testid="app-hero"
- data-testid="app-hero-title"
- data-testid="app-hero-description"
- data-testid="app-hero-eyebrow"
- data-testid="hero-main-content-anchor"

Current design direction:

- Mobile-first
- Soft emerald and slate palette
- Rounded cards
- Safe-area support
- Accessible skip link
- Focusable main content container
- RTL Arabic reading support

---

## Phase 20 — Reliable Arabic Audio Provider

Goal:

Replace unreliable browser-only Arabic TTS with provider/server-based audio.

Why:

The user's Chrome browser had no Arabic voices:

speechSynthesis Arabic voices = []

Browser displayed speaker activity, but produced no Arabic audio.

Attempted providers:

1. Azure Speech
   - Good Arabic support
   - User did not want Azure

2. ElevenLabs
   - Arabic capable
   - API returned 402 payment/credits required
   - User did not want paid/credit-blocked setup

Final Phase 20 provider:

Google Translate TTS demo provider through backend route.

Important note:

This is a no-key demo/local provider, not ideal for production terms or guaranteed long-term reliability.

Current route:

app/api/tts/route.ts

Current provider file:

lib/tts/google-translate-tts.ts

Current audio flow:

1. UI builds safe visible text only.
2. Frontend calls POST /api/tts.
3. Server calls Google Translate TTS demo endpoint.
4. Server returns audio/mpeg.
5. Frontend plays returned audio blob through Audio object.

No required env key.

Optional env values:

GOOGLE_TRANSLATE_TTS_LANG=ar
GOOGLE_TRANSLATE_TTS_CLIENT=tw-ob
GOOGLE_TRANSLATE_TTS_MAX_CHUNK=180
GOOGLE_TRANSLATE_TTS_ENDPOINT=https://translate.google.com/translate_tts

Important files/tests:

- lib/tts/google-translate-tts.ts
- app/api/tts/route.ts
- hooks/useArabicTts.ts
- components/quiz/ArabicTtsControls.tsx
- components/quiz/QuizTtsPanel.tsx
- tests/unit/tts/google-translate-tts.test.ts
- tests/unit/api/tts-route.test.ts
- tests/unit/components/ArabicTtsControls.test.tsx
- tests/unit/components/QuizTtsPanel.test.tsx
- tests/integration/tts-hidden-text-safety-flow.test.tsx
- tests/unit/tts/phase-20-complete.test.ts

Phase 20 status:

TTS tests are passing.

Known production recommendation:

For real production, replace Google Translate demo endpoint with a stable official provider such as:

- Azure Speech
- Google Cloud Text-to-Speech
- ElevenLabs with credits
- Any stable Arabic TTS API with official terms

---

## Current Test Status Snapshot

Latest full pnpm test result seen:

- 100 test files total
- 96 passed
- 4 failed
- 787 tests total
- 783 passed
- 4 failed

Remaining failures:

All failures were caused by missing:

data-testid="app-hero-eyebrow"

Affected tests:

- tests/unit/layout/AppResponsiveLayout.test.tsx
- tests/unit/pages/HomePageDeploymentReadiness.test.tsx
- tests/unit/pages/HomePageMobileLayout.test.tsx
- tests/unit/pages/HomePageSections.test.tsx

Not related to Arabic TTS.

Fix required:

Add the Phase 19.5 hero eyebrow badge back into the AppHero / HomeHero section.

Expected text:

Phase 19.5

---

## UI Design Direction

A mobile UI showcase image was generated for the project.

Design style:

- Premium Islamic study app
- Mobile-first
- Calm emerald, cream, slate, and subtle gold
- RTL Arabic reading focus
- Rounded cards
- Soft shadows
- Clean quiz workflow
- Audio-ready learning experience

Main mobile screens planned:

1. Welcome / hero
2. Arabic text input
3. Quiz method selection
4. Hide count selection
5. Quiz preview / study mode
6. Arabic audio panel
7. Saved quiz history
8. Resume / import-export

---

## React Native Mobile App Plan

A detailed React Native mobile development plan was created.

Recommended direction:

- Build a separate React Native mobile app
- Use Expo / React Native
- Reuse quiz domain logic where possible
- Keep web app stable first
- Mobile app should focus on memorization workflow, offline storage, RTL Arabic reading, saved sessions, and audio

Suggested mobile architecture:

apps/mobile or separate repo initially.

Recommended mobile phases:

1. Mobile foundation
2. Design system
3. Arabic text input
4. Quiz generation
5. Study mode
6. Review mode
7. Saved history
8. Import/export
9. Resume sessions
10. Arabic audio
11. Offline polish
12. Testing
13. App store readiness

---

## Important Development Rules Going Forward

1. Do not reintroduce browser-only Arabic speech as the only audio solution.
2. Keep /api/tts as the abstraction point.
3. Never send hidden answers to /api/tts.
4. Never send originalText directly to the TTS provider.
5. Keep app/page.tsx as the single route.
6. Keep page sections inside components/page/home.
7. Prefer direct imports unless dynamic import is intentionally needed.
8. Preserve RTL Arabic layout and large readable Arabic text.
9. Keep tests aligned with provider audio:
   - expect fetch("/api/tts")
   - expect Audio.play()
   - do not expect speechSynthesis.speak()
10. Keep Phase 19.5 hero eyebrow because multiple layout tests expect it.

---

## Useful Commands

Run full tests:

pnpm test

Run Phase 20 focused tests:

pnpm test tests/unit/tts/google-translate-tts.test.ts tests/unit/api/tts-route.test.ts tests/unit/components/ArabicTtsControls.test.tsx tests/unit/components/QuizTtsPanel.test.tsx tests/integration/tts-hidden-text-safety-flow.test.tsx tests/unit/tts/phase-20-complete.test.ts

Run build:

pnpm run build

Run lint:

pnpm run lint

Start dev server:

pnpm dev

<!-- MATN-QUIZ-PHASE-17-TO-END-END -->

