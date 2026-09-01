import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AccessibleSkipLink } from "@/components/ui/AccessibleSkipLink";

describe("AccessibleSkipLink", () => {
  it("renders default skip link", () => {
    render(<AccessibleSkipLink />);

    expect(screen.getByTestId("skip-to-content-link")).toHaveAttribute(
      "href",
      "#main-content",
    );
    expect(screen.getByTestId("skip-to-content-link")).toHaveTextContent(
      "Skip to main content",
    );
    expect(screen.getByTestId("skip-to-content-link")).toHaveClass("sr-only");
  });

  it("renders custom skip link target and label", () => {
    render(<AccessibleSkipLink targetId="quiz-content" label="Skip quiz" />);

    expect(screen.getByTestId("skip-to-content-link")).toHaveAttribute(
      "href",
      "#quiz-content",
    );
    expect(screen.getByTestId("skip-to-content-link")).toHaveTextContent(
      "Skip quiz",
    );
  });
});



