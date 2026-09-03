$ErrorActionPreference = "Stop"

Write-Host "=== Matn Quiz monorepo quick repair: mobile typecheck + web hero tests ===" -ForegroundColor Cyan

if (!(Test-Path "package.json")) {
  Write-Host "ERROR: Run this from C:\Users\Dell\OneDrive\Desktop\Programs\matn-quiz" -ForegroundColor Red
  exit 1
}

if (!(Test-Path "apps\web")) {
  Write-Host "ERROR: apps/web not found." -ForegroundColor Red
  exit 1
}

if (!(Test-Path "apps\mobile")) {
  Write-Host "ERROR: apps/mobile not found." -ForegroundColor Red
  exit 1
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Write-NoBom {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Content
  )
  $fullPath = Join-Path (Get-Location) $Path
  $dir = Split-Path $fullPath -Parent
  if (!(Test-Path $dir)) {
    New-Item -ItemType Directory -Force $dir | Out-Null
  }
  [System.IO.File]::WriteAllText($fullPath, $Content, $utf8NoBom)
}

Write-Host ""
Write-Host "1) Fixing Expo mobile CSS type declarations..." -ForegroundColor Yellow

Write-NoBom "apps\mobile\src\types\css.d.ts" @'
declare module "*.css";
declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}
declare module "@/global.css";
'@

# The Expo template references this file from animated-icon.web.tsx.
if (!(Test-Path "apps\mobile\src\components\animated-icon.module.css")) {
  Write-NoBom "apps\mobile\src\components\animated-icon.module.css" @'
.icon {
  display: inline-flex;
}
'@
}

Write-Host "Mobile CSS declarations added." -ForegroundColor Green

Write-Host ""
Write-Host "2) Fixing web app hero eyebrow expected by layout tests..." -ForegroundColor Yellow

$heroCandidates = Get-ChildItem -Path "apps\web" -Recurse -File -Include "*.tsx" |
  Where-Object {
    $_.FullName -notmatch "\\node_modules\\|\\.next\\|\\coverage\\" -and
    (Select-String -Path $_.FullName -Pattern 'data-testid="app-hero-title"' -Quiet)
  }

if ($heroCandidates.Count -eq 0) {
  throw 'Could not find web hero component containing data-testid="app-hero-title".'
}

foreach ($file in $heroCandidates) {
  $relative = Resolve-Path -Relative $file.FullName
  $content = [System.IO.File]::ReadAllText($file.FullName)

  if ($content -match 'data-testid="app-hero-eyebrow"') {
    Write-Host "Already has eyebrow: $relative" -ForegroundColor DarkGray
    continue
  }

  $eyebrow = @'
      <p
        data-testid="app-hero-eyebrow"
        className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700"
      >
        Phase 19.5
      </p>

'@

  $pattern = '(?s)(\s*<h1\s+[^>]*data-testid="app-hero-title")'
  if ($content -match $pattern) {
    $updated = [regex]::Replace($content, $pattern, "`r`n$eyebrow`$1", 1)
    [System.IO.File]::WriteAllText($file.FullName, $updated, $utf8NoBom)
    Write-Host "Patched eyebrow in: $relative" -ForegroundColor Green
  }
}

Write-Host ""
Write-Host "3) Verifying mobile typecheck..." -ForegroundColor Cyan
pnpm --filter "@matn-quiz/mobile" run typecheck
if ($LASTEXITCODE -ne 0) {
  throw "Mobile typecheck failed."
}

Write-Host ""
Write-Host "4) Verifying focused web failing tests..." -ForegroundColor Cyan
pnpm --filter "@matn-quiz/web" test tests/unit/layout/AppResponsiveLayout.test.tsx tests/unit/pages/HomePageDeploymentReadiness.test.tsx tests/unit/pages/HomePageMobileLayout.test.tsx tests/unit/pages/HomePageSections.test.tsx
if ($LASTEXITCODE -ne 0) {
  throw "Focused web tests failed."
}

Write-Host ""
Write-Host "5) Running full web tests..." -ForegroundColor Cyan
pnpm --filter "@matn-quiz/web" test
if ($LASTEXITCODE -ne 0) {
  throw "Full web tests failed."
}

Write-Host ""
Write-Host "=== Repair passed ===" -ForegroundColor Green
Write-Host "Mobile typecheck passed and web tests passed." -ForegroundColor Green
Write-Host ""
Write-Host "Start mobile with:" -ForegroundColor Yellow
Write-Host "pnpm run dev:mobile" -ForegroundColor White
