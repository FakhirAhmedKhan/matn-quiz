$ErrorActionPreference = "Continue"

Write-Host "=== BOOK LIBRARY B6 - NAVIGATION + FINAL VERIFICATION ===" -ForegroundColor Cyan

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$ok = $true

function Write-NoBom {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [AllowEmptyString()]
        [Parameter(Mandatory = $true)][string]$Content
    )

    $fullPath = Join-Path (Get-Location) $Path
    $dir = Split-Path $fullPath -Parent

    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Force $dir | Out-Null
    }

    [System.IO.File]::WriteAllText(
        $fullPath,
        $Content,
        $utf8NoBom
    )
}

function Read-NoBom {
    param(
        [Parameter(Mandatory = $true)][string]$Path
    )

    return [System.IO.File]::ReadAllText(
        (Resolve-Path -LiteralPath $Path).Path
    ).TrimStart([char]0xFEFF)
}

function Add-BooksNavItem {
    param(
        [Parameter(Mandatory = $true)][string]$Path
    )

    $content = Read-NoBom $Path

    if (
        $content -match 'href\s*:\s*["'']/books["'']' -or
        $content -match 'href\s*=\s*["'']/books["'']'
    ) {
        Write-Host "Books navigation already exists: $Path" -ForegroundColor Green
        return $true
    }

    $patterns = @(
        '(?ms)(\{\s*[^{}]*?(?:label|name|title)\s*:\s*["'']Poem["''][^{}]*?href\s*:\s*["'']/poem["''][^{}]*?\})',
        '(?ms)(\{\s*[^{}]*?href\s*:\s*["'']/poem["''][^{}]*?(?:label|name|title)\s*:\s*["'']Poem["''][^{}]*?\})'
    )

    foreach ($pattern in $patterns) {
        $match = [regex]::Match($content, $pattern)

        if ($match.Success) {
            $poemItem = $match.Groups[1].Value

            $booksItem = $poemItem
            $booksItem = [regex]::Replace(
                $booksItem,
                '(["''])Poem\1',
                '$1Books$1'
            )
            $booksItem = [regex]::Replace(
                $booksItem,
                '(["''])/poem\1',
                '$1/books$1'
            )

            $replacement = $poemItem + "," + "`r`n" + $booksItem

            $content = $content.Substring(0, $match.Index) +
                $replacement +
                $content.Substring($match.Index + $match.Length)

            Write-NoBom $Path $content

            Write-Host "Added Books navigation: $Path" -ForegroundColor Green
            return $true
        }
    }

    Write-Host "Could not safely locate the Poem navigation item in: $Path" -ForegroundColor Red
    return $false
}

$requiredFiles = @(
    "apps\web\app\books\page.tsx",
    "apps\web\app\books\upload\page.tsx",
    "apps\web\app\books\[bookId]\page.tsx",
    "apps\web\app\books\[bookId]\read\page.tsx",
    "apps\web\components\books\BookReader.tsx",
    "apps\web\components\books\BookDetails.tsx",
    "apps\web\components\books\BookLibrary.tsx",
    "apps\web\components\layout\AppTopNav.tsx",
    "apps\web\components\layout\AppBottomNav.tsx"
)

foreach ($file in $requiredFiles) {
    if (!(Test-Path -LiteralPath $file)) {
        Write-Host "MISSING REQUIRED FILE: $file" -ForegroundColor Red
        $ok = $false
    }
}

if (!$ok) {
    Write-Host ""
    Write-Host "B6 cannot start because required B5/navigation files are missing." -ForegroundColor Red
    Write-Host "Finish B5 first, then rerun B6." -ForegroundColor Yellow
    Read-Host "Press Enter to close"
    return
}

$topNav = "apps\web\components\layout\AppTopNav.tsx"
$bottomNav = "apps\web\components\layout\AppBottomNav.tsx"

$topBackup = "$topNav.b6-backup"
$bottomBackup = "$bottomNav.b6-backup"

Copy-Item -LiteralPath $topNav -Destination $topBackup -Force
Copy-Item -LiteralPath $bottomNav -Destination $bottomBackup -Force

Write-Host ""
Write-Host "Adding Book Library to app navigation..." -ForegroundColor Yellow

$topPatched = Add-BooksNavItem $topNav
$bottomPatched = Add-BooksNavItem $bottomNav

if (!$topPatched -or !$bottomPatched) {
    $ok = $false
}

if ($ok) {
    $bottomContent = Read-NoBom $bottomNav

    if ($bottomContent -match 'grid-cols-6') {
        $bottomContent = $bottomContent.Replace(
            "grid-cols-6",
            "grid-cols-7"
        )

        Write-NoBom $bottomNav $bottomContent

        Write-Host "Updated mobile navigation grid from 6 to 7 columns." -ForegroundColor Green
    }
}

