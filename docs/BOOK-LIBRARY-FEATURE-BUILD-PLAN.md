# Book Library Feature — Simple Build Plan

## Goal

Add a new **Book Library** feature to Matn Quiz where users can:

- Upload books
- Save book files locally for the MVP
- Verify uploaded books with a simple button
- Show verified books publicly
- Open a book details page
- Read PDF books in the browser

Keep this feature separate from the existing Quiz, Poem, TTS, History, and Import/Export features.

## Routes

```txt
/books
/books/upload
/books/[bookId]
/books/[bookId]/read
```

## Phase B1 — Foundation

Create the Book feature foundation.

```txt
apps/web/lib/books/book-types.ts
apps/web/lib/books/book-validation.ts
apps/web/lib/books/book-storage.ts
apps/web/lib/books/book-repository.ts
apps/web/lib/books/demo-book-repository.ts
```

Add:

- Book TypeScript types
- `PENDING`, `VERIFIED`, `REJECTED` status
- Validation rules
- Local storage abstraction
- Demo repository
- Prisma repository abstraction
- `BOOKS_DEMO_MODE=true`

Add a Prisma `Book` model containing:

```txt
id
title
author
description
category
language
coverUrl
fileUrl
fileName
mimeType
fileSize
status
verifiedAt
createdAt
updatedAt
```

## Phase B2 — Book Upload

Create:

```txt
/books/upload
```

Form fields:

- Book title
- Author
- Description
- Category
- Language
- Cover image
- PDF file

For the MVP, store files under:

```txt
public/uploads/books/covers/
public/uploads/books/files/
```

Validate:

- Required fields
- PDF type
- JPG/JPEG/PNG/WEBP covers
- File size
- MIME type
- Extension
- Safe filename
- Path traversal

Uploaded books start as:

```txt
PENDING
```

## Phase B3 — Public Book Library

Create:

```txt
/books
```

Only show:

```txt
VERIFIED books
```

Book cards should show:

- Cover
- Title
- Author
- Category
- Language
- View Book button

Components:

```txt
apps/web/components/books/BookCard.tsx
apps/web/components/books/BookGrid.tsx
```

## Phase B4 — Book Details + Verification

Create:

```txt
/books/[bookId]
```

Show:

- Cover
- Title
- Author
- Description
- Category
- Language
- Upload date
- Status

Actions:

```txt
Read Book
Verify
```

For MVP verification:

```txt
PENDING -> VERIFIED
```

Set:

```txt
verifiedAt = current time
```

## Phase B5 — PDF Reader

Create:

```txt
/books/[bookId]/read
```

For the MVP use the browser PDF viewer:

```tsx
<iframe src={book.fileUrl} />
```

Reader should include:

- Book title
- Back button
- Large reading area
- Responsive layout
- Minimal UI

## Phase B6 — Tests + Polish

Test:

- Book validation
- File validation
- Filename sanitization
- Demo repository
- Book creation
- Verified-book filtering
- Verification flow
- Book card UI
- Book details
- PDF reader
- Mobile responsiveness

Final checks:

```powershell
pnpm test
pnpm build
```

## Demo Database Mode

Use:

```env
BOOKS_DEMO_MODE=true
```

When enabled:

```txt
Use demo repository
```

When disabled:

```txt
Use Prisma repository
```

Do not use an invalid fake `DATABASE_URL` as a replacement for a real database.

## Storage Architecture

MVP:

```txt
LocalBookStorage
```

Later replace it with:

```txt
S3BookStorage
CloudflareR2BookStorage
SupabaseBookStorage
```

without changing the UI.

## Production Note

`public/uploads` is for local/demo use only.

Do not rely on it for permanent uploads on Vercel because serverless local storage is not persistent.

For production, move uploaded files to object storage.

## Recommended Build Order

```txt
B1 -> Types + validation + repository + storage
B2 -> Upload page + upload API
B3 -> Public book library
B4 -> Book details + Verify
B5 -> PDF reader
B6 -> Tests + responsive polish + build
```

## Keep Existing Features Safe

Do not break:

```txt
/
/create
/create/method
/create/count
/study
/import-export
/history
/poem
/poem/read
```

The Book Library should remain an independent module under:

```txt
/books
```
