import { beforeEach, describe, expect, it } from "vitest";

import {
  clearPoemDraft,
  createPoemDraft,
  getPoemDisplayTitle,
  hasPoemText,
  loadPoemDraft,
  POEM_STORAGE_KEY,
  savePoemDraft,
  splitPoemIntoColumns,
  splitPoemLines,
  updatePoemFontSize,
  updatePoemLayout,
  updatePoemText,
  updatePoemTitle,
} from "@/lib/poem/poem-storage";

describe("poem storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("creates a default poem draft", () => {
    const draft = createPoemDraft();

    expect(draft.title).toBe("");
    expect(draft.text).toBe("");
    expect(draft.layout).toBe("TWO_COLUMN");
    expect(draft.direction).toBe("rtl");
    expect(draft.fontSize).toBe(28);
  });

  it("saves and loads poem draft", () => {
    savePoemDraft({
      title: "ہدیہ سلام",
      text: "آمدار نبوت پہ لاکھوں سلام",
      layout: "TWO_COLUMN",
      fontSize: 32,
    });

    const draft = loadPoemDraft();

    expect(draft.title).toBe("ہدیہ سلام");
    expect(draft.text).toBe("آمدار نبوت پہ لاکھوں سلام");
    expect(draft.layout).toBe("TWO_COLUMN");
    expect(draft.fontSize).toBe(32);
  });

  it("updates individual poem fields", () => {
    updatePoemTitle("نعت");
    updatePoemText("روح بزم رسالت پہ لاکھوں سلام");
    updatePoemLayout("SINGLE_COLUMN");
    updatePoemFontSize(36);

    const draft = loadPoemDraft();

    expect(draft.title).toBe("نعت");
    expect(draft.text).toBe("روح بزم رسالت پہ لاکھوں سلام");
    expect(draft.layout).toBe("SINGLE_COLUMN");
    expect(draft.fontSize).toBe(36);
  });

  it("normalizes invalid storage JSON", () => {
    window.localStorage.setItem(POEM_STORAGE_KEY, "{bad-json");

    const draft = loadPoemDraft();

    expect(draft.text).toBe("");
    expect(window.localStorage.getItem(POEM_STORAGE_KEY)).toBeNull();
  });

  it("clamps font size", () => {
    expect(updatePoemFontSize(10).fontSize).toBe(18);
    expect(updatePoemFontSize(100).fontSize).toBe(48);
  });

  it("detects poem text and display title", () => {
    expect(hasPoemText(createPoemDraft({ text: "" }))).toBe(false);
    expect(hasPoemText(createPoemDraft({ text: "  " }))).toBe(false);
    expect(hasPoemText(createPoemDraft({ text: "سلام" }))).toBe(true);

    expect(getPoemDisplayTitle(createPoemDraft({ title: "" }))).toBe(
      "Untitled Poem",
    );
    expect(getPoemDisplayTitle(createPoemDraft({ title: " ہدیہ سلام " }))).toBe(
      "ہدیہ سلام",
    );
  });

  it("splits poem lines", () => {
    expect(splitPoemLines("A\n\nB\r\n C ")).toEqual(["A", "B", "C"]);
  });

  it("splits poem into right and left columns", () => {
    const columns = splitPoemIntoColumns("لائن 1\nلائن 2\nلائن 3\nلائن 4\nلائن 5");

    expect(columns.rightColumn).toEqual(["لائن 1", "لائن 2", "لائن 3"]);
    expect(columns.leftColumn).toEqual(["لائن 4", "لائن 5"]);
  });

  it("clears poem draft", () => {
    savePoemDraft({ title: "Test", text: "Text" });

    const draft = clearPoemDraft();

    expect(draft.title).toBe("");
    expect(window.localStorage.getItem(POEM_STORAGE_KEY)).toBeNull();
  });
});