if (!$ok) {
    Copy-Item -LiteralPath $topBackup -Destination $topNav -Force
    Copy-Item -LiteralPath $bottomBackup -Destination $bottomNav -Force

    Remove-Item -LiteralPath $topBackup -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $bottomBackup -Force -ErrorAction SilentlyContinue

    Write-Host ""
    Write-Host "B6 navigation patch was safely rolled back." -ForegroundColor Red
    Write-Host "Send me these two files so I can patch their exact structure:" -ForegroundColor Yellow
    Write-Host "apps/web/components/layout/AppTopNav.tsx"
    Write-Host "apps/web/components/layout/AppBottomNav.tsx"
    Read-Host "Press Enter to close"
    return
}

Write-Host "Creating B6 completion test..." -ForegroundColor Yellow

Write-NoBom "apps\web\tests\unit\books\phase-b6-complete.test.ts" @'
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

describe("Book Library B6 completion", () => {
  it("keeps all Book Library routes", () => {
    expect(
      source("app/books/page.tsx"),
    ).toContain("BookLibrary");

    expect(
      source(
        "app/books/upload/page.tsx",
      ),
    ).toContain("BookUploadForm");

    expect(
      source(
        "app/books/[bookId]/page.tsx",
      ),
    ).toContain("BookDetails");

    expect(
      source(
        "app/books/[bookId]/read/page.tsx",
      ),
    ).toContain("BookReader");
  });

  it("adds Books to desktop navigation", () => {
    const topNav = source(
      "components/layout/AppTopNav.tsx",
    );

    expect(topNav).toContain(
      "/books",
    );

    expect(topNav).toContain(
      "Books",
    );
  });

  it("adds Books to mobile navigation", () => {
    const bottomNav = source(
      "components/layout/AppBottomNav.tsx",
    );

    expect(bottomNav).toContain(
      "/books",
    );

    expect(bottomNav).toContain(
      "Books",
    );
  });

  it("keeps book modules independent from quiz and poem routes", () => {
    const bookPage = source(
      "app/books/page.tsx",
    );

    expect(bookPage).not.toContain(
      "QuranText",
    );

    expect(bookPage).not.toContain(
      "PoemReader",
    );
  });
});
'@

Write-Host "Writing B6 final status document..." -ForegroundColor Yellow

Write-NoBom "apps\web\PHASE-BOOKS-B6-STATUS.md" @'
# Book Library B6 — Final MVP Status

## Goal

Complete the Book Library MVP with navigation integration and final regression verification.

## Completed Book Routes

```txt
/books
/books/upload
/books/[bookId]
/books/[bookId]/read
```

## Completed Flow

```txt
Upload PDF
  -> PENDING
  -> Review Book
  -> Verify Book
  -> VERIFIED
  -> Public Library
  -> Read PDF
```

## Navigation

Book Library is integrated into:

```txt
AppTopNav
AppBottomNav
```

The Book route remains independent from the existing:

```txt
Quiz
Study
Poem
TTS
History
Import/Export
```

## MVP Storage

Files:

```txt
public/uploads/books/files/
public/uploads/books/covers/
```

Metadata:

```txt
In-memory DemoBookRepository
```

## Important Demo Limitation

Restarting the Next.js server clears in-memory book metadata.

Uploaded files can remain on local disk, but they will no longer have matching metadata after the demo repository resets.

This is acceptable for the current local MVP only.

## Production Upgrade

Before treating Book Library as production-ready:

1. Add a persistent database.
2. Add Prisma or another persistent repository implementation.
3. Move files from local `public/uploads` to object storage.
4. Add real authentication and moderator/admin permissions.
5. Protect the Verify action.
6. Add delete/reject/moderation flows.
7. Add malware/file scanning if public uploads are allowed.
8. Add rate limits and upload quotas.

Suggested production storage:

```txt
Cloudflare R2
Amazon S3
Supabase Storage
```

## Verification

B6 verification should run:

```txt
Focused Book Library completion tests
Full web tests
Lint
Production build
```

## Manual Acceptance Flow

```txt
[ ] Open /books/upload
[ ] Upload a real PDF
[ ] Optional cover uploads
[ ] Status shows PENDING
[ ] Open Review & Verify
[ ] Book details load
[ ] Click Verify Book
[ ] Status changes to VERIFIED
[ ] Open /books
[ ] Verified book appears
[ ] Open book details
[ ] Click Read Book
[ ] PDF renders inside /books/[bookId]/read
[ ] Open PDF button works
[ ] Desktop navigation contains Books
[ ] Mobile navigation contains Books
[ ] Existing Quiz pages still work
[ ] Existing Poem pages still work
```

