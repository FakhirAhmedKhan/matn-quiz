# Matn Quiz — Project Context Memory

Updated: 2026-09-04

Use this file as the primary handoff context for a new ChatGPT chat or another AI model.

---

## 1. Project Identity

**Project name:** Matn Quiz  
**Local path:** `C:\Users\Dell\OneDrive\Desktop\Programs\matn-quiz`  
**GitHub:** `https://github.com/FakhirAhmedKhan/matn-quiz.git`  
**Working branch:** `Mono-Repo`

Matn Quiz is a **web-first Quran / Islamic matn memorization app**.

The project is no longer accurately described as “frontend-only”. It is a Next.js application with browser-side state plus server-side API routes such as Arabic TTS and Book Library APIs. There is currently **no separate NestJS backend and no production database**.

Current monorepo shape:

```text
matn-quiz/
  apps/
    web/        # Next.js web app
    mobile/     # Expo / React Native app paused for now
  packages/
  docs/
  package.json
  pnpm-workspace.yaml
  pnpm-lock.yaml
```

---

## 2. Current Tech Stack

### Web

- Next.js 16.x App Router
- React 19
- TypeScript
- Tailwind CSS
- Vitest
- React Testing Library
- jsdom
- pnpm workspaces

### Storage

The application is browser/local-first.

Current persistence includes:

- `localStorage` for quiz history
- `localStorage` for unfinished study sessions
- `localStorage` for Poem drafts
- `sessionStorage` for the split Create wizard workflow
- Local filesystem demo storage for uploaded Book Library files during local development

### Server-side functionality

Next.js API routes currently provide server-side functionality including:

- `/api/tts`
- `/api/books`
- `/api/books/[bookId]`

There is currently no Prisma/database layer in Matn Quiz.

---

## 3. Main Product Features

Matn Quiz currently supports:

- Paste Arabic Quran or matn text
- Arabic input validation
- Hide Words quiz generation
- Hide Lines quiz generation
- Hide-count selection
- Generated quiz preview
- Study mode
- Reveal individual answers
- Reveal all / hide all
- Reset study state
- Copy quiz / copy answers
- TXT export
- Review correct / incorrect answers
- Review progress and accuracy
- Save quiz history locally
- Reopen saved quizzes
- Delete saved quizzes
- Clear saved quiz history
- Shareable quiz JSON export
- Shareable quiz JSON import and validation
- Resume unfinished study sessions
- Arabic TTS for visible content
- Poem input / reader workflow
- Book Library upload / verification / reading workflow
- Responsive desktop/mobile navigation
- Accessibility and release-hardening work

---

## 4. Current Route Architecture

The old “single route only” architecture is obsolete.

Current important routes:

```text
/
 /create
 /create/method
 /create/count
 /study
 /history
 /import-export
 /poem
 /poem/read
 /books
 /books/upload
 /books/[bookId]
 /books/[bookId]/read
```

The top-level workflow is now intentionally split across multiple pages.

---

## 5. Current Navigation

Primary navigation currently contains:

- Home
- Create
- Study
- Poem
- Books
- History

Import / Export was intentionally removed from the main navigation and homepage workflow cards, but the `/import-export` route remains available.

Correct navigation test IDs:

```text
top-nav-home
top-nav-create
top-nav-study
top-nav-poem
top-nav-books
top-nav-history

bottom-nav-home
bottom-nav-create
bottom-nav-study
bottom-nav-poem
bottom-nav-books
bottom-nav-history
```

A recent bug had Books incorrectly using the Poem IDs. The source config should be:

```ts
{ href: "/books", label: "Books", testId: "books" }
```

for both desktop and mobile navigation.

Mobile navigation uses six destinations.

---

## 6. Split Create Quiz Wizard

The Create flow is now:

### Step 1

Route:

```text
/create
```

Purpose:

- Paste Arabic text
- Validate content
- Continue to method selection

### Step 2

Route:

```text
/create/method
```

Purpose:

- Choose `HIDE_WORD` or `HIDE_LINE`
- See available hide-count limits
- Continue to count selection

### Step 3

Route:

```text
/create/count
```

Purpose:

- Select hide count
- Generate quiz
- Continue into Study workflow

### Important persistence fix

