import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import PoemPage from "@/app/poem/page";
import PoemReadPage from "@/app/poem/read/page";
import { savePoemDraft } from "@/lib/poem/poem-storage";

const pathnameMock = vi.fn(() => "/poem");

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
}));

describe("Poem input and reader pages", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders poem setup page with real form", () => {
    pathnameMock.mockReturnValue("/poem");

    render(<PoemPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Poem / Nazm Setup" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("poem-input-form")).toBeInTheDocument();
    expect(screen.getByLabelText("Poem title")).toBeInTheDocument();
    expect(screen.getByLabelText("Poem text")).toBeInTheDocument();
  });

  it("saves poem from setup form and keeps reader link available", async () => {
    const user = userEvent.setup();
    pathnameMock.mockReturnValue("/poem");

    render(<PoemPage />);

    await user.type(screen.getByLabelText("Poem title"), "ہدیہ سلام");
    await user.type(screen.getByLabelText("Poem text"), "آمدار نبوت پہ لاکھوں سلام");

    expect(screen.getByTestId("poem-open-reader-link")).toHaveAttribute(
      "href",
      "/poem/read",
    );
    expect(screen.getByTestId("poem-character-count")).toHaveTextContent(
      "Characters:",
    );
  });

  it("renders poem reader page from saved storage", async () => {
    pathnameMock.mockReturnValue("/poem/read");

    savePoemDraft({
      title: "ہدیہ سلام",
      text: "لائن 1\nلائن 2\nلائن 3\nلائن 4",
      layout: "TWO_COLUMN",
      fontSize: 30,
    });

    render(<PoemReadPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Read Poem" }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("poem-reader-title")).toHaveTextContent(
        "ہدیہ سلام",
      );
    });

    expect(screen.getByTestId("poem-two-column-layout")).toBeInTheDocument();
  });
});