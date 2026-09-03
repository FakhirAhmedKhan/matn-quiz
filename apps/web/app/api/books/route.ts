import { NextResponse } from "next/server";

import { getBookRepository } from "@/lib/books/book-repository-provider";
import { LocalBookStorage } from "@/lib/books/book-storage";
import {
  fileToBytes,
  hasPdfSignature,
  parseBookUploadFormData,
} from "@/lib/books/book-upload-request";
import { validateBookUpload } from "@/lib/books/book-validation";

export const runtime = "nodejs";

function errorResponse(
  message: string,
  status: number,
  errors?: string[],
) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
      errors: errors ?? [],
    },
    { status },
  );
}

export async function GET() {
  try {
    const repository = getBookRepository();
    const books = await repository.listPublicBooks();

    return NextResponse.json(
      {
        ok: true,
        books,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "[books-list] Failed to load public books:",
      error,
    );

    return errorResponse(
      "Unable to load the public book library.",
      500,
    );
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return errorResponse(
        "Book upload must use multipart/form-data.",
        415,
      );
    }

    const formData = await request.formData();
    const parsed = parseBookUploadFormData(formData);

    if (!parsed) {
      return errorResponse(
        "A PDF book file is required.",
        400,
        ["A PDF book file is required."],
      );
    }

    const validation = validateBookUpload(parsed.input);

    if (!validation.valid) {
      return errorResponse(
        "Book upload validation failed.",
        400,
        validation.errors,
      );
    }

    const pdfSignatureIsValid = await hasPdfSignature(parsed.bookFile);

    if (!pdfSignatureIsValid) {
      return errorResponse(
        "Book file does not contain a valid PDF signature.",
        400,
        [
          "The uploaded file does not appear to be a valid PDF.",
        ],
      );
    }

    const storage = new LocalBookStorage();

    const storedBook = await storage.saveBookFile({
      name: parsed.bookFile.name,
      type: parsed.bookFile.type,
      size: parsed.bookFile.size,
      bytes: await fileToBytes(parsed.bookFile),
    });

    const storedCover = parsed.coverFile
      ? await storage.saveCover({
          name: parsed.coverFile.name,
          type: parsed.coverFile.type,
          size: parsed.coverFile.size,
          bytes: await fileToBytes(parsed.coverFile),
        })
      : null;

    const repository = getBookRepository();

    const book = await repository.create({
      title: parsed.input.title,
      author: parsed.input.author,
      description: parsed.input.description || null,
      category: parsed.input.category || null,
      language: parsed.input.language || null,
      coverUrl: storedCover?.publicUrl ?? null,
      fileUrl: storedBook.publicUrl,
      fileName: storedBook.fileName,
      mimeType: storedBook.mimeType,
      fileSize: storedBook.size,
    });

    return NextResponse.json(
      {
        ok: true,
        book,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "[books-upload] Failed to upload book:",
      error,
    );

    return errorResponse(
      "Unable to upload the book.",
      500,
    );
  }
}