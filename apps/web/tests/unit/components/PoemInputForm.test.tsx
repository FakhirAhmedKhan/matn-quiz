import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { PoemInputForm } from "@/components/poem";
import { loadPoemDraft } from "@/lib/poem/poem-storage";

describe("PoemInputForm", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves poem title and text while typing", async () => {
    const user = userEvent.setup();

    render(<PoemInputForm />);

    await user.type(screen.getByLabelText("Poem title"), "Test Poem");
    await user.type(screen.getByLabelText("Poem text"), "Line one");

    const draft = loadPoemDraft();

    expect(draft.title).toBe("Test Poem");
    expect(draft.text).toBe("Line one");
    expect(screen.getByTestId("poem-open-reader-link")).toHaveAttribute(
      "href",
      "/poem/read",
    );
  });

  it("loads sample poem and clears poem", async () => {
    const user = userEvent.setup();

    render(<PoemInputForm />);

    await user.click(screen.getByTestId("poem-load-sample-button"));

    const loadedDraft = loadPoemDraft();

    expect(loadedDraft.title.trim().length).toBeGreaterThan(0);
    expect(loadedDraft.text.trim().length).toBeGreaterThan(0);
    expect(screen.getByTestId("poem-title-input")).toHaveValue(loadedDraft.title);
    expect(screen.getByTestId("poem-text-input")).toHaveValue(loadedDraft.text);

    await user.click(screen.getByTestId("poem-clear-button"));

    expect(loadPoemDraft().text).toBe("");
    expect(screen.getByTestId("poem-title-input")).toHaveValue("");
    expect(screen.getByTestId("poem-text-input")).toHaveValue("");
  });

  it("updates layout and font size", async () => {
    const user = userEvent.setup();

    render(<PoemInputForm />);

    await user.click(screen.getByLabelText("Single column"));
    await user.click(screen.getByTestId("poem-font-increase"));

    const draft = loadPoemDraft();

    expect(draft.layout).toBe("SINGLE_COLUMN");
    expect(draft.fontSize).toBe(30);
  });
});