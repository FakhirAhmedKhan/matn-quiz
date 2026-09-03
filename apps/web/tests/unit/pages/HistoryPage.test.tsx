import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HistoryPage from "@/app/history/page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/history",
}));

describe("History page", () => {
  it("renders history page shell and navigation actions", () => {
    render(<HistoryPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Saved Quiz History" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Open previous quizzes, continue studying/i),
    ).toBeInTheDocument();

    expect(screen.getByTestId("history-create-link")).toHaveAttribute(
      "href",
      "/create",
    );

    expect(screen.getByTestId("history-study-link")).toHaveAttribute(
      "href",
      "/study",
    );
  });

  it("keeps saved history section available on history route", () => {
    render(<HistoryPage />);

    expect(screen.getByTestId("app-page-shell")).toBeInTheDocument();
    expect(screen.getByTestId("app-step-header")).toBeInTheDocument();
  });
});