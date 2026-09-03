$ErrorActionPreference = "Continue"

Write-Host "=== ADD BOOKS TO MAIN NAVIGATION ===" -ForegroundColor Cyan

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$files = @(
    "apps\web\components\layout\AppTopNav.tsx",
    "apps\web\components\layout\AppBottomNav.tsx"
)

function Read-NoBom([string]$path) {
    return [System.IO.File]::ReadAllText((Resolve-Path $path).Path).TrimStart([char]0xFEFF)
}

function Write-NoBom([string]$path, [string]$content) {
    [System.IO.File]::WriteAllText((Resolve-Path $path).Path, $content, $utf8NoBom)
}

foreach ($file in $files) {
    if (!(Test-Path $file)) {
        Write-Host "Missing: $file" -ForegroundColor Red
        continue
    }

    $content = Read-NoBom $file

    if ($content -match 'href\s*:\s*["'']/books["'']' -or $content -match 'href\s*=\s*["'']/books["'']') {
        Write-Host "Books already exists in: $file" -ForegroundColor Green
        continue
    }

    $patterns = @(
        '(?ms)(\{\s*[^{}]*?(?:label|name|title)\s*:\s*["'']Poem["''][^{}]*?href\s*:\s*["'']/poem["''][^{}]*?\})',
        '(?ms)(\{\s*[^{}]*?href\s*:\s*["'']/poem["''][^{}]*?(?:label|name|title)\s*:\s*["'']Poem["''][^{}]*?\})'
    )

    $patched = $false

    foreach ($pattern in $patterns) {
        $match = [regex]::Match($content, $pattern)

        if ($match.Success) {
            $poemItem = $match.Groups[1].Value
            $booksItem = $poemItem
            $booksItem = [regex]::Replace($booksItem, '(["''])Poem\1', '$1Books$1')
            $booksItem = [regex]::Replace($booksItem, '(["''])/poem\1', '$1/books$1')

            $replacement = $poemItem + "," + "`r`n" + $booksItem

            $content = $content.Substring(0, $match.Index) +
                $replacement +
                $content.Substring($match.Index + $match.Length)

            if ($file -like "*AppBottomNav.tsx" -and $content -match "grid-cols-6") {
                $content = $content.Replace("grid-cols-6", "grid-cols-7")
            }

            Write-NoBom $file $content
            Write-Host "Added Books to: $file" -ForegroundColor Green
            $patched = $true
            break
        }
    }

    if (!$patched) {
        Write-Host "Could not auto-patch: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Running production build..." -ForegroundColor Cyan
pnpm --filter "@matn-quiz/web" build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Navigation update PASSED." -ForegroundColor Green
    Write-Host "Open: http://localhost:3000/books" -ForegroundColor Cyan
    Write-Host "Books should now appear in the main navigation." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Build failed. Send me the error output." -ForegroundColor Red
}

Read-Host "Press Enter to close"
