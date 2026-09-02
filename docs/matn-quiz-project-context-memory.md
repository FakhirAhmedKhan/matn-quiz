# Matn Quiz — Project Context Memory

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

### Phase 1 — Foundation

Created base Next.js project structure, shared UI foundation, tests, and verification setup.

### Phase 2 — Quran / Matn Text Input

Added Arabic input textarea, stats, validation, clear action, and homepage connection.

Important files:

- `components/quiz/QuranTextInput.tsx`
- `lib/utils/arabic.ts`
- `lib/quiz/validation.ts`

### Phase 3 — Quiz Method Selection

Added quiz method types and selector.

Methods:

- `HIDE_WORD`
- `HIDE_LINE`

Important files:

- `lib/constants/quiz.ts`
- `components/quiz/QuizMethodSelector.tsx`

### Phase 4 — Hide Count Selection

Added hide count rules, min/max helpers, and counter UI.

Important files:

- `lib/quiz/hide-count.ts`
- `components/quiz/HideCountSelector.tsx`

### Phase 5 — Hide Word Quiz Engine

Added word tokenizer, deterministic word selection, and hide-word quiz generation.

Important files:

- `lib/quiz/word-tokenizer.ts`
- `lib/quiz/word-selection.ts`
- `lib/quiz/hide-word-engine.ts`

Known important fix:

- Arabic harakat / diacritics should not remain visible beside placeholders.
- `preserveEdgePunctuation()` must treat Arabic letters and diacritics as word core characters.

### Phase 6 — Hide Line Quiz Engine

Added line tokenizer, line selection, and hide-line quiz generation.

Important files:

- `lib/quiz/line-tokenizer.ts`
- `lib/quiz/line-selection.ts`
- `lib/quiz/hide-line-engine.ts`

### Phase 7 — Unified Quiz Generator

Added a single generator dispatcher for `HIDE_WORD` and `HIDE_LINE`.

Important files:

- `lib/quiz/unified-quiz.ts`
- `lib/quiz/generate-quiz.ts`

### Phase 8 — Quiz Display and Study UX

Added study mode, answer reveal controls, copy/reset/export actions.

Important files:

- `lib/quiz/study-session.ts`
- `components/quiz/AnswerRevealControls.tsx`
- `components/quiz/GeneratedQuizPreview.tsx`
- `components/quiz/QuizActionBar.tsx`
- `lib/quiz/quiz-export.ts`

### Phase 9 — Responsive and UX Polish

Added design tokens, responsive layout polish, Arabic reading polish, accessibility and micro-interaction improvements.

Important files:

- `lib/ui/design-system.ts`
- `components/layout/AppResponsiveLayout.tsx`
- `lib/quiz/arabic-reading.ts`
- `components/quiz/ArabicReadingPanel.tsx`

### Phase 10 — Local History Persistence

Added saved quiz history using browser localStorage.

Important files:

- `lib/quiz/quiz-history.ts`
- `lib/quiz/quiz-history-repository.ts`
- `components/quiz/SavedQuizHistory.tsx`

LocalStorage key:

```ts
matn-quiz:history:v1
```

### Phase 11 — Shareable Quiz JSON Import / Export

Added shareable JSON model, export, copy, import validation, and UI.

Important files:

- `lib/quiz/shareable-quiz.ts`
- `lib/quiz/shareable-quiz-export.ts`
- `lib/quiz/shareable-quiz-import.ts`
- `components/quiz/ShareableQuizPanel.tsx`

### Phase 12 — Review Mode and Scoring

Added correct / incorrect answer review mode and progress summary.

Important files:

- `lib/quiz/review-session.ts`
- `components/quiz/ReviewAnswerControls.tsx`
- `components/quiz/ReviewProgressSummary.tsx`

### Phase 13 — Study Session Persistence

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

### Phase 14 — Mobile UX and Accessibility Polish

Added mobile UX tokens, responsive layout components, feedback states, and accessibility helpers.

Important files:

- `lib/ui/mobile-ux.ts`
- `components/layout/AppResponsiveLayout.tsx`
- `lib/ui/feedback-state.ts`
- `components/ui/FeedbackStatePanel.tsx`
- `components/ui/AccessibleSkipLink.tsx`
- `lib/ui/accessibility-final-pass.ts`

### Phase 15 — Final Release Hardening

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

### Phase 16 — Deployment Automation and Hosting Readiness

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

### Phase 17 — Observability, Monitoring, and Performance Budget Readiness

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
  - update the study session resume expectation from `1 of 2 reviewed · 50% accuracy` to `1 of 1 reviewed · 100% accuracy`
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

### Phase 18 — Real Deployment and Public Launch

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
2. study-session-resume-flow expected "1 of 2 reviewed · 50% accuracy", but current app shows "1 of 1 reviewed · 100% accuracy".

After fixing, run:
pnpm test
pnpm run build
pnpm run lint
pnpm run verify:phase17

Continue from here and help me finish Phase 17, then start Phase 18 deployment/public launch.
```
