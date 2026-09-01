import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  AppContainer,
  AppHero,
  AppShell,
  ResponsiveCard,
  ResponsiveCardGrid,
} from "@/components/layout";

describe("responsive layout components", () => {
  it("renders app shell", () => {
    render(
      <AppShell>
        <p>Content</p>
      </AppShell>,
    );

    expect(screen.getByTestId("app-shell")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders app container", () => {
    render(
      <AppContainer>
        <p>Inside container</p>
      </AppContainer>,
    );

    expect(screen.getByTestId("app-container")).toBeInTheDocument();
    expect(screen.getByTestId("app-container")).toHaveClass("max-w-5xl");
  });

  it("renders app hero", () => {
    render(
      <AppHero
        eyebrow="Phase 9.2"
        title="Matn Quiz"
        description="Responsive layout polish"
      />,
    );

    expect(screen.getByTestId("app-hero")).toBeInTheDocument();
    expect(screen.getByText("Phase 9.2")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Matn Quiz" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Responsive layout polish")).toBeInTheDocument();
  });

  it("renders responsive card grid", () => {
    render(
      <ResponsiveCardGrid>
        <p>Grid item</p>
      </ResponsiveCardGrid>,
    );

    expect(screen.getByTestId("responsive-card-grid")).toBeInTheDocument();
    expect(screen.getByTestId("responsive-card-grid")).toHaveClass("max-w-4xl");
  });

  it("renders responsive card", () => {
    render(
      <ResponsiveCard>
        <p>Card content</p>
      </ResponsiveCard>,
    );

    expect(screen.getByTestId("responsive-card")).toBeInTheDocument();
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });
});
