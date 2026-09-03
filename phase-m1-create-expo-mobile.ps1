$ErrorActionPreference = "Stop"

Write-Host "=== Matn Quiz Phase M1 - Create Expo React Native mobile app ===" -ForegroundColor Cyan

if (!(Test-Path "pnpm-workspace.yaml")) {
    Write-Host "ERROR: pnpm-workspace.yaml not found. Run Phase M0 first." -ForegroundColor Red
    exit 1
}

if (!(Test-Path "apps\web\package.json")) {
    Write-Host "ERROR: apps/web/package.json not found. Run Phase M0 first." -ForegroundColor Red
    exit 1
}

if (Test-Path "apps\mobile") {
    Write-Host "ERROR: apps/mobile already exists. Nothing was overwritten." -ForegroundColor Red
    exit 1
}

New-Item -ItemType Directory -Force "apps" | Out-Null

Write-Host ""
Write-Host "Creating Expo SDK 57 app with the default TypeScript + Expo Router template..." -ForegroundColor Cyan

pnpm create expo-app --template default@sdk-57 apps/mobile

if ($LASTEXITCODE -ne 0) {
    throw "create-expo-app failed with exit code $LASTEXITCODE"
}

if (!(Test-Path "apps\mobile\package.json")) {
    throw "Expo project was not created at apps/mobile."
}

$mobilePackage = Get-Content "apps\mobile\package.json" -Raw | ConvertFrom-Json
$mobilePackage.name = "@matn-quiz/mobile"

if ($null -eq $mobilePackage.private) {
    $mobilePackage | Add-Member -NotePropertyName private -NotePropertyValue $true
} else {
    $mobilePackage.private = $true
}

if ($null -eq $mobilePackage.scripts.PSObject.Properties["typecheck"]) {
    $mobilePackage.scripts | Add-Member -NotePropertyName typecheck -NotePropertyValue "tsc --noEmit"
}

$mobilePackage | ConvertTo-Json -Depth 100 | Set-Content "apps\mobile\package.json" -Encoding UTF8

# Add useful root mobile scripts.
$rootPackage = Get-Content "package.json" -Raw | ConvertFrom-Json

function Set-Script {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Value
    )

    $existing = $rootPackage.scripts.PSObject.Properties[$Name]
    if ($null -eq $existing) {
        $rootPackage.scripts | Add-Member -NotePropertyName $Name -NotePropertyValue $Value
    } else {
        $rootPackage.scripts.$Name = $Value
    }
}

Set-Script "dev:mobile" "pnpm --filter @matn-quiz/mobile start"
Set-Script "android" "pnpm --filter @matn-quiz/mobile android"
Set-Script "ios" "pnpm --filter @matn-quiz/mobile ios"
Set-Script "mobile:typecheck" "pnpm --filter @matn-quiz/mobile typecheck"

$rootPackage | ConvertTo-Json -Depth 100 | Set-Content "package.json" -Encoding UTF8

Write-Host ""
Write-Host "Refreshing workspace installation..." -ForegroundColor Cyan
pnpm install

Write-Host ""
Write-Host "Running mobile TypeScript check..." -ForegroundColor Cyan
pnpm --filter "@matn-quiz/mobile" run typecheck

if ($LASTEXITCODE -ne 0) {
    throw "Mobile typecheck failed with exit code $LASTEXITCODE"
}

Write-Host ""
Write-Host "=== Phase M1 PASSED ===" -ForegroundColor Green
Write-Host "React Native / Expo app created at apps/mobile." -ForegroundColor Green
Write-Host ""
Write-Host "Start mobile development server with:" -ForegroundColor Yellow
Write-Host "pnpm run dev:mobile" -ForegroundColor White
Write-Host ""
Write-Host "For Android emulator/device:" -ForegroundColor Yellow
Write-Host "pnpm run android" -ForegroundColor White
Write-Host ""
Write-Host "Next engineering phase: extract packages/quiz-core and reuse quiz logic in web + mobile." -ForegroundColor Cyan
