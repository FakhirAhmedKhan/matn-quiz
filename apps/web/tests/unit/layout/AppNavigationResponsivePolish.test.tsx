import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppBottomNav, AppPageShell, AppStepHeader, AppTopNav } from "@/components/layout";

const pathnameMock = vi.fn(() => "/books");

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
}));

describe("responsive navigation polish", () => {
  it("shows a compact mobile current route indicator", () => {
    pathnameMock.mockReturnValue("/books");

    render(<AppTopNav />);

    expect(screen.getByTestId("mobile-current-route-pill")).toHaveTextContent(
      "Books",
    );
    expect(screen.getByTestId("top-nav-books")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("keeps six mobile workflow destinations available", () => {
    pathnameMock.mockReturnValue("/history");

    render(<AppBottomNav />);

    expect(screen.getByTestId("bottom-nav-home")).toHaveAttribute("href", "/");
    expect(screen.getByTestId("bottom-nav-create")).toHaveAttribute("href", "/create");
    expect(screen.getByTestId("bottom-nav-study")).toHaveAttribute("href", "/study");
    expect(screen.getByTestId("bottom-nav-poem")).toHaveAttribute("href", "/poem");
    expect(screen.getByTestId("bottom-nav-books")).toHaveAttribute("href", "/books");
    expect(screen.getByTestId("bottom-nav-history")).toHaveAttribute("aria-current", "page");
  });

  it("renders page shell content inside main landmark", () => {
    render(
      <AppPageShell>
        <p>Responsive content</p>
      </AppPageShell>,
    );

    expect(screen.getByTestId("app-page-content").tagName).toBe("MAIN");
    expect(screen.getByText("Responsive content")).toBeInTheDocument();
  });

  it("renders step header with mobile-friendly action container", () => {
    render(
      <AppStepHeader
        eyebrow="Step"
        title="Mobile Header"
        description="Header description"
        action={<button type="button">Continue</button>}
      />,
    );

    expect(screen.getByTestId("app-step-header")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });
});