$ErrorActionPreference = "Continue"

Write-Host "=== FIX HISTORY REDIRECT + HIDE-LINE TTS SAFETY ===" -ForegroundColor Cyan

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

$historyFile = "apps\web\components\quiz\SavedQuizHistory.tsx"
$ttsFile = "apps\web\lib\quiz\tts-safe-text.ts"
$b5Test = "apps\web\tests\unit\components\BookReader.test.tsx"

foreach ($file in @($historyFile, $ttsFile)) {
    if (!(Test-Path -LiteralPath $file)) {
        Write-Host "MISSING: $file" -ForegroundColor Red
        $ok = $false
    }
}

if (!$ok) {
    Write-Host "Required files are missing. No changes made." -ForegroundColor Red
    Read-Host "Press Enter to close"
    return
}

$historyBackup = "$historyFile.bugfix-backup"
$ttsBackup = "$ttsFile.bugfix-backup"

Copy-Item -LiteralPath $historyFile -Destination $historyBackup -Force
Copy-Item -LiteralPath $ttsFile -Destination $ttsBackup -Force

Write-Host ""
Write-Host "Fixing History -> Open Quiz -> /study..." -ForegroundColor Yellow

$history = Read-NoBom $historyFile

if ($history -notmatch 'import \{ useRouter \} from "next/navigation";') {
    $history = $history.Replace(
        '"use client";',
        '"use client";' + "`r`n`r`n" + 'import { useRouter } from "next/navigation";'
    )
}

$functionPattern = 'export function SavedQuizHistoryItem\(\{\s*record,\s*onOpen,\s*onDelete,\s*disabled = false,\s*\}: SavedQuizHistoryItemProps\) \{'

if ($history -match $functionPattern -and $history -notmatch 'const router = useRouter\(\);') {
    $history = [regex]::Replace(
        $history,
        $functionPattern,
        {
            param($m)
            $m.Value + "`r`n  const router = useRouter();"
        },
        1
    )
}

$oldClick = 'onClick={() => onOpen(record)}'
$newClick = @'
onClick={() => {
              onOpen(record);
              router.push("/study");
            }}
'@.TrimEnd()

if ($history.Contains($oldClick)) {
    $history = $history.Replace($oldClick, $newClick)
} elseif ($history -notmatch 'router\.push\("/study"\)') {
    Write-Host "Could not find Open Quiz click handler safely." -ForegroundColor Red
    $ok = $false
}

if ($ok) {
    Write-NoBom $historyFile $history
    Write-Host "History redirect fixed." -ForegroundColor Green
}

Write-Host ""
Write-Host "Fixing Hide Lines TTS indexing + hidden-answer safety..." -ForegroundColor Yellow

$tts = Read-NoBom $ttsFile

$replacement = @'
export function buildTtsLineOptions(quiz: GeneratedHideLineQuiz): TtsLineOption[] {
  const hiddenLineIndexes = new Set(quiz.selectedLineIndexes);
  const hiddenAnswers = new Set(
    getHiddenAnswerValues(quiz).map(normalizeSpeakableArabicText),
  );

  const lines = normalizeLineEndings(quiz.originalText).split("\n");

  return lines
    .map((text, lineIndex): TtsLineOption | null => {
      if (text.trim().length === 0) {
        return null;
      }

      const normalizedLine = normalizeSpeakableArabicText(text);

      // selectedLineIndexes is line-based. Hidden-answer matching is also
      // applied as a fail-safe so a hidden line can never reach TTS even if
      // legacy/generated index metadata is inconsistent.
      const hidden =
        hiddenLineIndexes.has(lineIndex) ||
        hiddenAnswers.has(normalizedLine);

      const speakableText = hidden ? "" : normalizedLine;

      return {
        tokenIndex: lineIndex,
        lineNumber: lineIndex + 1,
        text,
        hidden,
        speakableText,
      };
    })
    .filter((line): line is TtsLineOption => line !== null);
}
'@

$functionRegex = '(?s)export function buildTtsLineOptions\(quiz: GeneratedHideLineQuiz\): TtsLineOption\[\] \{.*?\r?\n\}\r?\n\r?\nexport function buildSpeakableTextForVisibleLine'

if ([regex]::IsMatch($tts, $functionRegex)) {
    $tts = [regex]::Replace(
        $tts,
        $functionRegex,
        $replacement + "`r`nexport function buildSpeakableTextForVisibleLine",
        1
    )

    Write-NoBom $ttsFile $tts
    Write-Host "Hide-line TTS safety fixed." -ForegroundColor Green
} else {
    Write-Host "Could not locate buildTtsLineOptions safely." -ForegroundColor Red
    $ok = $false
}

