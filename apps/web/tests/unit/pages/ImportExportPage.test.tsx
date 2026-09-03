import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ImportExportPage from "@/app/import-export/page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/import-export",
}));

describe("Import / Export page", () => {
  it("renders import/export page shell and navigation actions", () => {
    render(<ImportExportPage />);

    expect(
      screen.getByRole("heading", { name: "Import / Export" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Export your quiz as shareable JSON/i),
    ).toBeInTheDocument();

    expect(screen.getByTestId("import-export-back-study-link")).toHaveAttribute(
      "href",
      "/study",
    );

    expect(screen.getByTestId("import-export-history-link")).toHaveAttribute(
      "href",
      "/history",
    );
  });

  it("keeps shareable quiz section available on import/export route", () => {
    render(<ImportExportPage />);

    expect(screen.getByTestId("app-page-shell")).toBeInTheDocument();
    expect(screen.getByTestId("app-step-header")).toBeInTheDocument();
  });
});