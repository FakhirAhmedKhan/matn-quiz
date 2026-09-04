# Matn Quiz Mobile — Phase 1 UI Prototype + Demo Logic Plan

## Goal

Build a complete React Native mobile prototype of **Matn Quiz** with all major screens, navigation, and realistic demo logic before integrating backend services.

This phase should feel like the real app, but use local/mock data only.

### In Scope

- All mobile screens
- Final navigation structure
- Arabic demo content
- Hide Words / Hide Lines demo logic
- Study and review flow
- Demo Book Library
- Demo Poem Reader
- Demo History
- Demo Resume
- Demo Import / Export
- Demo Audio UI
- Settings
- Local mock state
- Responsive and accessible mobile UI

### Out of Scope for This Phase

- Backend
- Production database
- Authentication
- Real TTS API
- Real PDF upload
- Real cloud storage
- Payments
- Push notifications
- Analytics
- Production sync
- Web/mobile account sync

---

# Recommended Stack

Use:

```text
Expo
React Native
TypeScript
Expo Router
AsyncStorage
Zustand
React Hook Form
Zod
Expo Vector Icons
```

Recommended navigation library:

```text
Expo Router
```

This fits Matn Quiz well because the product already maps naturally to screens and routes.

---

# Suggested Mobile Folder Structure

```text
apps/mobile/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   │
│   ├── create/
│   │   ├── index.tsx
│   │   ├── method.tsx
│   │   └── count.tsx
│   │
│   ├── study.tsx
│   ├── review.tsx
│   │
│   ├── history/
│   │   ├── index.tsx
│   │   └── [quizId].tsx
│   │
│   ├── resume.tsx
│   ├── import-export.tsx
│   │
│   ├── poem/
│   │   ├── index.tsx
│   │   └── read.tsx
│   │
│   ├── books/
│   │   ├── index.tsx
│   │   ├── upload.tsx
│   │   ├── [bookId].tsx
│   │   └── [bookId]/
│   │       └── read.tsx
│   │
│   ├── audio.tsx
│   └── settings.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── quiz/
│   ├── poem/
│   ├── books/
│   └── history/
│
├── features/
│   ├── quiz/
│   ├── books/
│   ├── poem/
│   └── settings/
│
├── store/
│   ├── quizStore.ts
│   ├── historyStore.ts
│   ├── bookStore.ts
│   ├── poemStore.ts
│   └── settingsStore.ts
│
├── mocks/
│   ├── demoQuiz.ts
│   ├── demoHistory.ts
│   ├── demoBooks.ts
│   ├── demoPoems.ts
│   └── demoProgress.ts
│
├── constants/
├── hooks/
├── types/
└── utils/
```

---

# Phase M1 — Mobile Foundation

## Goal

Set up the React Native app correctly.

### Build

- Expo app
- TypeScript
- Expo Router
- Global theme
- Safe-area handling
- Status bar handling
- Fonts
- Icons
- Base navigation

### Design Tokens

Create reusable values for:

```text
colors
spacing
radius
typography
shadows
buttonSizes
cardStyles
```

### Visual Direction

Use the same style as the current Matn Quiz concept:

- Cream background
- Emerald green
- Soft slate text
- Subtle gold accents
- Rounded cards
- Large readable Arabic typography
- Minimal shadows
- Calm Islamic study aesthetic

### Verification

- [ ] Expo starts
- [ ] Android emulator works
- [ ] iOS-compatible structure exists
- [ ] Navigation works
- [ ] No TypeScript errors

---

# Phase M2 — Main Navigation

Recommended bottom navigation:

```text
Home
Create
History
Books
Settings
```

Suggested icon layout:

```text
🏠 Home
✏ Create
◷ History
📚 Books
⚙ Settings
```

Other screens should open as stack screens.

Poem should be accessible from Home or a feature menu instead of overcrowding the bottom tab bar.

---

# Phase M3 — Home Screen

## Route

```text
/
```

## UI

Build:

- Matn Quiz logo
- Quran & Matn Memorization subtitle
- "Memorize. Practice. Master."
- Create New Quiz button
- Resume Study button
- Your Progress card
- Recent Quiz card
- Quick feature shortcuts

### Demo Stats

```ts
weeklyQuizzes = 12
accuracy = 87
streak = 7
```

### Demo Recent Quiz

```text
الأربعون النووية
Hide Words
10 hidden
68%
```

### Navigation

```text
Create New Quiz → /create
Resume Study → /resume
Recent Quiz → /study
```

---

# Phase M4 — Create Screen — Arabic Input

## Route

```text
/create
```

## UI

- Step 1 of 3
- Arabic text input
- Character count
- Word count
- Line count
- Clear action
- Input tips
- Continue button

### Demo Arabic Text

```text
إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى
فمن كانت هجرته إلى الله ورسوله
فهجرته إلى الله ورسوله
```

### Demo Logic

Calculate locally:

```text
characters
words
lines
```

Store input in:

```ts
quizStore.text
```

Continue to:

```text
/create/method
```

---

# Phase M5 — Choose Quiz Method

## Route

```text
/create/method
```

## Options

### Hide Words

```text
Hide selected words and test recall
```

### Hide Lines

```text
Hide entire lines and test memorization
```

### Store State

```ts
quizMethod: "HIDE_WORD" | "HIDE_LINE"
```

### Selected State UI

- Green border
- Checkmark
- Light emerald background

Continue to:

```text
/create/count
```

---

# Phase M6 — Hide Count / Quiz Setup

## Route

```text
/create/count
```

## UI

```text
-
10
+

Maximum / Available

Quiz Summary
Method
Hidden Items
Total Words or Lines
Estimated Questions

Generate Quiz
```

### Demo Validation

For Hide Words:

```ts
min = 1
max = numberOfWords
```

For Hide Lines:

```ts
min = 1
max = numberOfLines
```

Generate Quiz navigates to:

```text
/study
```

---

# Phase M7 — Demo Quiz Engine

Implement a lightweight mobile-only demo engine first.

## Hide Words Example

Input:

```text
إنما الأعمال بالنيات وإنما لكل امرئ ما نوى
```

Output:

```text
إنما ______ بالنيات وإنما لكل ______ ما نوى
```

Answers:

```ts
[
  {
    index: 1,
    answer: "الأعمال"
  },
  {
    index: 5,
    answer: "امرئ"
  }
]
```

## Hide Lines Example

Input:

```text
Line A
Line B
Line C
```

Output:

```text
Line A
________
Line C
```

Later this demo logic can be replaced by the real shared quiz engine.

---

# Phase M8 — Study Screen

## Route

```text
/study
```

## UI

- Study Mode title
- Progress
- Arabic quiz card
- Reveal Answer
- Reveal All
- Audio
- Hide All
- Reset Study

### Demo Behavior

Tap hidden item:

```text
blank → actual answer
```

Reveal All:

```text
all hidden items visible
```

Hide All:

```text
reset all reveals
```

Progress example:

```text
5 / 10
```

### Audio

For this phase only:

```text
Audio button → mock playing state
```

No real TTS request yet.

---

# Phase M9 — Review & Score

## Route

```text
/review
```

## UI

```text
82%
Great work!

Correct
Incorrect
Total

Review Answers
```

Each answer supports:

```text
Correct
Incorrect
```

### Demo Score

```ts
correct = 8
incorrect = 2
percentage = 80
```

### Buttons

```text
Review Again
Finish Quiz
```

Finish Quiz navigates to:

```text
/history
```

---

# Phase M10 — History

## Route

```text
/history
```

### Demo Quiz Cards

```text
الأربعون النووية
Hide Words
10 Hidden
65%
```

```text
الحكم العطائية
Hide Lines
5 Hidden
100%
```

### Actions

- Resume
- Review
- More
- Delete

### Filters

```text
All
In Progress
Completed
```

All demo logic can live in Zustand initially.

---

# Phase M11 — Resume Study

## Route

```text
/resume
```

## UI

- Quiz title
- Quiz type
- Progress
- Accuracy
- Last activity
- Resume Quiz
- Start Over

### Demo State

```ts
progress = 5
total = 10
accuracy = 72
```

Resume Quiz navigates to:

```text
/study
```

---

# Phase M12 — Import / Export

## Route

```text
/import-export
```

## Export

- Export as JSON
- Shareable Quiz Code
- Copy Code

## Import

- Paste JSON
- Validate
- Import Quiz

### Demo JSON

```json
{
  "title": "الأربعون النووية",
  "method": "HIDE_WORD",
  "hideCount": 10
}
```

For this phase, parsing and validation are local only.

---

# Phase M13 — Poem Screen

## Route

```text
/poem
```

## Fields

```text
Title
Text
```

### Arabic Placeholders

```text
أدخل العنوان
أدخل النص
```

### Actions

```text
Open Reader
Clear
```

### Demo Poem

```text
قفا نبك من ذكرى حبيب ومنزل
بسقط اللوى بين الدخول فحومل
```

---

# Phase M14 — Poem Reader

## Route

```text
/poem/read
```

## UI

- Poem title
- Large Arabic reading area
- Single-column mode
- Two-column mode for tablets
- Font increase
- Font decrease
- Line spacing
- Previous / next
- Bookmark
- Share

### Mobile Default

```text
single column
```

### Tablet

```text
two columns
```

---

# Phase M15 — Books Library

## Route

```text
/books
```

## Book Card

- Cover
- Arabic title
- Author
- Pages
- Last opened
- Open button

### Demo Books

```text
الأربعون النووية
رياض الصالحين
نخبة الفكر
مختصر الفقه
```

### Filters

```text
Search
All
Recent
Favorites
```

---

# Phase M16 — Book Details

## Route

```text
/books/[bookId]
```

## UI

- Cover
- Title
- Author
- Pages
- Status
- Description
- Open Reader
- Favorite

