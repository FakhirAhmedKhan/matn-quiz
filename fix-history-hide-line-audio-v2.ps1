$ErrorActionPreference = "Continue"

Write-Host "=== FIX V2: HISTORY REDIRECT + HIDE-LINE TTS ===" -ForegroundColor Cyan

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$ok = $true

function Read-NoBom {
    param([Parameter(Mandatory = $true)][string]$Path)

    return [System.IO.File]::ReadAllText(
        (Resolve-Path -LiteralPath $Path).Path
    ).TrimStart([char]0xFEFF)
}

function Write-NoBom {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [AllowEmptyString()]
        [Parameter(Mandatory = $true)][string]$Content
    )

    $fullPath = if (Test-Path -LiteralPath $Path) {
        (Resolve-Path -LiteralPath $Path).Path
    } else {
        Join-Path (Get-Location) $Path
    }

    $dir = Split-Path $fullPath -Parent

    if (!(Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }

    [System.IO.File]::WriteAllText(
        $fullPath,
        $Content,
        $utf8NoBom
    )
}

$historyComponent = "apps\web\components\quiz\SavedQuizHistory.tsx"
$savedHistorySection = "apps\web\components\page\home\SavedHistorySection.tsx"
$ttsFile = "apps\web\lib\quiz\tts-safe-text.ts"
$b5Test = "apps\web\tests\unit\components\BookReader.test.tsx"

foreach ($file in @(
    $historyComponent,
    $savedHistorySection,
    $ttsFile
)) {
    if (!(Test-Path -LiteralPath $file)) {
        Write-Host "MISSING: $file" -ForegroundColor Red
        $ok = $false
    }
}

if (!$ok) {
    Write-Host "Required files are missing. Nothing changed." -ForegroundColor Red
    Read-Host "Press Enter to close"
    return
}

$backupDir = "apps\web\.bugfix-v2-backup"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

Copy-Item -LiteralPath $historyComponent -Destination "$backupDir\SavedQuizHistory.tsx" -Force
Copy-Item -LiteralPath $savedHistorySection -Destination "$backupDir\SavedHistorySection.tsx" -Force
Copy-Item -LiteralPath $ttsFile -Destination "$backupDir\tts-safe-text.ts" -Force

Write-Host ""
Write-Host "1/3 Fixing History navigation without useRouter inside reusable component..." -ForegroundColor Yellow

Write-NoBom $historyComponent @'
"use client";

import Link from "next/link";
import { Clock3, FolderOpen, Trash2 } from "lucide-react";
import { EmptyStatePanel } from "@/components/ui/FeedbackStatePanel";
import { getGeneratedQuizMethodLabel } from "@/lib/quiz/unified-quiz";
import type { SavedQuizRecord } from "@/lib/quiz/quiz-history";
import {
  focusRingClasses,
  interactiveTransitionClasses,
  pressableClasses,
} from "@/lib/ui/accessibility";
import { getMethodAccentClasses } from "@/lib/ui/design-system";
import { cn } from "@/lib/utils/cn";

interface SavedQuizHistoryProps {
  items: SavedQuizRecord[];
  onOpen: (record: SavedQuizRecord) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  openHref?: string;
  disabled?: boolean;
  className?: string;
}

interface SavedQuizHistoryItemProps {
  record: SavedQuizRecord;
  onOpen: (record: SavedQuizRecord) => void;
  onDelete: (id: string) => void;
  openHref?: string;
  disabled?: boolean;
}

export function formatSavedQuizDate(value: string): string {
  if (!value || Number.isNaN(Date.parse(value))) {
    return "Unknown date";
  }

  return value.slice(0, 16).replace("T", " ");
}

export function getSavedQuizPreview(record: SavedQuizRecord): string {
  const preview = record.quiz.quizText.replace(/\s+/g, " ").trim();

  if (preview.length === 0) {
    return "No preview available.";
  }

  return preview.length > 90 ? `${preview.slice(0, 90)}...` : preview;
}

