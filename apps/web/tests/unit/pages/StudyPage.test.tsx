import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import StudyPage from "@/app/study/page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/study",
}));

describe("Study page", () => {
  it("renders study page shell and navigation actions", () => {
    render(<StudyPage />);

    expect(
      screen.getByRole("heading", { name: "Question & Answer" }),
    ).toBeInTheDocument();

    expect(screen.getByText(/Review your generated quiz/i)).toBeInTheDocument();

    expect(screen.getByTestId("study-back-create-link")).toHaveAttribute(
      "href",
      "/create/count",
    );

    expect(screen.getByTestId("study-open-history-link")).toHaveAttribute(
      "href",
      "/history",
    );
  });

  it("keeps generated quiz area available on study route", () => {
    render(<StudyPage />);

    expect(screen.getByTestId("app-page-shell")).toBeInTheDocument();
    expect(screen.getByTestId("app-step-header")).toBeInTheDocument();
  });
});