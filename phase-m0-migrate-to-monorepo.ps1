$ErrorActionPreference = "Stop"

Write-Host "=== Matn Quiz Phase M0 - Move existing Next.js app into pnpm monorepo ===" -ForegroundColor Cyan

$root = (Get-Location).Path

if (!(Test-Path (Join-Path $root "package.json"))) {
    Write-Host "ERROR: package.json not found. Run this from the current matn-quiz root." -ForegroundColor Red
    exit 1
}

if (!(Test-Path (Join-Path $root ".git"))) {
    Write-Host "WARNING: .git folder not found. Strongly recommended: commit/backup before migration." -ForegroundColor Yellow
}

$alreadyMonorepo = (Test-Path "apps\web\package.json") -and (Test-Path "pnpm-workspace.yaml")

if ($alreadyMonorepo) {
    Write-Host "Monorepo structure already detected. Skipping file movement." -ForegroundColor Yellow
} else {
    $originalPackageJson = Get-Content "package.json" -Raw | ConvertFrom-Json

    New-Item -ItemType Directory -Force "apps\web" | Out-Null
    New-Item -ItemType Directory -Force "packages" | Out-Null
    New-Item -ItemType Directory -Force "docs" | Out-Null

    # Remove generated caches instead of moving them.
    @(".next", "coverage", ".turbo") | ForEach-Object {
        if (Test-Path $_) {
            Write-Host "Removing generated cache: $_" -ForegroundColor DarkGray
            Remove-Item $_ -Recurse -Force -ErrorAction SilentlyContinue
        }
    }

    function Move-IntoWeb {
        param([Parameter(Mandatory = $true)][string]$Path)

        if (!(Test-Path $Path)) {
            return
        }

        $name = Split-Path $Path -Leaf
        $destination = Join-Path "apps\web" $name

        if (Test-Path $destination) {
            Write-Host "SKIP (destination exists): $Path" -ForegroundColor Yellow
            return
        }

        Write-Host "Moving $Path -> $destination" -ForegroundColor Gray
        Move-Item $Path $destination
    }

    # Main application/source folders.
    @(
        "app",
        "src",
        "components",
        "hooks",
        "lib",
        "public",
        "tests",
        "types",
        "styles",
        "store",
        "services",
        "theme",
        "scripts"
    ) | ForEach-Object { Move-IntoWeb $_ }

    # Web configuration files.
    @(
        "package.json",
        "tsconfig.json",
        "next-env.d.ts",
        "next.config.js",
        "next.config.mjs",
        "next.config.ts",
        "postcss.config.js",
        "postcss.config.mjs",
        "postcss.config.cjs",
        "eslint.config.js",
        "eslint.config.mjs",
        "eslint.config.cjs",
        "vitest.config.ts",
        "vitest.config.js",
        "vitest.config.mts",
        "playwright.config.ts",
        "playwright.config.js",
        "components.json",
        "middleware.ts",
        "instrumentation.ts",
        ".env.local",
        ".env.local.example",
        ".env.example",
        ".env.test",
        ".env.test.local"
    ) | ForEach-Object { Move-IntoWeb $_ }

    if (!(Test-Path "apps\web\package.json")) {
        throw "Migration stopped: apps/web/package.json was not created."
    }

    # Rename the existing web package.
    $webPackage = Get-Content "apps\web\package.json" -Raw | ConvertFrom-Json
    $webPackage.name = "@matn-quiz/web"

    if ($null -eq $webPackage.private) {
        $webPackage | Add-Member -NotePropertyName private -NotePropertyValue $true
    } else {
        $webPackage.private = $true
    }

    $webPackage | ConvertTo-Json -Depth 100 | Set-Content "apps\web\package.json" -Encoding UTF8

    $packageManager = $originalPackageJson.packageManager
    if ([string]::IsNullOrWhiteSpace($packageManager)) {
        $packageManager = "pnpm@10.0.0"
    }

    $rootPackage = [ordered]@{
        name = "matn-quiz"
        version = "0.1.0"
        private = $true
        packageManager = $packageManager
        scripts = [ordered]@{
            dev = "pnpm --filter @matn-quiz/web dev"
            "dev:web" = "pnpm --filter @matn-quiz/web dev"
            test = "pnpm -r --if-present test"
            "test:web" = "pnpm --filter @matn-quiz/web test"
            build = "pnpm -r --if-present build"
            "build:web" = "pnpm --filter @matn-quiz/web build"
            lint = "pnpm -r --if-present lint"
            "lint:web" = "pnpm --filter @matn-quiz/web lint"
            "typecheck:web" = "pnpm --filter @matn-quiz/web typecheck"
        }
    }

    $rootPackage | ConvertTo-Json -Depth 20 | Set-Content "package.json" -Encoding UTF8

@'
packages:
  - "apps/*"
  - "packages/*"
'@ | Set-Content "pnpm-workspace.yaml" -Encoding UTF8

    Write-Host ""
    Write-Host "Monorepo files created." -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Structure ===" -ForegroundColor Cyan
Write-Host "apps/web      -> Next.js web app"
Write-Host "apps/mobile   -> will be created in Phase M1"
Write-Host "packages      -> shared packages later (quiz-core, shared-types, design-tokens)"
Write-Host "docs          -> project/mobile docs"

Write-Host ""
Write-Host "Installing workspace dependencies..." -ForegroundColor Cyan
pnpm install

$webPackage = Get-Content "apps\web\package.json" -Raw | ConvertFrom-Json

function Invoke-WebScriptIfPresent {
    param([string]$ScriptName)

    $property = $webPackage.scripts.PSObject.Properties[$ScriptName]
    if ($null -ne $property) {
        Write-Host ""
        Write-Host "Running web $ScriptName..." -ForegroundColor Cyan
        pnpm --filter "@matn-quiz/web" run $ScriptName
        if ($LASTEXITCODE -ne 0) {
            throw "Web $ScriptName failed with exit code $LASTEXITCODE"
        }
    } else {
        Write-Host "Skipping missing web script: $ScriptName" -ForegroundColor DarkGray
    }
}

Invoke-WebScriptIfPresent "test"
Invoke-WebScriptIfPresent "build"
Invoke-WebScriptIfPresent "lint"
Invoke-WebScriptIfPresent "typecheck"

Write-Host ""
Write-Host "=== Phase M0 PASSED ===" -ForegroundColor Green
Write-Host "Existing Next.js app is now under apps/web and pnpm workspace is active." -ForegroundColor Green
Write-Host ""
Write-Host "Next: run the Phase M1 mobile creation script." -ForegroundColor Yellow
