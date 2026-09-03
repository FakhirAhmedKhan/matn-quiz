# Matn Quiz — Project Context Memory

_Last updated: 2026-09-04_

## 1. Project Overview

**Matn Quiz** is a pnpm monorepo for Quran/Matn memorization and study. The active product is the Next.js web app, with an Expo/React Native mobile app currently paused.

Primary goals:

- Arabic/Quran/Matn memorization quizzes
- Hide Words / Hide Lines study modes
- Multi-page workflow
- Saved history and resumable study sessions
- Import/export of quiz data
- Safe Arabic TTS
- Poem / Nazm reading mode with RTL support
- Responsive desktop + mobile navigation
- Vercel deployment from a pnpm monorepo

## 2. Local Project Path

```txt
C:\Users\Dell\OneDrive\Desktop\Programs\matn-quiz
```

## 3. Git

Current working branch:

```txt
Mono-Repo
```

Known recent deployment-related commits include `17105ef` and `cb5dc26`. Do not assume these are the latest without checking Git.

Useful commands:

```powershell
git status
git log --oneline -10
git branch
```

## 4. Monorepo Structure

```txt
matn-quiz/
├── apps/
│   ├── web/
│   └── mobile/
├── packages/
├── docs/
├── package.json
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

### apps/web

Main active product.

Stack:

- Next.js 16.3.4
- React
- TypeScript
- Tailwind utility styling
- Vitest
- Testing Library

### apps/mobile

Expo / React Native app. Current status: **Paused**.

## 5. Package Manager

The monorepo uses `pnpm`.

Root `package.json` should contain:

```json
{
  "packageManager": "pnpm@11.22.0"
}
```

Do not keep npm lock files:

```txt
package-lock.json
apps/web/package-lock.json
```

## 6. Windows / Next.js Build Note

On the current Windows machine, native SWC / Turbopack can be blocked by Windows Application Control. The web app therefore uses webpack explicitly.

Expected scripts in `apps/web/package.json`:

```json
{
  "dev": "next dev --webpack",
  "build": "next build --webpack"
}
```

## 7. Current Page Architecture

Important routes:

```txt
/
/create
/create/method
/create/count
/study
/import-export
/history
/poem
/poem/read
```

### `/`

Clean landing page only. It should not render the full quiz workflow directly.

### `/create`

Quiz input/start page.

### `/create/method`

Choose `HIDE_WORDS` or `HIDE_LINES`.

### `/create/count`

Choose hide count / difficulty.

### `/study`

Generated quiz / reveal / study page.

### `/import-export`

Quiz import/export/share page.

### `/history`

Saved quiz history.

### `/poem`

Poem / Nazm setup page.

### `/poem/read`

Poem / Nazm reader page.

## 8. Homepage Architecture

The old homepage previously contained many workflow sections. Those should no longer all appear on `/`. The homepage should remain a lightweight landing page.

Important files:

```txt
apps/web/app/page.tsx
apps/web/components/page/home/HomePageView.tsx
apps/web/tests/helpers/HomeWorkflowTestPage.tsx
```

The helper exists so old full-workflow tests can continue without forcing all production components onto the homepage.

## 9. Shared Layout / Navigation

Important files:

```txt
apps/web/components/layout/AppTopNav.tsx
apps/web/components/layout/AppBottomNav.tsx
apps/web/components/layout/AppPageShell.tsx
apps/web/components/layout/AppStepHeader.tsx
apps/web/components/layout/ResponsiveLayout.tsx
apps/web/components/layout/index.ts
```

Navigation currently includes:

```txt
Home
Create
Study
Poem
Import / Export
History
```

Mobile bottom nav has 6 items. Avoid duplicate nav bars and preserve active-route behavior for nested routes.

## 10. Existing Quiz Feature

Current capabilities:

- Arabic/Quran/Matn text input
- Hide Words
- Hide Lines
- Select hide count
- Generate quiz
- Reveal answers
- Study/review mode
- Copy/export/reset
- Save/reopen history
- Resume unfinished sessions
- Import/export shareable JSON

Quiz logic should remain separate from Poem Reader logic unless intentionally merged later.

## 11. Quiz Flow Storage

Important file:

```txt
apps/web/lib/quiz/quiz-flow-storage.ts
```

Storage key:

```txt
matn-quiz:quiz-flow-draft
```

Important helpers include:

```txt
createQuizFlowDraft
loadQuizFlowDraft
saveQuizFlowDraft
updateQuizFlowText
updateQuizFlowMethod
updateQuizFlowHideCount
saveQuizFlowGeneratedQuiz
clearQuizFlowDraft
hasQuizFlowText
hasGeneratedQuiz
```

## 12. Arabic TTS

Safety requirement:

> Hidden answers must never be spoken.

Important files include:

```txt
apps/web/lib/quiz/tts-safe-text.ts
apps/web/lib/tts/google-translate-tts.ts
apps/web/app/api/tts/route.ts
apps/web/hooks/useArabicTts.ts
apps/web/components/quiz/ArabicTtsControls.tsx
apps/web/components/quiz/QuizTtsPanel.tsx
```

The no-key Google Translate TTS route is a demo/local approach, not a production-grade provider.

## 13. Poem / Nazm Reader Feature

New feature added separately from quiz logic.

Routes:

```txt
/poem
/poem/read
```

Important files:

```txt
apps/web/lib/poem/poem-storage.ts
apps/web/components/poem/PoemInputForm.tsx
apps/web/components/poem/PoemReader.tsx
apps/web/components/poem/index.ts
apps/web/app/poem/page.tsx
apps/web/app/poem/read/page.tsx
```

## 14. Poem Draft Model

```ts
type PoemDraft = {
  title: string;
  text: string;
  layout: "SINGLE_COLUMN" | "TWO_COLUMN";
  direction: "rtl" | "ltr";
  fontSize: number;
  updatedAt: string;
};
```

Storage key:

```txt
matn-quiz:poem-draft
```

## 15. Poem Setup Page

Route: `/poem`

Current scope:

- Poem title input
- Poem text textarea
- RTL Urdu/Arabic support
- Single-column option
- Two-column option
- Font size controls
- Load sample poem
- Clear poem
- Open Reader action
- LocalStorage persistence

## 16. Poem Reader Page

Route: `/poem/read`

Current reader features:

- Centered poem title
- RTL rendering
- Two-column layout
- Single-column layout
- Adjustable font size
- Center spacing between columns
- Mobile-friendly responsive layout
- Copy poem
- Print poem
- Edit/back to setup
- Clear poem

Visual goal:

```txt
Right column     center space     Left column
```

## 17. Poem Reader Controls

```txt
Edit
Copy
Print
Single
Two
Font -
Font +
Clear
```

Copy UI includes user-visible status `Copied`.

## 18. Poem Storage Helpers

Important helpers include:

```txt
createPoemDraft
loadPoemDraft
savePoemDraft
updatePoemTitle
updatePoemText
updatePoemLayout
updatePoemFontSize
clearPoemDraft
hasPoemText
getPoemDisplayTitle
splitPoemLines
splitPoemIntoColumns
```

Font size is currently clamped to approximately 18px–48px.

## 19. Poem Tests

```txt
apps/web/tests/unit/poem/poem-storage.test.ts
apps/web/tests/unit/components/PoemInputForm.test.tsx
apps/web/tests/unit/components/PoemReader.test.tsx
apps/web/tests/unit/pages/PoemRoutes.test.tsx
apps/web/tests/unit/pages/PoemInputAndReaderPages.test.tsx
apps/web/tests/integration/poem-reader-flow.test.tsx
```

Focused command:

```powershell
pnpm --filter "@matn-quiz/web" exec vitest run tests/unit/components/PoemInputForm.test.tsx tests/unit/components/PoemReader.test.tsx tests/integration/poem-reader-flow.test.tsx --testTimeout=20000
```

## 20. Windows Encoding Problem

PowerShell can display Urdu text as garbled terminal output. This does not necessarily mean the React UI data is wrong.

Testing rule:

- Avoid fragile exact Urdu-string assertions when Unicode correctness is not what the test is validating.
- Prefer English fixtures, test IDs, non-empty checks, length checks, or values read back from storage.

## 21. Clipboard Test Issue

Vitest/jsdom clipboard spying was brittle. Stable approach:

- Click Copy
- Assert visible status becomes `Copied`
- Test `window.print` separately

Do not rely only on `navigator.clipboard.writeText` call assertions.

## 22. Vercel Deployment

Correct settings:

```txt
Root Directory: apps/web
Framework Preset: Next.js
Install Command: pnpm install --frozen-lockfile
Build Command: pnpm build
Output Directory: .next
Package Manager: pnpm
```

## 23. Vercel Issue History

### Issue 1 — Next.js not detected

Error:

```txt
No Next.js version detected.
```

Cause: Vercel was looking at the wrong root.

Fix: set Root Directory to `apps/web`.

### Issue 2 — npm vs pnpm

Removed npm lock files so the repo stays pnpm-only.

### Issue 3 — UTF-8 BOM in package.json

Latest important deployment error:

```txt
Unexpected token '﻿'
/vercel/path0/package.json is not valid JSON
```

Cause: root `package.json` contained a UTF-8 BOM hidden character.

Important rule: write JSON as UTF-8 **without BOM**.

Preferred PowerShell pattern:

```powershell
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Resolve-Path "package.json").Path, $content, $utf8NoBom)
```

Validation:

```powershell
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('package.json','utf8')); console.log('VALID')"
```

## 24. Current Vercel State

Latest known state:

- pnpm detected
- Next.js 16.3.4 detected
- dependency install succeeds
- build reaches `next build --webpack`
- build fails because of UTF-8 BOM in root `package.json`

Next action:

1. Remove BOM
2. Validate JSON
3. Run local web build
4. Commit/push
5. Redeploy
6. Do not claim deployment success until Vercel build passes

## 25. Important Encoding Files

Verify at minimum:

```txt
package.json
apps/web/package.json
apps/mobile/package.json
docs/MATN-QUIZ-CONTEXT.md
```

## 26. Useful Commands

Start:

```powershell
pnpm dev
```

Web build:

```powershell
pnpm --filter "@matn-quiz/web" build
```

Full build:

```powershell
pnpm build
```

Tests:

```powershell
pnpm test
```

Git:

```powershell
git status
git log --oneline -10
git push
```

## 27. Test Baseline

Recent suites have been around 100+ test files and 800+ tests. Examples included 109 files / 823 tests and later 114 files / 847 tests. These are not permanent expected counts. Trust latest terminal output.

## 28. Responsive Navigation Direction

Desktop: top navigation.

Mobile: fixed bottom navigation.

Important concerns:

- Safe area
- Small screen width
- Active route
- Readable labels
- No duplicate nav
- Page bottom padding

Poem is included in both desktop and mobile navigation.

## 29. Recommended Next Poem Phases

Potential future work:

- Poem history
- Poem import/export JSON
- Poem memorization mode
- Hide poem words / lines
- Reveal line-by-line
- Poem audio
- Better couplet-pair model for traditional poetry layout

Potential model:

```ts
type PoemCouplet = {
  right: string;
  left: string;
};
```

## 30. User Workflow Preference

The user prefers:

- Simple direct guidance
- One pasteable PowerShell command when possible
- Run commands from monorepo root
- Diagnostic command first when failures are unclear
- Then one fix command
- Phase-by-phase implementation
- Tests/build after each phase
- Commit after successful verification
- No Codex install
- Minimal explanation

Important: do not mix explanatory prose inside PowerShell blocks.

Avoid `exit $LASTEXITCODE` in integrated-terminal troubleshooting because it closes the terminal. Prefer keeping the terminal open and printing the failure.

## 31. Current Immediate Priorities

1. Ensure root `package.json` is valid UTF-8 without BOM
2. Run local web production build
3. Push encoding fix
4. Redeploy Vercel
5. Confirm successful production deployment
6. Manually test main routes
7. Continue Poem improvements only after deployment is stable

## 32. Manual Poem Test Data

Title:

```txt
ہدیہ سلام
```

Text:

```txt
آمدار نبوت پہ لاکھوں سلام
روح بزم رسالت پہ لاکھوں سلام
ایسے نوری جمالت پہ لاکھوں سلام
مظہر ذات قدرت پہ لاکھوں سلام
نور حق کی حقیقت پہ لاکھوں سلام
شان ختم نبوت پہ لاکھوں سلام
```

Manual checks:

```txt
[ ] /poem opens
[ ] title saves
[ ] poem text saves
[ ] character count updates
[ ] two-column mode works
[ ] single-column mode works
[ ] font size changes
[ ] /poem/read opens
[ ] title is centered
[ ] RTL text is readable
[ ] center spacing appears
[ ] Copy shows Copied
[ ] Print opens print dialog
[ ] Edit returns to /poem
[ ] Refresh preserves draft
[ ] Mobile layout is usable
```

## 33. Context Handoff Rule

When continuing this project in another AI/model/chat, provide this file and say:

> Read this context first. Do not redesign or restart the project. Continue from the current architecture and verify the latest Git/test/deployment state before making changes.

Do not assume old test counts, commit hashes, or deployment status are still current.