Originally every route called `usePage()` independently, which reset:

- Arabic text
- selected method
- hide count
- generated quiz

A workflow draft persistence layer was introduced using:

```text
matn-quiz:quiz-workflow-draft:v1
```

in `sessionStorage`.

The Create wizard must preserve:

- `quranText`
- `quizMethod`
- `hideCount`
- `generatedQuiz`

across route changes.

Independent Vitest tests should clear this sessionStorage key before each test so one test does not leak state into another.

---

## 7. Create Page UI Cleanup

The **Resume Study Session** panel is being removed from the `/create` page.

The Create page should focus only on creating a new quiz.

The underlying resume-study feature may still exist elsewhere and should not be deleted unless explicitly requested.

---

## 8. Quiz Engine

Core quiz methods:

```ts
export type QuizMethod = "HIDE_WORD" | "HIDE_LINE";
```

Important quiz concepts:

```ts
export interface GeneratedQuizAnswer {
  index: number;
  tokenIndex: number;
  answer: string;
  kind: "word" | "line";
}
```

Important engine areas include:

- Arabic validation
- hide-count rules
- word tokenization
- line tokenization
- deterministic selection
- hide-word generation
- hide-line generation
- unified quiz generation
- study session state
- review state
- export helpers

### Important HIDE_LINE indexing rule

The line generator uses newline-preserving token indexes.

Example token indexes for three lines can be:

```text
0, 2, 4
```

rather than logical indexes:

```text
0, 1, 2
```

TTS and hidden-line safety logic must respect this token-index contract.

---

## 9. Saved Quiz History

Saved quiz history remains available at:

```text
/history
```

Important files include:

- `lib/quiz/quiz-history.ts`
- `lib/quiz/quiz-history-repository.ts`
- `components/quiz/SavedQuizHistory.tsx`

History uses browser-local persistence.

Known workflow concern:

History → Study navigation previously changed routes successfully but Study could lose the selected saved quiz because each route had a fresh `usePage()` instance.

The new Create/workflow sessionStorage draft may help unify this handoff, but **History → Study data handoff still needs final browser verification before being considered fully complete**.

Do not assume the query-string version of the fix is active unless verified in source.

---

## 10. Poem Feature

Routes:

```text
/poem
/poem/read
```

Poem storage key:

```text
matn-quiz:poem-draft
```

The Poem Reader supports:

- saved draft persistence
- single/two-column reading
- spacing controls
- font-size controls
- copy
- print
- edit
- clear

Current requested Arabic placeholders:

```text
Title placeholder: أدخل العنوان
Text placeholder:  أدخل النص
```

Visible labels may remain simple, while accessible labels should continue to support tests and screen readers.

Do not break existing Poem persistence or reader behavior while changing placeholders or labels.

---

## 11. Arabic TTS

### Current architecture

Arabic audio no longer depends only on browser `speechSynthesis`.

Flow:

1. UI constructs safe visible text.
2. Frontend POSTs to `/api/tts`.
3. Next.js server route calls the configured provider.
4. Audio bytes are returned.
5. Browser plays the returned audio blob.

Current demo/local provider:

- Google Translate TTS no-key endpoint

Important files:

- `lib/quiz/tts-safe-text.ts`
- `hooks/useArabicTts.ts`
- `components/quiz/ArabicTtsControls.tsx`
- `components/quiz/QuizTtsPanel.tsx`
- `lib/tts/google-translate-tts.ts`
- `app/api/tts/route.ts`

### Critical safety rule

Hidden answers must never be sent to `/api/tts`.

#### HIDE_WORD

Keep strict hidden-answer safety.

Hidden words must never be spoken.

#### HIDE_LINE

TTS must be controlled by line visibility/index state:

```text
visible line -> audio allowed
hidden line  -> audio disabled
```

A visible line should not be disabled merely because its text happens to match text from a hidden line elsewhere.

Known remaining verification:

A browser screenshot showed a visible line incorrectly disabled while the actually hidden line was correctly blocked.

The intended HIDE_LINE logic is:

```ts
const speakableText = line.hidden ? "" : line.speakableText;
```

and the visible line must remain playable when it has non-empty visible text.

**Final browser verification of this HIDE_LINE case is still required.**

### Production warning

