# Matn Quiz — Phase 6 Status

## Scope

Phase 6 adds the Hide Line quiz engine.

This phase only handles line hiding. It does not connect final quiz generation to the homepage yet.

---

## Completed

### Phase 6.1 — Line Tokenization Utilities

- splitTextPreservingLineEndings()
- createLineTokens()
- getHideableLineTokens()
- countHideableLines()
- rebuildTextFromLineTokens()

### Phase 6.2 — Line Selection Utilities

- normalizeLineSelectionCount()
- shuffleHideableLineTokens()
- selectLinesToHide()
- getSelectedLineTokenIndexes()
- getSelectedLineIndexes()
- isLineTokenSelected()

### Phase 6.3 — Hide Line Engine

- HIDDEN_LINE_PLACEHOLDER
- createHiddenLineToken()
- generateHideLineQuiz()
- hasHiddenLines()

### Phase 6.4 — Hide Line Edge Cases

- Empty text
- Whitespace-only text
- Blank lines
- Whitespace-only lines
- Leading newline
- Trailing newline
- CRLF line endings
- CR line endings
- Repeated lines
- Punctuation in answers
- Diacritics in answers
- Deterministic output

### Phase 6.5 — Final Verification

- Focused Phase 6 tests
- Full test suite
- Lint
- Production build
- Verification script

---

## Verification Commands

pnpm test
pnpm run lint
pnpm run build
pnpm run verify:phase6

---

## Phase 6 Completion Checklist

- [x] Line endings are preserved
- [x] Blank lines are preserved
- [x] Whitespace-only lines are not hidden
- [x] Hideable lines are selected by position
- [x] Repeated lines work correctly
- [x] Selected lines are replaced with placeholders
- [x] Original text is not mutated
- [x] Answers store original hidden lines
- [x] Edge cases are tested
- [x] Tests pass
- [x] Lint passes
- [x] Build passes

---

## Next Phase

Phase 7 — Unified Quiz Generator

Goal:

Create one generator that supports both quiz methods:

- Hide Words
- Hide Lines
