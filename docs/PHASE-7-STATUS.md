# Matn Quiz — Phase 7 Status

## Scope

Phase 7 adds the unified quiz generator and connects generation to the homepage.

The app can now generate quizzes for:

- Hide Words
- Hide Lines

---

## Completed

### Phase 7.1 — Unified Quiz Types and Helpers

- GenerateQuizInput
- GeneratedQuiz
- GeneratedHideWordQuiz
- GeneratedHideLineQuiz
- GeneratedQuizAnswer
- Generated word answer type
- Generated line answer type
- Type guards
- Summary helpers

### Phase 7.2 — Unified Quiz Generator Dispatcher

- generateQuiz()
- generateQuizFromValues()
- Hide Word engine dispatch
- Hide Line engine dispatch
- Engine result mapping into unified generated quiz shape

### Phase 7.3 — Generator Validation and Error Handling

- validateGenerateQuizInput()
- getGenerateQuizInputError()
- GenerateQuizValidationError
- assertValidGenerateQuizInput()
- generateValidatedQuiz()
- safeGenerateQuiz()

### Phase 7.4 — Homepage Integration

- Generate quiz from UI
- Hide Words generation flow
- Hide Lines generation flow
- Generated quiz preview
- Answer list
- Generated quiz resets when text, method, or hide count changes

### Phase 7.5 — Final Verification

- Focused Phase 7 tests
- Full test suite
- Lint
- Production build
- Verification script

---

## Verification Commands

pnpm test
pnpm run lint
pnpm run build
pnpm run verify:phase7

---

## Phase 7 Completion Checklist

- [x] Unified quiz types exist
- [x] Unified generator supports Hide Words
- [x] Unified generator supports Hide Lines
- [x] Validation protects generator input
- [x] Safe generator returns success/failure result
- [x] Homepage can generate Hide Words quiz
- [x] Homepage can generate Hide Lines quiz
- [x] Generated quiz text appears
- [x] Answers appear
- [x] Generated quiz clears when inputs change
- [x] Tests pass
- [x] Lint passes
- [x] Build passes

---

## Next Phase

Phase 8 — Quiz Display and Study UX

Goal:

Improve the generated quiz screen with better reading layout, answer reveal controls, copy/export actions, and study-friendly UX.