The Google Translate demo TTS endpoint is suitable for demo/local development but is not a production-grade guaranteed provider.

A future production version should use an official provider with stable terms.

---

## 12. Book Library

Book Library is now integrated into the web application.

Routes:

```text
/books
/books/upload
/books/[bookId]
/books/[bookId]/read
```

API routes include:

```text
POST /api/books
GET  /api/books
GET  /api/books/[bookId]
```

Current Book status model:

```text
PENDING
VERIFIED
REJECTED
```

Current architecture is intentionally demo/local:

- plain TypeScript repository abstraction
- in-memory metadata repository
- local uploaded files
- PDF validation
- verified-only public listing
- mock verification flow
- embedded reader for verified PDFs

Important production limitations:

- metadata can reset on server restart
- local uploaded files are not durable on Vercel/serverless hosting
- verification is not yet protected by production authentication/authorization
- there is no production database/object storage integration yet

Do not call the current Book Library production-safe until those are addressed.

---

## 13. Book Library Navigation / Test Drift Fixes

Books was added after earlier tests were written.

Old tests expected:

```text
Import / Export
/import-export
```

in places where the UI now intentionally uses:

```text
Books
/books
```

Recent test repair work updated stale navigation/home expectations while preserving the actual `/import-export` route.

A duplicate test-ID bug was identified:

```ts
{ href: "/books", label: "Books", testId: "poem" }
```

and should remain fixed as:

```ts
{ href: "/books", label: "Books", testId: "books" }
```

---

## 14. Current Test Status

Testing stack:

- Vitest
- React Testing Library
- jsdom
- `tests/setup.ts`
- default test timeout: 20 seconds

### Latest confirmed focused-navigation status

A focused run reached:

```text
Test Files: 1 failed | 3 passed
Tests:      1 failed | 19 passed
```

The single remaining failure was:

```text
tests/unit/pages/MultiPageWorkflowArchitecture.test.tsx
```

The failing assertion incorrectly required an active navigation item using:

```ts
aria-current="page"
```

inside a test whose purpose was only to verify that workflow navigation destinations exist.

A command was provided to remove that stale active-route assertion.

**The result of that final cleanup has not yet been reported, so do not claim the complete suite is green yet.**

### Earlier full-suite snapshot

A prior full run reached:

```text
132 test files
900 tests total
892 passed
8 failed
```

Those eight failures were all caused by the duplicate Books/Poem navigation test IDs and were subsequently narrowed down to the one stale active-route assertion above.

### Next verification required

After the final stale test cleanup:

```powershell
pnpm --filter "@matn-quiz/web" test
pnpm --filter "@matn-quiz/web" build
```

Only mark the web app fully green after both pass.

---

## 15. Vitest Performance

Current Vitest configuration uses:

- React plugin
- jsdom
- setup file
- `tests/**/*.test.{ts,tsx}`
- 20-second timeout

A faster configuration was discussed but has **not yet been confirmed as applied**.

Proposed optimization:

- rename `vitest.config.ts` to `vitest.config.mts`
- use ESM-safe `import.meta.url`
- try `pool: "vmThreads"`
- `maxWorkers: "75%"`
- `fileParallelism: true`
- keep `isolate: true`
- `css: false`

Do not disable test isolation because this project has already experienced browser-storage state leakage between tests.

The recurring Vite warning is:

```text
ESM syntax in a file loaded as CommonJS
```

Renaming the config to `.mts` is the preferred cleanup if/when the performance optimization is applied.

---

## 16. Current Vercel / Deployment Notes

For the monorepo web deployment:

```text
Root Directory: apps/web
Install Command: pnpm install --frozen-lockfile
Build Command:   pnpm build
Output:          .next
```

Local Next.js development/build uses webpack because Windows Application Control has previously interfered with SWC/Turbopack behavior.

Do not claim Vercel deployment is complete unless deployment logs confirm it.

Book upload durability must be solved before treating the Book Library as production-ready on Vercel.

---

## 17. Important Windows / PowerShell Rules

The user works on Windows PowerShell.

Preferred workflow:

- one complete copy-paste command at a time
- use `pnpm`
- run commands from project root
- use UTF-8 without BOM when rewriting source files
- avoid unclosed PowerShell here-strings
- avoid `exit` during debugging because it may close the integrated terminal
- when a command is large, prefer a downloadable `.ps1`
- when giving a command, clearly say:

