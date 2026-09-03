# Book Library B4 Status

## Goal

Add book details and MVP verification.

## Added

- `GET /api/books/[bookId]`
- `PATCH /api/books/[bookId]`
- `/books/[bookId]`
- `BookDetails`
- `BookVerificationButton`
- Pending status display
- Verified status display
- `PENDING -> VERIFIED`
- `verifiedAt`
- Read Book action after verification
- Review & Verify link after upload

## MVP verification

The current verification flow intentionally has no authentication or moderator permissions.

Clicking:

```txt
Verify Book
```

immediately changes:

```txt
PENDING
```

to:

```txt
VERIFIED
```

This is demo-only behavior.

## Public library result

After verification, the repository's:

```txt
listPublicBooks()
```

includes the book.

Refreshing `/books` can then show the verified book while the same demo server repository remains alive.

## Demo limitation

Book metadata currently lives in an in-memory repository.

Restarting the Next.js development server clears book metadata.

Local uploaded files remain on disk.

## Next Phase

B5:

- `/books/[bookId]/read`
- responsive PDF reader
- embedded browser PDF viewer
- back to details
- verified-book reading guard