export function SavedQuizHistoryItem({
  record,
  onOpen,
  onDelete,
  openHref,
  disabled = false,
}: SavedQuizHistoryItemProps) {
  const methodLabel = getGeneratedQuizMethodLabel(record.quiz.method);

  const buttonClasses = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50",
    focusRingClasses,
    interactiveTransitionClasses,
    pressableClasses,
  );

  const openClasses = cn(
    buttonClasses,
    "bg-emerald-700 text-white hover:bg-emerald-800",
  );

  return (
    <li
      data-testid="saved-quiz-item"
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <span
            data-testid="saved-quiz-method"
            className={cn(
              "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
              getMethodAccentClasses(record.quiz.method),
            )}
          >
            {methodLabel}
          </span>

          <h3
            data-testid="saved-quiz-title"
            className="mt-3 text-base font-semibold text-slate-950"
          >
            {record.title}
          </h3>

          <p
            data-testid="saved-quiz-preview"
            dir="rtl"
            lang="ar"
            className="mt-2 text-right text-sm leading-7 text-slate-600"
          >
            {getSavedQuizPreview(record)}
          </p>

          <p className="mt-3 inline-flex items-center gap-2 text-xs text-slate-500">
            <Clock3 className="h-3.5 w-3.5" />
            {formatSavedQuizDate(record.updatedAt)}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {disabled || !openHref ? (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onOpen(record)}
              className={openClasses}
            >
              <FolderOpen className="h-4 w-4" />
              Open Quiz
            </button>
          ) : (
            <Link
              href={openHref}
              role="button"
              onClick={() => onOpen(record)}
              className={openClasses}
            >
              <FolderOpen className="h-4 w-4" />
              Open Quiz
            </Link>
          )}

          <button
            type="button"
            disabled={disabled}
            aria-label={`Delete saved quiz ${record.title}`}
            onClick={() => onDelete(record.id)}
            className={cn(
              buttonClasses,
              "border border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50",
            )}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}

export function SavedQuizHistory({
  items,
  onOpen,
  onDelete,
  onClear,
  openHref,
  disabled = false,
  className,
}: SavedQuizHistoryProps) {
  const hasItems = items.length > 0;

  return (
    <section
      data-testid="saved-quiz-history"
      aria-label="Saved quiz history"
      className={cn("space-y-4", className)}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Saved Quiz History
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Reopen, review, or delete quizzes saved in this browser.
          </p>
        </div>

        <button
          type="button"
          disabled={!hasItems || disabled}
          onClick={onClear}
          className={cn(
            "inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-red-300 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50",
            focusRingClasses,
            interactiveTransitionClasses,
            pressableClasses,
          )}
        >
          <Trash2 className="h-4 w-4" />
          Clear History
        </button>
      </div>

      {hasItems ? (
        <ol data-testid="saved-quiz-list" className="space-y-3">
          {items.map((record) => (
            <SavedQuizHistoryItem
              key={record.id}
              record={record}
              onOpen={onOpen}
              onDelete={onDelete}
              openHref={openHref}
              disabled={disabled}
            />
          ))}
        </ol>
      ) : (
        <div data-testid="saved-quiz-empty">
          <EmptyStatePanel
            compact
            title="No saved quizzes yet."
            description="Generate a quiz and use Save Quiz to keep it here for later."
          />
        </div>
      )}
    </section>
  );
}
'@

$section = Read-NoBom $savedHistorySection

