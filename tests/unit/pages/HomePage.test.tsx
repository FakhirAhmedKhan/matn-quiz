import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the Matn Quiz title", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /matn quiz/i }),
    ).toBeInTheDocument();
  });

  it("renders the Phase 1.2 badge", () => {
    render(<HomePage />);

    expect(screen.getByText(/phase 1.2/i)).toBeInTheDocument();
  });

  it("renders reusable component verification content", () => {
    render(<HomePage />);

    expect(screen.getByText(/ui components/i)).toBeInTheDocument();
    expect(screen.getByText(/empty quiz state/i)).toBeInTheDocument();
  });
});
