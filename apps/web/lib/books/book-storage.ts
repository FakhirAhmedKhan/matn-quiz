import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  BookBinaryUpload,
  StoredBookFile,
} from "./book-types";

export interface BookStorage {
  saveBookFile(file: BookBinaryUpload): Promise<StoredBookFile>;

  saveCover(file: BookBinaryUpload): Promise<StoredBookFile>;
}

export interface LocalBookStorageOptions {
  rootDirectory?: string;
}

function normalizeExtension(fileName: string): string {
  return path.extname(path.basename(fileName)).toLowerCase();
}

export function sanitizeUploadBaseName(fileName: string): string {
  const safeFileName = path.basename(fileName);
  const extension = normalizeExtension(safeFileName);

  const stem = safeFileName
    .slice(0, safeFileName.length - extension.length)
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}._-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_.]+|[-_.]+$/g, "")
    .slice(0, 80);

  return stem || "file";
}

export function createSafeUploadFileName(
  originalName: string,
  uniqueId = randomUUID(),
): string {
  const extension = normalizeExtension(originalName);
  const stem = sanitizeUploadBaseName(originalName);

  return `${stem}-${uniqueId}${extension}`;
}

function assertInsideDirectory(
  directory: string,
  targetPath: string,
): void {
  const resolvedDirectory = path.resolve(directory);
  const resolvedTarget = path.resolve(targetPath);

  const relative = path.relative(
    resolvedDirectory,
    resolvedTarget,
  );

  if (
    relative.startsWith("..") ||
    path.isAbsolute(relative)
  ) {
    throw new Error("Unsafe upload path.");
  }
}

export class LocalBookStorage implements BookStorage {
  private readonly rootDirectory: string;

  constructor(options: LocalBookStorageOptions = {}) {
    this.rootDirectory =
      options.rootDirectory ??
      path.join(
        process.cwd(),
        "public",
        "uploads",
        "books",
      );
  }

  async saveBookFile(
    file: BookBinaryUpload,
  ): Promise<StoredBookFile> {
    return this.save(
      file,
      "files",
      "/uploads/books/files",
    );
  }

  async saveCover(
    file: BookBinaryUpload,
  ): Promise<StoredBookFile> {
    return this.save(
      file,
      "covers",
      "/uploads/books/covers",
    );
  }

  private async save(
    file: BookBinaryUpload,
    directoryName: "files" | "covers",
    publicDirectory: string,
  ): Promise<StoredBookFile> {
    const directory = path.join(
      this.rootDirectory,
      directoryName,
    );

    await mkdir(directory, {
      recursive: true,
    });

    const fileName = createSafeUploadFileName(file.name);

    const absolutePath = path.join(
      directory,
      fileName,
    );

    assertInsideDirectory(
      directory,
      absolutePath,
    );

    await writeFile(
      absolutePath,
      file.bytes,
    );

    return {
      fileName,
      absolutePath,
      publicUrl: `${publicDirectory}/${encodeURIComponent(fileName)}`,
      mimeType: file.type,
      size: file.size,
    };
  }
}