if (Test-Path -LiteralPath $b5Test) {
    $b5 = Read-NoBom $b5Test

    if ($b5.Contains('bookId="missing",')) {
        $b5 = $b5.Replace('bookId="missing",', 'bookId="missing"')
        Write-NoBom $b5Test $b5
        Write-Host "Also fixed the known B5 test JSX comma." -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Creating regression tests..." -ForegroundColor Yellow

Write-NoBom "apps\web\tests\unit\quiz\history-redirect-and-hide-line-tts-regression.test.tsx" @'
import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  beforeEach,
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
  GeneratedHideLineQuiz,
} from "@/types/quiz";
import type {
  SavedQuizRecord,
} from "@/lib/quiz/quiz-history";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

function hideLineQuiz(): GeneratedHideLineQuiz {
  return {
    method: "HIDE_LINE",
    originalText: [
      "visible first line",
      "hidden middle line",
      "visible last line",
    ].join("\n"),
    quizText: [
      "visible first line",
      "____",
      "visible last line",
    ].join("\n"),
    requestedCount: 1,
    hiddenCount: 1,
    answers: [
      {
        index: 1,
        answer: "hidden middle line",
        kind: "line",
      },
    ],
    selectedTokenIndexes: [1],
    selectedLineIndexes: [1],
  };
}

function savedRecord(): SavedQuizRecord {
  return {
    id: "saved-1",
    version: 1,
    title: "Saved Quiz",
    quiz: hideLineQuiz(),
    createdAt: "2026-09-04T00:00:00.000Z",
    updatedAt: "2026-09-04T00:00:00.000Z",
  };
}

describe("history redirect and hide-line TTS regressions", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("opens the saved quiz before navigating to study", () => {
    const onOpen = vi.fn();

    render(
      <SavedQuizHistoryItem
        record={savedRecord()}
        onOpen={onOpen}
        onDelete={vi.fn()}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Open Quiz",
      }),
    );

    expect(onOpen).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "saved-1",
      }),
    );

    expect(push).toHaveBeenCalledWith(
      "/study",
    );

    expect(
      onOpen.mock.invocationCallOrder[0],
    ).toBeLessThan(
      push.mock.invocationCallOrder[0],
    );
  });

  it("marks the actual hidden middle line as hidden", () => {
    const lines =
      buildTtsLineOptions(
        hideLineQuiz(),
      );

    expect(lines).toHaveLength(3);

    expect(lines[0]).toMatchObject({
      lineNumber: 1,
      hidden: false,
      speakableText:
        "visible first line",
    });

    expect(lines[1]).toMatchObject({
      lineNumber: 2,
      hidden: true,
      speakableText: "",
    });

    expect(lines[2]).toMatchObject({
      lineNumber: 3,
      hidden: false,
      speakableText:
        "visible last line",
    });
  });

  it("never returns hidden line text as speakable audio", () => {
    const quiz = hideLineQuiz();

    expect(
      buildSpeakableTextForVisibleLine(
        quiz,
        1,
      ),
    ).toBe("");

    const allSpeakable =
      buildTtsLineOptions(quiz)
        .map(
          (line) =>
            line.speakableText,
        )
        .join("\n");

    expect(allSpeakable).not.toContain(
      "hidden middle line",
    );
  });

  it("keeps visible lines speakable", () => {
    const quiz = hideLineQuiz();

    expect(
      buildSpeakableTextForVisibleLine(
        quiz,
        0,
      ),
    ).toBe(
      "visible first line",
    );

    expect(
      buildSpeakableTextForVisibleLine(
        quiz,
        2,
      ),
    ).toBe(
      "visible last line",
    );
  });
});
'@

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
        Write-Host "Focused regression tests FAILED." -ForegroundColor Red
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
    Remove-Item -LiteralPath $historyBackup -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $ttsBackup -Force -ErrorAction SilentlyContinue

    Write-Host ""
    Write-Host "=== BOTH BUGS FIXED ===" -ForegroundColor Green
    Write-Host "History: Open Quiz now restores then navigates to /study." -ForegroundColor Green
    Write-Host "Hide Lines: hidden lines are excluded from TTS." -ForegroundColor Green

    git add `
      apps/web/components/quiz/SavedQuizHistory.tsx `
      apps/web/lib/quiz/tts-safe-text.ts `
      apps/web/tests/unit/quiz/history-redirect-and-hide-line-tts-regression.test.tsx

    if (Test-Path -LiteralPath $b5Test) {
        git add $b5Test
    }

    $pending = git status --porcelain

    if ($pending) {
        git commit -m "fix(web): redirect saved quizzes and secure hide-line audio"
    }
} else {
    Write-Host ""
    Write-Host "Fix verification failed. Restoring source backups..." -ForegroundColor Yellow

    if (Test-Path -LiteralPath $historyBackup) {
        Copy-Item -LiteralPath $historyBackup -Destination $historyFile -Force
    }

    if (Test-Path -LiteralPath $ttsBackup) {
        Copy-Item -LiteralPath $ttsBackup -Destination $ttsFile -Force
    }

    Remove-Item -LiteralPath $historyBackup -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $ttsBackup -Force -ErrorAction SilentlyContinue

    Write-Host "Source files restored. Send me the failed output." -ForegroundColor Red
}

Read-Host "Press Enter to close"