## MVP Phase Status

```txt
B1 Foundation        COMPLETE
B2 Upload            COMPLETE
B3 Public Library    COMPLETE
B4 Verification      COMPLETE
B5 PDF Reader        COMPLETE
B6 Final Polish      COMPLETE
```
'@

Write-Host ""
Write-Host "Running B6 focused tests..." -ForegroundColor Cyan

pnpm --filter "@matn-quiz/web" exec vitest run `
  tests/unit/books/phase-b6-complete.test.ts `
  tests/unit/api/books-route.test.ts `
  tests/unit/api/book-detail-route.test.ts `
  tests/unit/components/BookCard.test.tsx `
  tests/unit/components/BookGrid.test.tsx `
  tests/unit/components/BookLibrary.test.tsx `
  tests/unit/components/BookDetails.test.tsx `
  tests/unit/components/BookVerificationButton.test.tsx `
  tests/unit/components/BookReader.test.tsx `
  tests/unit/pages/BooksPage.test.tsx `
  tests/unit/pages/BookDetailsPage.test.tsx `
  tests/unit/pages/BookReaderPage.test.tsx `
  --testTimeout=20000

if ($LASTEXITCODE -ne 0) {
    $ok = $false
    Write-Host ""
    Write-Host "B6 focused tests FAILED." -ForegroundColor Red
}

if ($ok) {
    Write-Host ""
    Write-Host "Running complete web test suite..." -ForegroundColor Cyan

    pnpm test

    if ($LASTEXITCODE -ne 0) {
        $ok = $false
        Write-Host ""
        Write-Host "Full web test suite FAILED." -ForegroundColor Red
    }
}

if ($ok) {
    Write-Host ""
    Write-Host "Running lint..." -ForegroundColor Cyan

    pnpm --filter "@matn-quiz/web" lint

    if ($LASTEXITCODE -ne 0) {
        $ok = $false
        Write-Host ""
        Write-Host "Lint FAILED." -ForegroundColor Red
    }
}

if ($ok) {
    Write-Host ""
    Write-Host "Running production build..." -ForegroundColor Cyan

    pnpm --filter "@matn-quiz/web" build

    if ($LASTEXITCODE -ne 0) {
        $ok = $false
        Write-Host ""
        Write-Host "Production build FAILED." -ForegroundColor Red
    }
}

if ($ok) {
    Remove-Item -LiteralPath $topBackup -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $bottomBackup -Force -ErrorAction SilentlyContinue

    Write-Host ""
    Write-Host "B6 verification PASSED." -ForegroundColor Green

    git add `
      apps/web/components/layout/AppTopNav.tsx `
      apps/web/components/layout/AppBottomNav.tsx `
      apps/web/tests/unit/books/phase-b6-complete.test.ts `
      apps/web/PHASE-BOOKS-B6-STATUS.md

    $pending = git status --porcelain

    if ($pending) {
        git commit -m "feat(web): complete book library mvp"

        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "B6 committed successfully." -ForegroundColor Green
        }
    }
    else {
        Write-Host "No B6 changes to commit." -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "=== BOOK LIBRARY MVP COMPLETE ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Manual test:" -ForegroundColor Cyan
    Write-Host "1. pnpm dev"
    Write-Host "2. Open http://localhost:3000/books/upload"
    Write-Host "3. Upload PDF"
    Write-Host "4. Review & Verify"
    Write-Host "5. Verify Book"
    Write-Host "6. Open http://localhost:3000/books"
    Write-Host "7. Open verified book"
    Write-Host "8. Click Read Book"
    Write-Host "9. Confirm PDF reader"
}
else {
    Write-Host ""
    Write-Host "B6 verification failed. Restoring navigation files..." -ForegroundColor Yellow

    if (Test-Path -LiteralPath $topBackup) {
        Copy-Item -LiteralPath $topBackup -Destination $topNav -Force
    }

    if (Test-Path -LiteralPath $bottomBackup) {
        Copy-Item -LiteralPath $bottomBackup -Destination $bottomNav -Force
    }

    Remove-Item -LiteralPath $topBackup -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $bottomBackup -Force -ErrorAction SilentlyContinue

    Remove-Item -LiteralPath "apps\web\tests\unit\books\phase-b6-complete.test.ts" -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath "apps\web\PHASE-BOOKS-B6-STATUS.md" -Force -ErrorAction SilentlyContinue

    Write-Host ""
    Write-Host "=== B6 STOPPED - NAVIGATION ROLLED BACK ===" -ForegroundColor Red
    Write-Host "Send me the failed test/lint/build output." -ForegroundColor Yellow
}

Read-Host "Press Enter to close"