```text
Copy only this command:
```

For UTF-8 writes:

```powershell
$utf8 = New-Object System.Text.UTF8Encoding($false)
```

For unsigned downloaded PowerShell scripts:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
Unblock-File .\script.ps1
.\script.ps1
```

---

## 18. Current Priority Order

Continue in this order:

1. Confirm the final stale `MultiPageWorkflowArchitecture` test is fixed.
2. Run the full web Vitest suite.
3. Run the production Next.js build.
4. Verify the split Create wizard in the browser:
   - Step 1 text persists
   - Step 2 method/count sees the same text
   - Step 3 generation works
5. Verify History → Study saved-quiz handoff.
6. Verify HIDE_LINE TTS:
   - visible line plays audio
   - hidden line cannot play audio
7. Confirm Poem Arabic placeholders:
   - `أدخل العنوان`
   - `أدخل النص`
8. Confirm Resume Study Session is removed from `/create`.
9. Finish Book Library final verification/hardening.
10. Only then continue deployment/public-launch work.

---

## 19. Historical Phase Summary

The project has previously gone through these major areas:

- Foundation
- Arabic text input
- quiz method selection
- hide-count selection
- Hide Word engine
- Hide Line engine
- unified quiz generation
- study UX
- responsive/mobile polish
- local quiz history
- shareable JSON import/export
- review/scoring
- study session persistence
- accessibility polish
- release hardening
- deployment readiness
- monitoring/performance readiness
- Arabic TTS safety
- page architecture refactor
- provider-based Arabic TTS
- monorepo migration
- Poem Reader
- split Create wizard
- Book Library

Do not rely on old phase-number assumptions when they conflict with the current route/file architecture described above.

---

## 20. Prompt for a New Chat

```text
You are helping me continue my Matn Quiz project.

Project root:
C:\Users\Dell\OneDrive\Desktop\Programs\matn-quiz

GitHub:
https://github.com/FakhirAhmedKhan/matn-quiz.git

Branch:
Mono-Repo

It is now a pnpm monorepo.

Main structure:
apps/web = Next.js web app
apps/mobile = Expo mobile app, currently paused

The web app is a Quran / Islamic matn memorization tool with:
- Arabic text input
- Hide Words
- Hide Lines
- hide-count selection
- study/reveal mode
- review scoring
- local saved quiz history
- import/export JSON
- unfinished study-session persistence
- Arabic TTS through /api/tts
- Poem Reader
- Book Library

Current important routes:
/create
/create/method
/create/count
/study
/history
/import-export
/poem
/poem/read
/books
/books/upload
/books/[bookId]
/books/[bookId]/read

Important Create workflow:
Each page uses usePage(), so state is persisted across routes using:
matn-quiz:quiz-workflow-draft:v1
in sessionStorage.

Important TTS rule:
Hidden answers must never be sent to /api/tts.
HIDE_WORD keeps strict hidden-answer protection.
HIDE_LINE audio is controlled by line visibility/index:
visible line = playable
hidden line = disabled.

Important Book Library limitation:
Current metadata/files are demo/local only and are not yet production-durable.

Current navigation:
Home, Create, Study, Poem, Books, History.
Import / Export route still exists but is removed from main navigation.

Books must use:
top-nav-books
bottom-nav-books

Poem placeholders:
أدخل العنوان
أدخل النص

Latest confirmed focused test state:
19 of 20 navigation-focused tests passed.
One stale aria-current assertion in MultiPageWorkflowArchitecture remained and a fix was provided, but final full-suite success has not yet been confirmed.

Next:
1. confirm that final test
2. run full web tests
3. run web build
4. verify Create wizard persistence
5. verify History -> Study
6. verify HIDE_LINE TTS visible/hidden behavior
7. continue Book Library final verification
8. then deployment/public launch

Use Windows PowerShell commands only.
Give one complete copy-paste command at a time.
Always say “Copy only this command:” immediately before command blocks.
Use pnpm.
Avoid unclosed here-strings.
Use UTF-8 without BOM when rewriting files.
Do not use exit while debugging.
For very large changes, prefer a downloadable .ps1.
```