### Demo Status

```text
VERIFIED
```

---

# Phase M17 — Book Reader

## Route

```text
/books/[bookId]/read
```

Do not build real PDF rendering yet.

Use mock book pages:

```text
Page 1
Page 2
Page 3
```

## Controls

- Previous
- Next
- Bookmark
- Font
- Current page number

Later replace this with a real PDF reader.

---

# Phase M18 — Add Book

## Route

```text
/books/upload
```

## Demo Fields

- Book title
- Author
- Description
- Select PDF
- Cover
- Upload

### Demo Logic

```text
Select PDF → fake selected file
Upload → add mock book to store
```

No real upload in this phase.

---

# Phase M19 — Audio Learning Screen

## Route

```text
/audio
```

## UI

- Visible Text Only badge
- Arabic text
- Now Playing
- Seek bar
- Play / Pause
- 15 sec backward
- 15 sec forward
- Playback speed

### Demo Player State

```ts
isPlaying
currentTime
duration
playbackRate
```

No real network audio required yet.

---

# Phase M20 — Settings

## Route

```text
/settings
```

## Sections

```text
Profile
Reading
Theme
Audio
Study
Storage & Data
Accessibility
About Matn Quiz
```

### Demo Settings State

```ts
theme
fontSize
lineHeight
playbackRate
autoReveal
reduceMotion
```

Store locally in Zustand for this phase.

---

# State Architecture

Avoid putting all state directly inside screens.

Use separate stores:

```text
quizStore
historyStore
bookStore
poemStore
settingsStore
```

Example:

```ts
interface QuizState {
  text: string;
  method: "HIDE_WORD" | "HIDE_LINE";
  hideCount: number;
  generatedQuiz: GeneratedQuiz | null;

  setText: (text: string) => void;
  setMethod: (method: QuizMethod) => void;
  setHideCount: (count: number) => void;
  generateDemoQuiz: () => void;
  reset: () => void;
}
```

---

# Mock Data Strategy

Create:

```text
apps/mobile/mocks/
```

Recommended files:

```text
demoQuiz.ts
demoHistory.ts
demoBooks.ts
demoPoems.ts
demoProgress.ts
```

Do not hardcode demo data directly inside screens.

---

# Reusable Components

Build these reusable components early:

```text
AppScreen
AppHeader
PrimaryButton
SecondaryButton
AppCard
SectionHeader
ProgressBar
ArabicTextCard
EmptyState
QuizMethodCard
QuizHistoryCard
BookCard
SettingRow
IconButton
StepIndicator
```

This keeps the app consistent and makes backend integration easier later.

---

# Demo End-to-End Flow

At the end of this phase, this should work:

```text
Open App
  ↓
Home
  ↓
Create New Quiz
  ↓
Enter Arabic Text
  ↓
Choose Hide Words
  ↓
Choose Hide Count
  ↓
Generate
  ↓
Study
  ↓
Reveal Answers
  ↓
Review
  ↓
Score
  ↓
History
```

Additional flows:

```text
Home → Poem → Reader
Home → Books → Book Details → Reader
History → Resume → Study
Import / Export → Import Demo Quiz → Study
Settings → Change Reading Preferences
```

---

# Recommended Development Order

Implement in this order:

```text
M1  Expo foundation
M2  Design system
M3  Navigation
M4  Home
M5  Create input
M6  Method
M7  Count
M8  Demo quiz engine
M9  Study
M10 Review
M11 History
M12 Resume
M13 Import / Export
M14 Poem input
M15 Poem reader
M16 Books library
M17 Book details
M18 Book reader
M19 Book upload mock
M20 Audio UI
M21 Settings
M22 Demo local persistence
M23 Responsive/mobile polish
M24 Accessibility
M25 Full demo-flow testing
```

---

# Milestone Definition

## Mobile Phase 1 — Complete UI Prototype + Demo Logic

This milestone is complete when:

- [ ] Every planned screen exists
- [ ] Every button navigates somewhere meaningful
- [ ] Demo data works end-to-end
- [ ] Hide Words demo flow works
- [ ] Hide Lines demo flow works
- [ ] Study flow works
- [ ] Review flow works
- [ ] History works
- [ ] Resume works
- [ ] Poem works
- [ ] Books flow works
- [ ] Import / Export demo works
- [ ] Audio UI works with mock state
- [ ] Settings work with local demo state
- [ ] No backend is required to demonstrate the product

---

# What Comes After This

## Mobile Phase 2 — Real Logic Integration

After the UI prototype is stable:

1. Reuse the real quiz domain logic from web/shared packages
2. Replace demo quiz generation
3. Add AsyncStorage persistence
4. Integrate real history data
5. Integrate real Poem persistence
6. Integrate real Book Library API/storage
7. Integrate real TTS through `/api/tts`
8. Add real PDF reading
9. Add production error/loading states
10. Add E2E and release verification

The goal is to replace demo logic feature-by-feature without redesigning the UI again.
