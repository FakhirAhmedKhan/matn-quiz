# Matn Quiz — Phase 4 Status

## Scope

Phase 4 adds hide count selection only.

No hide-word or hide-line quiz generation has been implemented yet.

---

## Completed

### Phase 4.1 — Hide Count Rules and Utilities

- HIDE_COUNT_MIN
- HIDE_COUNT_DEFAULT
- getAvailableHideCount()
- clampHideCount()
- isValidHideCount()
- normalizeHideCount()
- getHideCountLimits()

### Phase 4.2 — HideCountSelector Component

- Word mode label
- Line mode label
- Dynamic maximum
- Increment
- Decrement
- Disabled state
- Helper text

### Phase 4.3 — Home Page Integration

- Home page tracks hideCount
- Hide count connected to selected method
- Word mode max uses Arabic word count
- Line mode max uses valid line count
- Continue requires valid Arabic text and valid hide count

### Phase 4.4 — Tests and Verification

- Hide count utility tests
- HideCountSelector component tests
- Home page integration tests
- Full hide-count flow tests
- Verification script

---

## Verification Commands

npm test
npm run lint
npm run build
npm run verify:phase4

---

## Phase 4 Completion Checklist

- [x] Hide count minimum works
- [x] Hide count maximum works
- [x] Word mode max uses Arabic word count
- [x] Line mode max uses valid line count
- [x] Hide count clamps when method changes
- [x] Continue requires valid Arabic text and valid hide count
- [x] Tests pass
- [x] Lint passes
- [x] Build passes

---

## Next Phase

Phase 5 — Hide Word Quiz Engine

Goal:

Generate quiz text by hiding selected Arabic words while preserving the original Quran or matn text.
