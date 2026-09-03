import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  AppBottomNav,
  AppPageShell,
  AppStepHeader,
  AppTopNav,
} from "@/components/layout";

vi.mock("next/navigation", () => ({
  usePathname: () => "/create",
}));

describe("App navigation shell", () => {
  it("renders top navigation with active create route", () => {
    render(<AppTopNav />);

    expect(screen.getByTestId("app-top-nav")).toBeInTheDocument();
    expect(screen.getByTestId("app-brand-link")).toHaveAttribute("href", "/");
    expect(screen.getByTestId("top-nav-create")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("renders mobile bottom navigation", () => {
    render(<AppBottomNav />);

    expect(screen.getByTestId("app-bottom-nav")).toBeInTheDocument();
    expect(screen.getByTestId("bottom-nav-create")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("renders page shell with shared navigation", () => {
    render(
      <AppPageShell>
        <p>Page content</p>
      </AppPageShell>,
    );

    expect(screen.getByTestId("app-page-shell")).toBeInTheDocument();
    expect(screen.getByTestId("app-page-content")).toHaveTextContent(
      "Page content",
    );
    expect(screen.getByTestId("app-top-nav")).toBeInTheDocument();
    expect(screen.getByTestId("app-bottom-nav")).toBeInTheDocument();
  });

  it("renders step header with optional eyebrow and action", () => {
    render(
      <AppStepHeader
        eyebrow="Step 1"
        title="Create Your Quiz"
        description="Paste Arabic text to begin."
        action={<button type="button">Help</button>}
      />,
    );

    expect(screen.getByTestId("app-step-header")).toBeInTheDocument();
    expect(screen.getByTestId("app-step-eyebrow")).toHaveTextContent("Step 1");
    expect(screen.getByRole("heading", { name: "Create Your Quiz" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Help" })).toBeInTheDocument();
  });
});