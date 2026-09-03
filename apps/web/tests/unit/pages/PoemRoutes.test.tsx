import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PoemPage from "@/app/poem/page";
import PoemReadPage from "@/app/poem/read/page";
import { AppBottomNav, AppTopNav } from "@/components/layout";

const pathnameMock = vi.fn(() => "/poem");

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
}));

describe("poem routes and navigation", () => {
  it("adds poem to desktop navigation", () => {
    pathnameMock.mockReturnValue("/poem");

    render(<AppTopNav />);

    expect(screen.getByTestId("top-nav-poem")).toHaveAttribute("href", "/poem");
    expect(screen.getByTestId("top-nav-poem")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByTestId("mobile-current-route-pill")).toHaveTextContent(
      "Poem",
    );
  });

  it("adds poem to mobile navigation", () => {
    pathnameMock.mockReturnValue("/poem");

    render(<AppBottomNav />);

    expect(screen.getByTestId("bottom-nav-poem")).toHaveAttribute(
      "href",
      "/poem",
    );
    expect(screen.getByTestId("bottom-nav-poem")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("renders poem setup placeholder route", () => {
    pathnameMock.mockReturnValue("/poem");

    render(<PoemPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Poem / Nazm Setup" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("poem-open-reader-link")).toHaveAttribute(
      "href",
      "/poem/read",
    );
  });

  it("renders poem reader placeholder route", () => {
    pathnameMock.mockReturnValue("/poem/read");

    render(<PoemReadPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Read Poem" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("poem-back-setup-link")).toHaveAttribute(
      "href",
      "/poem",
    );
  });
});