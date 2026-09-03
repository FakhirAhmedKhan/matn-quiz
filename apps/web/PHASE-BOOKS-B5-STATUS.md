# Book Library B5 Status

## Goal

Add an MVP PDF reader for verified books.

## Added

- `/books/[bookId]/read`
- `BookReader`
- Embedded browser PDF iframe
- Book title and author in reader toolbar
- Back to Book Details
- Back to Public Library
- Open PDF in a new browser tab
- Loading state
- Error state
- Verification guard

## Verification rule

Only books with:

```txt
VERIFIED
```

status render the embedded PDF reader.

Pending books show:

```txt
Verification required
```

and are directed back to the book details page.

## Reader

The MVP reader uses the browser's built-in PDF rendering:

```tsx
<iframe src={book.fileUrl} />
```

No custom PDF rendering dependency is required.

## Local demo behavior

PDF files are read from:

```txt
public/uploads/books/files/
```

This works for local/demo development.

Local uploads are not persistent production storage on Vercel.

## Next Phase

B6:

- final Book Library test coverage
- responsive/accessibility polish
- navigation integration
- full regression verification
- production build verification
- update project context documentation