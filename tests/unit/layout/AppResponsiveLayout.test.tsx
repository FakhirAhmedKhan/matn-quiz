import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  AppContainer,
  AppHero,
  AppShell,
  MobileActionZone,
  ResponsiveCard,
  ResponsiveCardGrid,
  ResponsiveTwoColumnSection,
} from "@/components/layout";

describe("AppResponsiveLayout accessibility and mobile polish", () => {
  it("renders mobile viewport shell with skip link and safe area", () => {
    render(
      <AppShell>
        <p>Shell content</p>
      </AppShell>,
    );

    expect(screen.getByTestId("app-shell")).toHaveClass("min-h-dvh");
    expect(screen.getByTestId("app-shell")).toHaveClass("overflow-x-hidden");
    expect(screen.getByTestId("skip-to-content-link")).toHaveAttribute(
      "href",
      "#main-content",
    );
    expect(screen.getByTestId("app-safe-area")).toHaveClass("px-4");
    expect(screen.getByText("Shell content")).toBeInTheDocument();
  });

  it("renders focusable main content container", () => {
    render(
      <AppContainer>
        <p>Container content</p>
      </AppContainer>,
    );

    expect(screen.getByTestId("app-container")).toHaveAttribute(
      "id",
      "main-content",
    );
    expect(screen.getByTestId("app-container")).toHaveAttribute("tabindex", "-1");
    expect(screen.getByTestId("app-container")).toHaveClass("max-w-5xl");
    expect(screen.getByTestId("app-container")).toHaveClass("focus:outline-none");
  });

  it("renders mobile polished hero with aria label target", () => {
    render(
      <AppHero
        eyebrow="Phase 17.5"
        title="Matn Quiz"
        description="Accessible study workspace."
      />,
    );

    expect(screen.getByTestId("app-hero")).toHaveAttribute(
      "aria-labelledby",
      "app-hero-title",
    );
    expect(screen.getByTestId("app-hero-title")).toHaveAttribute(
      "id",
      "app-hero-title",
    );
    expect(screen.getByTestId("app-hero-eyebrow")).toHaveTextContent(
      "Phase 17.5",
    );
    expect(screen.getByTestId("hero-main-content-anchor")).toHaveAttribute(
      "href",
      "#main-content",
    );
  });

  it("renders responsive card grid with spacing", () => {
    render(
      <ResponsiveCardGrid spacing="compact">
        <p>Grid content</p>
      </ResponsiveCardGrid>,
    );

    expect(screen.getByTestId("responsive-card-grid")).toHaveClass("space-y-3");
    expect(screen.getByTestId("responsive-card-grid")).toHaveClass("max-w-4xl");
  });

  it("renders responsive card with optional aria label", () => {
    render(
      <ResponsiveCard spacing="spacious" ariaLabel="Quiz setup">
        <p>Card content</p>
      </ResponsiveCard>,
    );

    expect(screen.getByTestId("responsive-card")).toHaveClass("rounded-3xl");
    expect(screen.getByTestId("responsive-card")).toHaveClass("p-6");
    expect(screen.getByTestId("responsive-card")).toHaveAttribute(
      "aria-label",
      "Quiz setup",
    );
  });

  it("renders responsive two column section", () => {
    render(
      <ResponsiveTwoColumnSection>
        <p>Left</p>
        <p>Right</p>
      </ResponsiveTwoColumnSection>,
    );

    expect(screen.getByTestId("responsive-two-column-section")).toHaveClass(
      "grid",
    );
    expect(screen.getByTestId("responsive-two-column-section")).toHaveClass(
      "lg:grid-cols-[1.2fr_0.8fr]",
    );
  });

  it("renders non-sticky mobile action zone", () => {
    render(
      <MobileActionZone layout="stacked">
        <button type="button">Action</button>
      </MobileActionZone>,
    );

    expect(screen.getByTestId("mobile-action-zone")).toHaveClass("grid");
    expect(screen.getByRole("button", { name: /action/i })).toBeInTheDocument();
  });

  it("renders sticky mobile action zone", () => {
    render(
      <MobileActionZone sticky>
        <button type="button">Save</button>
      </MobileActionZone>,
    );

    expect(screen.getByTestId("mobile-action-zone")).toHaveClass("sticky");
    expect(screen.getByTestId("mobile-action-zone")).toHaveClass("bottom-0");
  });
});






