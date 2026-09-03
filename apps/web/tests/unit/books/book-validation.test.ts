import { describe, expect, it } from "vitest";

import {
  MAX_BOOK_FILE_SIZE,
  validateBookCover,
  validateBookFile,
  validateBookUpload,
} from "@/lib/books/book-validation";

describe("book validation", () => {
  it("accepts a valid PDF book upload", () => {
    const result = validateBookUpload({
      title: "Test Book",
      author: "Test Author",
      description: "A demo book",
      category: "Education",
      language: "English",
      bookFile: {
        name: "book.pdf",
        type: "application/pdf",
        size: 1024,
      },
      coverFile: {
        name: "cover.webp",
        type: "image/webp",
        size: 512,
      },
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects missing title and author", () => {
    const result = validateBookUpload({
      title: " ",
      author: "",
      bookFile: {
        name: "book.pdf",
        type: "application/pdf",
        size: 1024,
      },
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Book title is required.",
    );
    expect(result.errors).toContain(
      "Author is required.",
    );
  });

  it("rejects non-PDF book files", () => {
    const result = validateBookFile({
      name: "book.exe",
      type: "application/octet-stream",
      size: 100,
    });

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects path traversal filenames", () => {
    const result = validateBookFile({
      name: "../book.pdf",
      type: "application/pdf",
      size: 100,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Book filename contains an unsafe path.",
    );
  });

  it("rejects oversized PDF files", () => {
    const result = validateBookFile({
      name: "large.pdf",
      type: "application/pdf",
      size: MAX_BOOK_FILE_SIZE + 1,
    });

    expect(result.valid).toBe(false);
  });

  it("accepts supported cover image formats", () => {
    const result = validateBookCover({
      name: "cover.jpg",
      type: "image/jpeg",
      size: 1000,
    });

    expect(result.valid).toBe(true);
  });

  it("rejects executable cover uploads", () => {
    const result = validateBookCover({
      name: "cover.exe",
      type: "application/octet-stream",
      size: 1000,
    });

    expect(result.valid).toBe(false);
  });
});