import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HomePage from "@/app/page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Home landing page", () => {
  it("renders only landing workflow navigation cards", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "Matn Quiz" })).toBeInTheDocument();

    expect(screen.getByTestId("home-create-workflow-link")).toHaveAttribute(
      "href",
      "/create",
    );
    expect(screen.getByTestId("home-study-workflow-link")).toHaveAttribute(
      "href",
      "/study",
    );
    expect(screen.getByTestId("home-import-export-workflow-link")).toHaveAttribute(
      "href",
      "/import-export",
    );
    expect(screen.getByTestId("home-history-workflow-link")).toHaveAttribute(
      "href",
      "/history",
    );

    expect(
      screen.queryByRole("heading", { name: "Paste Quran or Matn Text" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Quiz Method" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Import / Export Quiz JSON" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Saved Quiz History" }),
    ).not.toBeInTheDocument();
  });
});