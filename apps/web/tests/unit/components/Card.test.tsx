import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "@/components/ui/Card";

describe("Card", () => {
  it("renders title, description and children", () => {
    render(
      <Card
        title="Card Title"
        description="Card description"
      >
        <p>Card content</p>
      </Card>,
    );

    expect(screen.getByText(/card title/i)).toBeInTheDocument();
    expect(screen.getByText(/card description/i)).toBeInTheDocument();
    expect(screen.getByText(/card content/i)).toBeInTheDocument();
  });

  it("renders footer", () => {
    render(
      <Card footer={<button>Footer Button</button>}>
        <p>Card content</p>
      </Card>,
    );

    expect(screen.getByRole("button", { name: /footer button/i })).toBeInTheDocument();
  });
});





















