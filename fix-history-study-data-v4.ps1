$ErrorActionPreference = "Continue"

Write-Host "=== FIX V4: HISTORY QUIZ DATA -> STUDY ROUTE ===" -ForegroundColor Cyan

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
$studyPage = "apps\web\app\study\page.tsx"
$historyRepo = "apps\web\lib\quiz\quiz-history-repository.ts"

foreach ($file in @(
    $historyComponent,
    $savedHistorySection,
    $studyPage,
    $historyRepo
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

$backupDir = "apps\web\.history-route-data-backup"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

Copy-Item -LiteralPath $historyComponent -Destination "$backupDir\SavedQuizHistory.tsx" -Force
Copy-Item -LiteralPath $studyPage -Destination "$backupDir\study-page.tsx" -Force

Write-Host ""
Write-Host "Detecting the existing saved-quiz open handler..." -ForegroundColor Yellow

$section = Read-NoBom $savedHistorySection

$handlerMatch = [regex]::Match(
    $section,
    'onOpen\s*=\s*\{\s*page\.([A-Za-z_][A-Za-z0-9_]*)\s*\}'
)

if (!$handlerMatch.Success) {
    Write-Host "Could not safely detect onOpen={page.<handler>} in SavedHistorySection." -ForegroundColor Red
    Write-Host "No source changes were kept." -ForegroundColor Red

    Remove-Item -LiteralPath $backupDir -Recurse -Force -ErrorAction SilentlyContinue

    Read-Host "Press Enter to close"
    return
}

$openHandler = $handlerMatch.Groups[1].Value

Write-Host "Detected page handler: $openHandler" -ForegroundColor Green

Write-Host ""
Write-Host "1/2 Passing the saved quiz id through the /study URL..." -ForegroundColor Yellow

$history = Read-NoBom $historyComponent

if ($history -match 'savedQuiz=\$\{encodeURIComponent\(record\.id\)\}') {
    Write-Host "Saved quiz id is already included in History link." -ForegroundColor Green
}
elseif ($history.Contains('href={openHref}')) {
    $history = $history.Replace(
        'href={openHref}',
        'href={`${openHref}?savedQuiz=${encodeURIComponent(record.id)}`}'
    )

    Write-NoBom $historyComponent $history
    Write-Host "History now navigates to /study?savedQuiz=<id>." -ForegroundColor Green
}
else {
    Write-Host "Could not find href={openHref} in SavedQuizHistory." -ForegroundColor Red
    $ok = $false
}

if ($ok) {
    Write-Host ""
    Write-Host "2/2 Hydrating the selected saved quiz inside the Study route..." -ForegroundColor Yellow

    $study = Read-NoBom $studyPage

    if ($study -notmatch 'from "react";') {
        $study = $study.Replace(
            '"use client";',
            '"use client";' + "`r`n`r`n" + 'import { useEffect, useRef } from "react";'
        )
    }
    elseif ($study -match 'import\s*\{([^}]*)\}\s*from\s*"react";') {
        $reactImport = [regex]::Match(
            $study,
            'import\s*\{([^}]*)\}\s*from\s*"react";'
        )

        $names = $reactImport.Groups[1].Value

        foreach ($name in @("useEffect", "useRef")) {
            if ($names -notmatch "\b$name\b") {
                $names = ($names.Trim() + ", " + $name)
            }
        }

        $study = $study.Substring(0, $reactImport.Index) +
            "import { $names } from `"react`";" +
            $study.Substring($reactImport.Index + $reactImport.Length)
    }

    if ($study -notmatch 'useSearchParams') {
        $study = $study.Replace(
            'import Link from "next/link";',
            'import Link from "next/link";' + "`r`n" + 'import { useSearchParams } from "next/navigation";'
        )
    }

    if ($study -notmatch 'findSavedQuizRecord') {
        $insertAfter = 'import usePage from "@/hooks/usePage";'

        $study = $study.Replace(
            $insertAfter,
            $insertAfter + "`r`n" + 'import { findSavedQuizRecord } from "@/lib/quiz/quiz-history-repository";'
        )
    }

    $hydrationMarker = "const openedSavedQuizIdRef = useRef<string | null>(null);"

    if ($study.Contains($hydrationMarker)) {
        Write-Host "Study route hydration already exists." -ForegroundColor Green
    }
    else {
        $oldFunctionStart = @'
export default function StudyPage() {
  const page = usePage();
'@

        $newFunctionStart = @"
export default function StudyPage() {
  const page = usePage();
  const searchParams = useSearchParams();
  const openedSavedQuizIdRef = useRef<string | null>(null);
  const savedQuizId = searchParams.get("savedQuiz");

  useEffect(() => {
    if (!savedQuizId || openedSavedQuizIdRef.current === savedQuizId) {
      return;
    }

    const record = findSavedQuizRecord(savedQuizId);

    if (!record) {
      return;
    }

    openedSavedQuizIdRef.current = savedQuizId;
    page.$openHandler(record);
  }, [savedQuizId, page.$openHandler]);
"@

        if ($study.Contains($oldFunctionStart)) {
            $study = $study.Replace(
                $oldFunctionStart,
                $newFunctionStart
            )
        }
        else {
            Write-Host "Could not safely patch StudyPage function start." -ForegroundColor Red
            $ok = $false
        }
    }

    if ($ok) {
        Write-NoBom $studyPage $study
        Write-Host "Study route now loads the selected quiz from browser History storage." -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Creating route-data regression test..." -ForegroundColor Yellow

if ($ok) {
    Write-NoBom "apps\web\tests\unit\quiz\history-route-data-regression.test.ts" @'
import {
  readFileSync,
} from "node:fs";
import {
  resolve,
} from "node:path";

import {
  describe,
  expect,
  it,
} from "vitest";

function source(
  relativePath: string,
): string {
  return readFileSync(
    resolve(
      process.cwd(),
      relativePath,
    ),
    "utf8",
  );
}

describe("History -> Study route data regression", () => {
  it("passes the saved quiz id to the Study route", () => {
    const historySource = source(
      "components/quiz/SavedQuizHistory.tsx",
    );

    expect(historySource).toContain(
      'savedQuiz=${encodeURIComponent(record.id)}',
    );
  });

  it("hydrates the selected saved quiz on the Study route", () => {
    const studySource = source(
      "app/study/page.tsx",
    );

    expect(studySource).toContain(
      "useSearchParams",
    );

    expect(studySource).toContain(
      "findSavedQuizRecord",
    );

    expect(studySource).toContain(
      'searchParams.get("savedQuiz")',
    );

    expect(studySource).toContain(
      "findSavedQuizRecord(savedQuizId)",
    );
  });
});
'@
}

if ($ok) {
    Write-Host ""
    Write-Host "Running focused History/Study tests..." -ForegroundColor Cyan

    pnpm --filter "@matn-quiz/web" exec vitest run `
      tests/unit/quiz/history-route-data-regression.test.ts `
      tests/unit/quiz/history-redirect-and-hide-line-tts-regression.test.tsx `
      tests/unit/components/SavedQuizHistory.test.tsx `
      tests/integration/saved-quiz-history-flow.test.tsx `
      tests/integration/study-session-resume-flow.test.tsx `
      --testTimeout=20000

    if ($LASTEXITCODE -ne 0) {
        $ok = $false
        Write-Host "Focused tests FAILED." -ForegroundColor Red
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
    Write-Host "=== HISTORY ROUTE DATA FIX PASSED ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Expected flow:" -ForegroundColor Cyan
    Write-Host "/history"
    Write-Host "  -> Open Quiz"
    Write-Host "  -> /study?savedQuiz=<saved-id>"
    Write-Host "  -> selected SavedQuizRecord is loaded"
    Write-Host "  -> generated quiz appears on Study page"

    git add `
      apps/web/components/quiz/SavedQuizHistory.tsx `
      apps/web/app/study/page.tsx `
      apps/web/tests/unit/quiz/history-route-data-regression.test.ts

    $pending = git status --porcelain

    if ($pending) {
        git commit -m "fix(web): hydrate saved quiz on study route"
    }
}
else {
    Write-Host ""
    Write-Host "Verification failed. Restoring History and Study source files..." -ForegroundColor Yellow

    Copy-Item -LiteralPath "$backupDir\SavedQuizHistory.tsx" -Destination $historyComponent -Force
    Copy-Item -LiteralPath "$backupDir\study-page.tsx" -Destination $studyPage -Force

    Remove-Item -LiteralPath $backupDir -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath "apps\web\tests\unit\quiz\history-route-data-regression.test.ts" -Force -ErrorAction SilentlyContinue

    Write-Host "Source files restored. Send me the failed output." -ForegroundColor Red
}

Read-Host "Press Enter to close"
