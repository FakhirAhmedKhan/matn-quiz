import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import PoemPage from "@/app/poem/page";
import PoemReadPage from "@/app/poem/read/page";

const pathnameMock = vi.fn(() => "/poem");

let printMock: ReturnType<typeof vi.fn>;

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
}));

describe("poem reader flow", () => {
  beforeEach(() => {
    window.localStorage.clear();

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

  it("saves poem setup and renders the reader from storage", async () => {
    const user = userEvent.setup();

    pathnameMock.mockReturnValue("/poem");
    render(<PoemPage />);

    await user.type(screen.getByLabelText("Poem title"), "Test Poem");
    await user.type(
      screen.getByLabelText("Poem text"),
      "Line 1\nLine 2\nLine 3\nLine 4",
    );

    expect(screen.getByTestId("poem-open-reader-link")).toHaveAttribute(
      "href",
      "/poem/read",
    );

    pathnameMock.mockReturnValue("/poem/read");
    render(<PoemReadPage />);

    await waitFor(() => {
      expect(screen.getByTestId("poem-reader-title")).toHaveTextContent(
        "Test Poem",
      );
    });

    expect(screen.getByTestId("poem-two-column-layout")).toBeInTheDocument();
    expect(screen.getByTestId("poem-right-column")).toHaveTextContent("Line 1");
    expect(screen.getByTestId("poem-left-column")).toHaveTextContent("Line 3");
  });

  it("supports reader copy, print, and layout controls", async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(
      "matn-quiz:poem-draft",
      JSON.stringify({
        title: "Test Poem",
        text: "Line 1\nLine 2",
        layout: "TWO_COLUMN",
        direction: "rtl",
        fontSize: 28,
        updatedAt: new Date().toISOString(),
      }),
    );

    pathnameMock.mockReturnValue("/poem/read");
    render(<PoemReadPage />);

    await waitFor(() => {
      expect(screen.getByTestId("poem-reader-title")).toHaveTextContent(
        "Test Poem",
      );
    });

    await user.click(screen.getByTestId("reader-single-column-button"));

    await waitFor(() => {
      expect(screen.getByTestId("poem-single-column-layout")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("reader-copy-button"));

    await waitFor(() => {
      expect(screen.getByTestId("poem-copy-status")).toHaveTextContent("Copied");
    });

    await user.click(screen.getByTestId("reader-print-button"));

    expect(printMock).toHaveBeenCalled();
  });
});