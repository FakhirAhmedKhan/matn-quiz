$ErrorActionPreference = "Continue"

Write-Host "=== FIX STALE TESTS + TEST ISOLATION AFTER UI/WORKFLOW CHANGES ===" -ForegroundColor Cyan

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$ok = $true

function Read-NoBom {
    param([Parameter(Mandatory = $true)][string]$Path)
    return [System.IO.File]::ReadAllText((Resolve-Path -LiteralPath $Path).Path).TrimStart([char]0xFEFF)
}

function Write-NoBom {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [AllowEmptyString()]
        [Parameter(Mandatory = $true)][string]$Content
    )
    $full = if (Test-Path -LiteralPath $Path) {
        (Resolve-Path -LiteralPath $Path).Path
    } else {
        Join-Path (Get-Location) $Path
    }
    $dir = Split-Path $full -Parent
    if (!(Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    [System.IO.File]::WriteAllText($full, $Content, $utf8NoBom)
}

$root = (Get-Location).Path
$backupRoot = "apps\web\.test-alignment-backup"

$filesToBackup = @(
    "apps\web\components\layout\AppTopNav.tsx",
    "apps\web\components\layout\AppBottomNav.tsx",
    "apps\web\components\poem\PoemInputForm.tsx",
    "apps\web\tests\setup.ts",
    "apps\web\tests\unit\layout\AppNavigationResponsivePolish.test.tsx",
    "apps\web\tests\unit\layout\AppNavigationShell.test.tsx",
    "apps\web\tests\unit\pages\HomeLandingPage.test.tsx",
    "apps\web\tests\unit\pages\HomePageArchitecture.test.ts",
    "apps\web\tests\unit\pages\MultiPageWorkflowArchitecture.test.tsx",
    "apps\web\tests\unit\quiz\history-redirect-and-hide-line-tts-regression.test.tsx"
)

foreach ($file in $filesToBackup) {
    if (!(Test-Path -LiteralPath $file)) {
        Write-Host "Missing required file: $file" -ForegroundColor Red
        $ok = $false
    }
}

if (!$ok) {
    Write-Host "Stopped before changing files." -ForegroundColor Red
    Read-Host "Press Enter to close"
    return
}

New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null
foreach ($file in $filesToBackup) {
    $relative = $file.Replace("apps\web\", "").Replace("\", "__")
    Copy-Item -LiteralPath $file -Destination (Join-Path $backupRoot $relative) -Force
}

Write-Host ""
Write-Host "1/5 Fixing Books navigation IDs and mobile grid..." -ForegroundColor Yellow

$top = Read-NoBom "apps\web\components\layout\AppTopNav.tsx"
$top = [regex]::Replace(
    $top,
    'data-testid="top-nav-poem"(?=[\s\S]{0,180}?href="/books")',
    'data-testid="top-nav-books"',
    1
)
Write-NoBom "apps\web\components\layout\AppTopNav.tsx" $top

$bottom = Read-NoBom "apps\web\components\layout\AppBottomNav.tsx"
$bottom = [regex]::Replace(
    $bottom,
    'data-testid="bottom-nav-poem"(?=[\s\S]{0,220}?href="/books")',
    'data-testid="bottom-nav-books"',
    1
)
$bottom = $bottom.Replace("grid-cols-7", "grid-cols-6")
Write-NoBom "apps\web\components\layout\AppBottomNav.tsx" $bottom

Write-Host "Books now has unique top-nav-books / bottom-nav-books IDs." -ForegroundColor Green

Write-Host ""
Write-Host "2/5 Aligning navigation/home tests with Books replacing Import / Export..." -ForegroundColor Yellow

$testFiles = @(
    "apps\web\tests\unit\layout\AppNavigationResponsivePolish.test.tsx",
    "apps\web\tests\unit\layout\AppNavigationShell.test.tsx",
    "apps\web\tests\unit\pages\HomeLandingPage.test.tsx",
    "apps\web\tests\unit\pages\HomePageArchitecture.test.ts",
    "apps\web\tests\unit\pages\MultiPageWorkflowArchitecture.test.tsx"
)

foreach ($file in $testFiles) {
    $c = Read-NoBom $file
    $c = $c.Replace("top-nav-import-export", "top-nav-books")
    $c = $c.Replace("bottom-nav-share", "bottom-nav-books")
    $c = $c.Replace("home-import-export-workflow-link", "home-books-workflow-link")
    $c = $c.Replace("/import-export", "/books")
    $c = $c.Replace("Import / Export", "Books")
    Write-NoBom $file $c
}

# History now uses the persisted workflow draft; query-string transport is no longer required.
$historyTest = "apps\web\tests\unit\quiz\history-redirect-and-hide-line-tts-regression.test.tsx"
$historyTestContent = Read-NoBom $historyTest
$historyTestContent = $historyTestContent.Replace(
    '"/study?savedQuiz=saved-1"',
    '"/study"'
)
Write-NoBom $historyTest $historyTestContent

Write-Host "Stale route expectations updated." -ForegroundColor Green

Write-Host ""
Write-Host "3/5 Restoring accessible Poem field labels..." -ForegroundColor Yellow

$poem = Read-NoBom "apps\web\components\poem\PoemInputForm.tsx"

$poem = [regex]::Replace(
    $poem,
    '(<label[^>]*for="poem-title"[^>]*>\s*)Title(\s*</label>)',
    '$1Poem title$2',
    1
)
$poem = [regex]::Replace(
    $poem,
    '(<label[^>]*for="poem-text"[^>]*>\s*)Text(\s*</label>)',
    '$1Poem text$2',
    1
)

Write-NoBom "apps\web\components\poem\PoemInputForm.tsx" $poem
Write-Host "Poem title / Poem text labels restored." -ForegroundColor Green

Write-Host ""
Write-Host "4/5 Isolating quiz wizard sessionStorage between tests..." -ForegroundColor Yellow

$setupFile = "apps\web\tests\setup.ts"
$setup = Read-NoBom $setupFile

if ($setup -notmatch 'beforeEachQuizWorkflowDraft') {
    $setup += @'

import { beforeEach as beforeEachQuizWorkflowDraft } from "vitest";

beforeEachQuizWorkflowDraft(() => {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem("matn-quiz:quiz-workflow-draft:v1");
  }
});
'@
    Write-NoBom $setupFile $setup
}

Write-Host "Quiz workflow draft is now cleared before each independent test." -ForegroundColor Green

Write-Host ""
Write-Host "5/5 Running focused regression tests..." -ForegroundColor Yellow

pnpm --filter "@matn-quiz/web" exec vitest run `
  tests/integration/hide-count-selection-flow.test.tsx `
  tests/integration/quiz-method-selection-flow.test.tsx `
  tests/unit/pages/HomePage.test.tsx `
  tests/unit/pages/HomePageHistoryFlow.test.tsx `
  tests/unit/components/PoemInputForm.test.tsx `
  tests/integration/poem-reader-flow.test.tsx `
  tests/unit/pages/PoemInputAndReaderPages.test.tsx `
  tests/unit/layout/AppNavigationResponsivePolish.test.tsx `
  tests/unit/layout/AppNavigationShell.test.tsx `
  tests/unit/pages/HomeLandingPage.test.tsx `
  tests/unit/pages/HomePageArchitecture.test.ts `
  tests/unit/pages/MultiPageWorkflowArchitecture.test.tsx `
  tests/unit/pages/PoemRoutes.test.tsx `
  tests/unit/quiz/history-redirect-and-hide-line-tts-regression.test.tsx `
  --testTimeout=20000

if ($LASTEXITCODE -ne 0) {
    $ok = $false
    Write-Host "Focused regression tests FAILED." -ForegroundColor Red
}

if ($ok) {
    Write-Host ""
    Write-Host "Running full web suite..." -ForegroundColor Cyan
    pnpm --filter "@matn-quiz/web" test

    if ($LASTEXITCODE -ne 0) {
        $ok = $false
        Write-Host "Full web suite FAILED." -ForegroundColor Red
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
    Remove-Item -LiteralPath $backupRoot -Recurse -Force -ErrorAction SilentlyContinue

    Write-Host ""
    Write-Host "=== TEST ALIGNMENT PASSED ===" -ForegroundColor Green
    Write-Host "The failures were stale expectations + sessionStorage test leakage, plus duplicate Books test IDs." -ForegroundColor Green

    git add `
      apps/web/components/layout/AppTopNav.tsx `
      apps/web/components/layout/AppBottomNav.tsx `
      apps/web/components/poem/PoemInputForm.tsx `
      apps/web/tests/setup.ts `
      apps/web/tests/unit/layout/AppNavigationResponsivePolish.test.tsx `
      apps/web/tests/unit/layout/AppNavigationShell.test.tsx `
      apps/web/tests/unit/pages/HomeLandingPage.test.tsx `
      apps/web/tests/unit/pages/HomePageArchitecture.test.ts `
      apps/web/tests/unit/pages/MultiPageWorkflowArchitecture.test.tsx `
      apps/web/tests/unit/quiz/history-redirect-and-hide-line-tts-regression.test.tsx

    if (git status --porcelain) {
        git commit -m "test(web): align suite with books nav and persisted quiz workflow"
    }
}
else {
    Write-Host ""
    Write-Host "Verification failed. Restoring changed files..." -ForegroundColor Yellow

    foreach ($file in $filesToBackup) {
        $relative = $file.Replace("apps\web\", "").Replace("\", "__")
        $backupFile = Join-Path $backupRoot $relative
        if (Test-Path -LiteralPath $backupFile) {
            Copy-Item -LiteralPath $backupFile -Destination $file -Force
        }
    }

    Remove-Item -LiteralPath $backupRoot -Recurse -Force -ErrorAction SilentlyContinue

    Write-Host "Files restored. Send me only the new FAILED sections." -ForegroundColor Red
}

Read-Host "Press Enter to close"
