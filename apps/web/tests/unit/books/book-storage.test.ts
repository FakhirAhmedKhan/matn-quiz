import {
  mkdtemp,
  readFile,
  rm,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  createSafeUploadFileName,
  LocalBookStorage,
  sanitizeUploadBaseName,
} from "@/lib/books/book-storage";

const temporaryDirectories: string[] = [];

async function createTempDirectory(): Promise<string> {
  const directory = await mkdtemp(
    path.join(
      os.tmpdir(),
      "matn-quiz-books-",
    ),
  );

  temporaryDirectories.push(directory);

  return directory;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, {
        recursive: true,
        force: true,
      }),
    ),
  );
});

describe("book storage", () => {
  it("sanitizes unsafe upload names", () => {
    expect(
      sanitizeUploadBaseName(
        "../../My unsafe book name.pdf",
      ),
    ).toBe("My-unsafe-book-name");
  });

  it("creates a unique safe filename", () => {
    expect(
      createSafeUploadFileName(
        "../Book Name.PDF",
        "test-id",
      ),
    ).toBe("Book-Name-test-id.pdf");
  });

  it("writes a PDF into the local books/files directory", async () => {
    const rootDirectory =
      await createTempDirectory();

    const storage = new LocalBookStorage({
      rootDirectory,
    });

    const bytes = new Uint8Array([
      37,
      80,
      68,
      70,
    ]);

    const result =
      await storage.saveBookFile({
        name: "demo.pdf",
        type: "application/pdf",
        size: bytes.byteLength,
        bytes,
      });

    expect(result.fileName).toMatch(
      /^demo-.+\.pdf$/,
    );

    expect(result.publicUrl).toMatch(
      /^\/uploads\/books\/files\/demo-.+\.pdf$/,
    );

    const saved = await readFile(
      result.absolutePath,
    );

    expect(Array.from(saved)).toEqual(
      Array.from(bytes),
    );
  });

  it("writes covers into the covers directory", async () => {
    const rootDirectory =
      await createTempDirectory();

    const storage = new LocalBookStorage({
      rootDirectory,
    });

    const result =
      await storage.saveCover({
        name: "cover.webp",
        type: "image/webp",
        size: 3,
        bytes: new Uint8Array([
          1,
          2,
          3,
        ]),
      });

    expect(result.publicUrl).toContain(
      "/uploads/books/covers/",
    );
  });
});