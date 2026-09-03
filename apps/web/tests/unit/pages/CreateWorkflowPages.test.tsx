import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CreateTextPage from "@/app/create/page";
import CreateMethodPage from "@/app/create/method/page";
import CreateCountPage from "@/app/create/count/page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/create",
}));

describe("Create workflow pages", () => {
  it("renders create text page", () => {
    render(<CreateTextPage />);

    expect(
      screen.getByRole("heading", { name: "Paste Arabic Text" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("create-next-method-link")).toHaveAttribute(
      "href",
      "/create/method",
    );
  });

  it("renders create method page", () => {
    render(<CreateMethodPage />);

    expect(
      screen.getByRole("heading", { name: "Choose Quiz Method" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("create-back-text-link")).toHaveAttribute(
      "href",
      "/create",
    );
    expect(screen.getByTestId("create-next-count-link")).toHaveAttribute(
      "href",
      "/create/count",
    );
  });

  it("renders create count page", () => {
    render(<CreateCountPage />);

    expect(
      screen.getByRole("heading", { name: "Set Hide Count" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("create-back-method-link")).toHaveAttribute(
      "href",
      "/create/method",
    );
    expect(screen.getByTestId("create-open-study-link")).toHaveAttribute(
      "href",
      "/study",
    );
  });
});