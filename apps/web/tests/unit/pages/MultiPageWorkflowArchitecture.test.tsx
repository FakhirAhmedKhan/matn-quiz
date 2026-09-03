import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CreateCountPage from "@/app/create/count/page";
import CreateMethodPage from "@/app/create/method/page";
import CreateTextPage from "@/app/create/page";
import HistoryPage from "@/app/history/page";
import ImportExportPage from "@/app/import-export/page";
import StudyPage from "@/app/study/page";
import { AppBottomNav, AppTopNav } from "@/components/layout";

const pathnameMock = vi.fn(() => "/create");

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
}));

describe("multi-page quiz workflow architecture", () => {
  it("renders primary top navigation for all workflow routes", () => {
    pathnameMock.mockReturnValue("/import-export");

    render(<AppTopNav />);

    expect(screen.getByTestId("top-nav-home")).toHaveAttribute("href", "/");
    expect(screen.getByTestId("top-nav-create")).toHaveAttribute("href", "/create");
    expect(screen.getByTestId("top-nav-study")).toHaveAttribute("href", "/study");
    expect(screen.getByTestId("top-nav-poem")).toHaveAttribute("href", "/poem");
    expect(screen.getByTestId("top-nav-import-export")).toHaveAttribute(
      "href",
      "/import-export",
    );
    expect(screen.getByTestId("top-nav-history")).toHaveAttribute("href", "/history");
    expect(screen.getByTestId("top-nav-import-export")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("renders mobile bottom navigation for the full workflow", () => {
    pathnameMock.mockReturnValue("/history");

    render(<AppBottomNav />);

    expect(screen.getByTestId("bottom-nav-home")).toHaveAttribute("href", "/");
    expect(screen.getByTestId("bottom-nav-create")).toHaveAttribute("href", "/create");
    expect(screen.getByTestId("bottom-nav-study")).toHaveAttribute("href", "/study");
    expect(screen.getByTestId("bottom-nav-poem")).toHaveAttribute("href", "/poem");
    expect(screen.getByTestId("bottom-nav-share")).toHaveAttribute(
      "href",
      "/import-export",
    );
    expect(screen.getByTestId("bottom-nav-history")).toHaveAttribute("href", "/history");
    expect(screen.getByTestId("bottom-nav-history")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("keeps create text route available", () => {
    pathnameMock.mockReturnValue("/create");

    render(<CreateTextPage />);

    expect(screen.getByRole("heading", { name: "Paste Arabic Text" })).toBeInTheDocument();
    expect(screen.getByTestId("create-next-method-link")).toHaveAttribute(
      "href",
      "/create/method",
    );
  });

  it("keeps create method route available", () => {
    pathnameMock.mockReturnValue("/create/method");

    render(<CreateMethodPage />);

    expect(screen.getByRole("heading", { name: "Choose Quiz Method" })).toBeInTheDocument();
    expect(screen.getByTestId("create-next-count-link")).toHaveAttribute(
      "href",
      "/create/count",
    );
  });

  it("keeps create count route available", () => {
    pathnameMock.mockReturnValue("/create/count");

    render(<CreateCountPage />);

    expect(screen.getByRole("heading", { name: "Set Hide Count" })).toBeInTheDocument();
    expect(screen.getByTestId("create-open-study-link")).toHaveAttribute(
      "href",
      "/study",
    );
  });

  it("keeps study route available", () => {
    pathnameMock.mockReturnValue("/study");

    render(<StudyPage />);

    expect(screen.getByRole("heading", { name: "Question & Answer" })).toBeInTheDocument();
    expect(screen.getByTestId("study-open-history-link")).toHaveAttribute(
      "href",
      "/history",
    );
  });

  it("keeps import export route available", () => {
    pathnameMock.mockReturnValue("/import-export");

    render(<ImportExportPage />);

    expect(screen.getByRole("heading", { name: "Import / Export" })).toBeInTheDocument();
    expect(screen.getByTestId("import-export-history-link")).toHaveAttribute(
      "href",
      "/history",
    );
  });

  it("keeps history route available", () => {
    pathnameMock.mockReturnValue("/history");

    render(<HistoryPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Saved Quiz History" })).toBeInTheDocument();
    expect(screen.getByTestId("history-create-link")).toHaveAttribute(
      "href",
      "/create",
    );
  });
});