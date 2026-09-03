import type {
  BookUploadFileMetadata,
  BookUploadInput,
} from "./book-types";

export interface ParsedBookUpload {
  input: BookUploadInput;
  bookFile: File;
  coverFile: File | null;
}

function getTextValue(
  formData: FormData,
  key: string,
): string {
  const value = formData.get(key);

  return typeof value === "string"
    ? value.trim()
    : "";
}

function isUploadedFile(
  value: FormDataEntryValue | null,
): value is File {
  return (
    typeof File !== "undefined" &&
    value instanceof File &&
    value.name.trim().length > 0
  );
}

function toMetadata(
  file: File,
): BookUploadFileMetadata {
  return {
    name: file.name,
    type: file.type,
    size: file.size,
  };
}

export function parseBookUploadFormData(
  formData: FormData,
): ParsedBookUpload | null {
  const bookValue = formData.get("bookFile");
  const coverValue = formData.get("coverFile");

  if (!isUploadedFile(bookValue)) {
    return null;
  }

  const coverFile = isUploadedFile(coverValue)
    ? coverValue
    : null;

  return {
    input: {
      title: getTextValue(formData, "title"),
      author: getTextValue(formData, "author"),
      description: getTextValue(formData, "description"),
      category: getTextValue(formData, "category"),
      language: getTextValue(formData, "language"),
      bookFile: toMetadata(bookValue),
      coverFile: coverFile ? toMetadata(coverFile) : null,
    },
    bookFile: bookValue,
    coverFile,
  };
}

export async function fileToBytes(
  file: File,
): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}

export async function hasPdfSignature(
  file: File,
): Promise<boolean> {
  if (file.size < 5) {
    return false;
  }

  const header = new Uint8Array(
    await file.slice(0, 5).arrayBuffer(),
  );

  return (
    header[0] === 0x25 &&
    header[1] === 0x50 &&
    header[2] === 0x44 &&
    header[3] === 0x46 &&
    header[4] === 0x2d
  );
}