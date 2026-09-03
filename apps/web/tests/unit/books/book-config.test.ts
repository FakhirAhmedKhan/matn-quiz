import { describe, expect, it } from "vitest";

import {
  getBookFeatureConfig,
  parseBooleanEnv,
} from "@/lib/books/book-config";

describe("book config", () => {
  it("defaults demo mode to true", () => {
    expect(
      getBookFeatureConfig({}).demoMode,
    ).toBe(true);
  });

  it("supports explicit false demo mode", () => {
    expect(
      getBookFeatureConfig({
        BOOKS_DEMO_MODE: "false",
      }).demoMode,
    ).toBe(false);
  });

  it("parses common boolean values", () => {
    expect(
      parseBooleanEnv("yes", false),
    ).toBe(true);

    expect(
      parseBooleanEnv("0", true),
    ).toBe(false);
  });
});