import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PoemReader } from "@/components/poem";
import { createPoemDraft } from "@/lib/poem/poem-storage";

let printMock: ReturnType<typeof vi.fn>;

describe("PoemReader", () => {
  beforeEach(() => {
    printMock = vi.fn();

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    Object.defineProperty(window, "print", {
      configurable: true,
      value: printMock,
    });
  });

  it("renders empty state without poem text", () => {
    render(<PoemReader draft={createPoemDraft({ text: "" })} />);

    expect(screen.getByTestId("poem-reader-empty")).toBeInTheDocument();
    expect(screen.getByTestId("poem-empty-back-link")).toHaveAttribute(
      "href",
      "/poem",
    );
  });

  it("renders two-column poem layout", () => {
    render(
      <PoemReader
        draft={createPoemDraft({
          title: "Test Poem",
          text: "Line 1\nLine 2\nLine 3\nLine 4",
          layout: "TWO_COLUMN",
          fontSize: 32,
        })}
      />,
    );

    expect(screen.getByTestId("poem-reader")).toBeInTheDocument();
    expect(screen.getByTestId("poem-reader-toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("poem-reader-title")).toHaveTextContent("Test Poem");
    expect(screen.getByTestId("poem-two-column-layout")).toBeInTheDocument();
    expect(screen.getByTestId("poem-center-space")).toBeInTheDocument();
    expect(screen.getByTestId("poem-right-column")).toHaveTextContent("Line 1");
    expect(screen.getByTestId("poem-left-column")).toHaveTextContent("Line 3");
  });

  it("renders single-column poem layout", () => {
    render(
      <PoemReader
        draft={createPoemDraft({
          title: "Test Poem",
          text: "Line 1\nLine 2",
          layout: "SINGLE_COLUMN",
        })}
      />,
    );

    expect(screen.getByTestId("poem-single-column-layout")).toHaveTextContent(
      "Line 1",
    );
  });

  it("calls reader controls", async () => {
    const user = userEvent.setup();
    const onLayoutChange = vi.fn();
    const onFontSizeChange = vi.fn();
    const onClear = vi.fn();

    render(
      <PoemReader
        draft={createPoemDraft({
          text: "Line 1",
          layout: "TWO_COLUMN",
          fontSize: 28,
        })}
        onLayoutChange={onLayoutChange}
        onFontSizeChange={onFontSizeChange}
        onClear={onClear}
      />,
    );

    await user.click(screen.getByTestId("reader-single-column-button"));
    await user.click(screen.getByTestId("reader-font-increase"));
    await user.click(screen.getByTestId("reader-clear-button"));

    expect(onLayoutChange).toHaveBeenCalledWith("SINGLE_COLUMN");
    expect(onFontSizeChange).toHaveBeenCalledWith(30);
    expect(onClear).toHaveBeenCalled();
  });

  it("shows copy status and prints poem", async () => {
    const user = userEvent.setup();

    render(
      <PoemReader
        draft={createPoemDraft({
          title: "Test Poem",
          text: "Line one",
          layout: "TWO_COLUMN",
        })}
      />,
    );

    await user.click(screen.getByTestId("reader-copy-button"));

    await waitFor(() => {
      expect(screen.getByTestId("poem-copy-status")).toHaveTextContent("Copied");
    });

    await user.click(screen.getByTestId("reader-print-button"));

    expect(printMock).toHaveBeenCalled();
  });
});