if ($section -match 'openHref\s*=\s*["'']/study["'']') {
    Write-Host "History section already targets /study." -ForegroundColor Green
}
elseif ($section -match '<SavedQuizHistory\b') {
    $section = [regex]::Replace(
        $section,
        '<SavedQuizHistory\b',
        '<SavedQuizHistory' + "`r`n        openHref=`"/study`"",
        1
    )

    Write-NoBom $savedHistorySection $section
    Write-Host "History Open Quiz now points to /study after onOpen runs." -ForegroundColor Green
}
else {
    Write-Host "Could not find SavedQuizHistory usage in SavedHistorySection." -ForegroundColor Red
    $ok = $false
}

Write-Host ""
Write-Host "2/3 Strengthening HIDE_LINE TTS without changing token indexes..." -ForegroundColor Yellow

Write-NoBom $ttsFile @'
import type {
  GeneratedHideLineQuiz,
  GeneratedHideWordQuiz,
  GeneratedQuiz,
} from "@/types/quiz";
import { QUIZ_METHODS } from "@/lib/constants/quiz";
import { normalizeLineEndings } from "@/lib/utils/arabic";

export interface TtsTextToken {
  index: number;
  value: string;
  type: "word" | "whitespace" | "text";
  hidden: boolean;
}

export interface TtsLineOption {
  tokenIndex: number;
  lineNumber: number;
  text: string;
  hidden: boolean;
  speakableText: string;
}

export interface BuildSpeakableTextFromQuizOptions {
  quiz: GeneratedQuiz;
  lineTokenIndex?: number;
}

const WHITESPACE_REGEX = /^\s+$/u;

function splitTextPreservingWhitespace(text: string): string[] {
  return text.split(/(\s+)/u).filter((part) => part.length > 0);
}

export function normalizeSpeakableArabicText(value: string): string {
  return normalizeLineEndings(value)
    .split("\n")
    .map((line) => line.replace(/[ \t\f\v]+/gu, " ").trim())
    .filter((line) => line.length > 0)
    .join("\n")
    .trim();
}

export function getHiddenAnswerValues(quiz: GeneratedQuiz): string[] {
  return quiz.answers
    .map((answer) => answer.answer.trim())
    .filter((answer) => answer.length > 0);
}

export function containsHiddenAnswerText(
  speakableText: string,
  hiddenAnswers: string[],
): boolean {
  const normalizedText = normalizeSpeakableArabicText(speakableText);

  return hiddenAnswers.some((answer) => {
    const normalizedAnswer = normalizeSpeakableArabicText(answer);

    return (
      normalizedAnswer.length > 0 && normalizedText.includes(normalizedAnswer)
    );
  });
}

export function buildTtsWordTokens(quiz: GeneratedHideWordQuiz): TtsTextToken[] {
  const hiddenTokenIndexes = new Set(quiz.selectedTokenIndexes);

  return splitTextPreservingWhitespace(quiz.originalText).map(
    (value, index): TtsTextToken => {
      const isWhitespace = WHITESPACE_REGEX.test(value);

      return {
        index,
        value,
        type: isWhitespace ? "whitespace" : "word",
        hidden: hiddenTokenIndexes.has(index),
      };
    },
  );
}

export function buildSpeakableTextForVisibleWords(
  quiz: GeneratedHideWordQuiz,
): string {
  const visibleText = buildTtsWordTokens(quiz)
    .filter((token) => !token.hidden)
    .map((token) => token.value)
    .join("");

  const speakableText = normalizeSpeakableArabicText(visibleText);

  if (containsHiddenAnswerText(speakableText, getHiddenAnswerValues(quiz))) {
    return "";
  }

  return speakableText;
}

export function buildTtsLineOptions(quiz: GeneratedHideLineQuiz): TtsLineOption[] {
  // HIDE_LINE uses token indexes from the newline-preserving tokenizer:
  // line 1 = 0, line 2 = 2, line 3 = 4, ...
  //
  // Keep that existing contract. As a safety fallback, also trust the
  // tokenIndex stored on hidden-answer records and selectedTokenIndexes.
  const hiddenTokenIndexes = new Set<number>([
    ...quiz.selectedLineIndexes,
    ...quiz.selectedTokenIndexes,
    ...quiz.answers
      .filter((answer) => answer.kind === "line")
      .map((answer) => answer.tokenIndex),
  ]);

  const parts = normalizeLineEndings(quiz.originalText).split(/(\n)/u);
  let lineNumber = 0;

  return parts
    .map((part, tokenIndex): TtsLineOption | null => {
      if (part === "\n" || part.trim().length === 0) {
        return null;
      }

      lineNumber += 1;

      const hidden = hiddenTokenIndexes.has(tokenIndex);
      const speakableText = hidden ? "" : normalizeSpeakableArabicText(part);

      return {
        tokenIndex,
        lineNumber,
        text: part,
        hidden,
        speakableText,
      };
    })
    .filter((line): line is TtsLineOption => line !== null);
}

export function buildSpeakableTextForVisibleLine(
  quiz: GeneratedHideLineQuiz,
  lineTokenIndex: number,
): string {
  const line = buildTtsLineOptions(quiz).find(
    (item) => item.tokenIndex === lineTokenIndex,
  );

  if (!line || line.hidden) {
    return "";
  }

  const speakableText = normalizeSpeakableArabicText(line.speakableText);

  if (containsHiddenAnswerText(speakableText, getHiddenAnswerValues(quiz))) {
    return "";
  }

  return speakableText;
}

export function getFirstVisibleSpeakableLine(
  quiz: GeneratedHideLineQuiz,
): string {
  const firstVisibleLine = buildTtsLineOptions(quiz).find(
    (line) => !line.hidden && line.speakableText.trim().length > 0,
  );

  return firstVisibleLine?.speakableText ?? "";
}

export function buildSpeakableTextFromQuiz({
  quiz,
  lineTokenIndex,
}: BuildSpeakableTextFromQuizOptions): string {
  if (quiz.method === QUIZ_METHODS.HIDE_WORD) {
    return buildSpeakableTextForVisibleWords(quiz);
  }

  if (typeof lineTokenIndex === "number") {
    return buildSpeakableTextForVisibleLine(quiz, lineTokenIndex);
  }

  return getFirstVisibleSpeakableLine(quiz);
}

export function assertSpeakableTextDoesNotLeakHiddenAnswers(
  quiz: GeneratedQuiz,
  speakableText: string,
): boolean {
  if (speakableText.includes("____")) {
    return false;
  }

  return !containsHiddenAnswerText(speakableText, getHiddenAnswerValues(quiz));
}

export function canSpeakQuizText(quiz: GeneratedQuiz): boolean {
  if (quiz.method === QUIZ_METHODS.HIDE_WORD) {
    return buildSpeakableTextForVisibleWords(quiz).trim().length > 0;
  }

  return buildTtsLineOptions(quiz).some(
    (line) => !line.hidden && line.speakableText.trim().length > 0,
  );
}
'@

Write-Host "HIDE_LINE keeps token indexes 0/2/4 and now has extra hidden-token fallbacks." -ForegroundColor Green

Write-Host ""
Write-Host "3/3 Updating regression tests..." -ForegroundColor Yellow

Write-NoBom "apps\web\tests\unit\quiz\history-redirect-and-hide-line-tts-regression.test.tsx" @'
import {
  render,
  screen,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  SavedQuizHistoryItem,
} from "@/components/quiz/SavedQuizHistory";
import {
  buildSpeakableTextForVisibleLine,
  buildTtsLineOptions,
} from "@/lib/quiz/tts-safe-text";
import type {
  SavedQuizRecord,
} from "@/lib/quiz/quiz-history";
import type {
  GeneratedHideLineQuiz,
} from "@/types/quiz";

function createLineQuiz(
  selectedLineIndexes: number[] = [2],
): GeneratedHideLineQuiz {
  return {
    originalText:
      "visible first\nhidden middle\nvisible last",
    quizText:
      "visible first\n____\nvisible last",
    method: "HIDE_LINE",
    requestedCount: 1,
    hiddenCount: 1,
    selectedTokenIndexes: [2],
    selectedLineIndexes,
    answers: [
      {
        index: 1,
        tokenIndex: 2,
        lineIndex: 1,
        answer: "hidden middle",
        kind: "line",
      },
    ],
  };
}

function createSavedRecord(): SavedQuizRecord {
  return {
    id: "saved-1",
    version: 1,
    title: "Saved Quiz",
    quiz: createLineQuiz(),
    createdAt:
      "2026-09-04T00:00:00.000Z",
    updatedAt:
      "2026-09-04T00:00:00.000Z",
  };
}

describe("history redirect and hide-line TTS regressions", () => {
  it("keeps the reusable history item behavior unchanged by default", () => {
    const onOpen = vi.fn();

    render(
      <SavedQuizHistoryItem
        record={createSavedRecord()}
        onOpen={onOpen}
        onDelete={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Open Quiz",
      }),
    ).toBeInTheDocument();
  });

  it("supports a study destination without requiring next/router hooks", () => {
    render(
      <SavedQuizHistoryItem
        record={createSavedRecord()}
        onOpen={vi.fn()}
        onDelete={vi.fn()}
        openHref="/study"
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Open Quiz",
      }),
    ).toHaveAttribute(
      "href",
      "/study",
    );
  });

  it("keeps newline-preserving token indexes for HIDE_LINE", () => {
    const lines =
      buildTtsLineOptions(
        createLineQuiz(),
      );

    expect(
      lines.map(
        (line) =>
          line.tokenIndex,
      ),
    ).toEqual([
      0,
      2,
      4,
    ]);

    expect(lines[1]).toMatchObject({
      tokenIndex: 2,
      hidden: true,
      speakableText: "",
    });

    expect(lines[2]).toMatchObject({
      tokenIndex: 4,
      hidden: false,
      speakableText:
        "visible last",
    });
  });

  it("uses hidden answer tokenIndex as an additional TTS safety fallback", () => {
    const quiz =
      createLineQuiz([]);

    const lines =
      buildTtsLineOptions(quiz);

    expect(lines[1]).toMatchObject({
      tokenIndex: 2,
      hidden: true,
      speakableText: "",
    });

    expect(
      buildSpeakableTextForVisibleLine(
        quiz,
        2,
      ),
    ).toBe("");
  });

  it("still allows visible HIDE_LINE text", () => {
    const quiz =
      createLineQuiz();

    expect(
      buildSpeakableTextForVisibleLine(
        quiz,
        0,
      ),
    ).toBe(
      "visible first",
    );

    expect(
      buildSpeakableTextForVisibleLine(
        quiz,
        4,
      ),
    ).toBe(
      "visible last",
    );
  });
});
'@

if (Test-Path -LiteralPath $b5Test) {
    $b5 = Read-NoBom $b5Test

    if ($b5.Contains('bookId="missing",')) {
        $b5 = $b5.Replace(
            'bookId="missing",',
            'bookId="missing"'
        )

        Write-NoBom $b5Test $b5
        Write-Host "Known B5 JSX comma fixed." -ForegroundColor Green
    }
}

if ($ok) {
    Write-Host ""
    Write-Host "Running focused regression tests..." -ForegroundColor Cyan

    pnpm --filter "@matn-quiz/web" exec vitest run `
      tests/unit/quiz/history-redirect-and-hide-line-tts-regression.test.tsx `
      tests/unit/quiz/tts-safe-text.test.ts `
      tests/unit/components/SavedQuizHistory.test.tsx `
      tests/unit/components/QuizTtsPanel.test.tsx `
      --testTimeout=20000

    if ($LASTEXITCODE -ne 0) {
        $ok = $false
        Write-Host ""
        Write-Host "Focused tests FAILED." -ForegroundColor Red
    }
}

if ($ok) {
    Write-Host ""
    Write-Host "Running History page tests if present..." -ForegroundColor Cyan

    $historyTests = @(
        "tests/unit/pages/HistoryPage.test.tsx",
        "tests/unit/pages/HomePageHistoryFlow.test.tsx",
        "tests/integration/saved-quiz-history-flow.test.tsx"
    ) | Where-Object {
        Test-Path -LiteralPath (
            Join-Path "apps\web" $_
        )
    }

    if ($historyTests.Count -gt 0) {
        Push-Location "apps\web"

        pnpm exec vitest run $historyTests --testTimeout=20000

        $historyExit = $LASTEXITCODE

        Pop-Location

        if ($historyExit -ne 0) {
            $ok = $false
            Write-Host "History regression tests FAILED." -ForegroundColor Red
        }
    }
}

if ($ok) {
    Write-Host ""
    Write-Host "Running production build..." -ForegroundColor Cyan

    pnpm --filter "@matn-quiz/web" build

    if ($LASTEXITCODE -ne 0) {
        $ok = $false
        Write-Host "Production build FAILED." -ForegroundColor Red
    }
}

if ($ok) {
    Remove-Item -LiteralPath $backupDir -Recurse -Force -ErrorAction SilentlyContinue

    Write-Host ""
    Write-Host "=== FIX V2 PASSED ===" -ForegroundColor Green
    Write-Host "History: Open Quiz is wired to /study without putting useRouter in SavedQuizHistory." -ForegroundColor Green
    Write-Host "TTS: HIDE_LINE keeps token indexes and hidden answers remain silent." -ForegroundColor Green

    git add `
      apps/web/components/quiz/SavedQuizHistory.tsx `
      apps/web/components/page/home/SavedHistorySection.tsx `
      apps/web/lib/quiz/tts-safe-text.ts `
      apps/web/tests/unit/quiz/history-redirect-and-hide-line-tts-regression.test.tsx

    if (Test-Path -LiteralPath $b5Test) {
        git add $b5Test
    }

    $pending = git status --porcelain

    if ($pending) {
        git commit -m "fix(web): restore history navigation and hide-line tts safety"
    }
}
else {
    Write-Host ""
    Write-Host "Verification failed. Restoring application source files..." -ForegroundColor Yellow

    Copy-Item -LiteralPath "$backupDir\SavedQuizHistory.tsx" -Destination $historyComponent -Force
    Copy-Item -LiteralPath "$backupDir\SavedHistorySection.tsx" -Destination $savedHistorySection -Force
    Copy-Item -LiteralPath "$backupDir\tts-safe-text.ts" -Destination $ttsFile -Force

    Remove-Item -LiteralPath $backupDir -Recurse -Force -ErrorAction SilentlyContinue

    Write-Host "Source files restored. Send me the new failed output." -ForegroundColor Red
}

Read-Host "Press Enter to close"
