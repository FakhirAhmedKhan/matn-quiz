# Book Library B3 Status

## Goal

Create the public verified-book library.

## Added

- `GET /api/books`
- `/books`
- `BookCard`
- `BookGrid`
- `BookLibrary`
- Loading state
- Error state
- Empty state
- Upload link from the library
- Public Library link from upload page

## Public visibility rule

The GET endpoint uses:

```txt
repository.listPublicBooks()
```

Only books with:

```txt
VERIFIED
```

status are returned.

Pending books remain hidden from the public library.

## Demo limitation

The current repository is in memory.

Restarting the Next.js server clears demo book records.

Uploaded PDF files remain on disk locally, but their in-memory metadata is reset.

A persistent repository will be added later.

## Next Phase

B4:

- `/books/[bookId]`
- book detail page
- pending/admin-style book view
- Verify button
- `PENDING -> VERIFIED`
- verifiedAt timestamp
- book lookup API
- verification API