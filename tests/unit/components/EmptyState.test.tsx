import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "@/components/ui/EmptyState";

describe("EmptyState", () => {
  it("renders title and message", () => {
    render(
      <EmptyState
        title="No Quiz Generated"
        message="Paste Quran text to begin."
      />,
    );

    expect(screen.getByText(/no quiz generated/i)).toBeInTheDocument();
    expect(screen.getByText(/paste quran text to begin/i)).toBeInTheDocument();
  });

  it("renders action", () => {
    render(
      <EmptyState
        title="No Quiz Generated"
        action={<button>Start</button>}
      />,
    );

    expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
  });
});





















