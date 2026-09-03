import { NextResponse } from "next/server";

import { getBookRepository } from "@/lib/books/book-repository-provider";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    bookId: string;
  }>;
}

function errorResponse(
  message: string,
  status: number,
) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
    },
    {
      status,
    },
  );
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { bookId } = await context.params;

    if (!bookId.trim()) {
      return errorResponse(
        "Book id is required.",
        400,
      );
    }

    const repository =
      getBookRepository();

    const book =
      await repository.findById(bookId);

    if (!book) {
      return errorResponse(
        "Book not found.",
        404,
      );
    }

    return NextResponse.json(
      {
        ok: true,
        book,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "[book-detail] Failed to load book:",
      error,
    );

    return errorResponse(
      "Unable to load the book.",
      500,
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { bookId } = await context.params;

    if (!bookId.trim()) {
      return errorResponse(
        "Book id is required.",
        400,
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse(
        "Invalid request body.",
        400,
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("action" in body) ||
      body.action !== "verify"
    ) {
      return errorResponse(
        'Verification request must use action "verify".',
        400,
      );
    }

    const repository =
      getBookRepository();

    const book =
      await repository.verify(bookId);

    if (!book) {
      return errorResponse(
        "Book not found.",
        404,
      );
    }

    return NextResponse.json(
      {
        ok: true,
        book,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "[book-verify] Failed to verify book:",
      error,
    );

    return errorResponse(
      "Unable to verify the book.",
      500,
    );
  }
}