import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage responsive layout polish", () => {
  const wordText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  it("renders polished responsive shell sections", () => {
    render(<HomePage />);

    expect(screen.getByTestId("app-shell")).toBeInTheDocument();
    expect(screen.getByTestId("app-container")).toBeInTheDocument();
    expect(screen.getByTestId("app-hero")).toBeInTheDocument();
    expect(screen.getByTestId("responsive-card-grid")).toBeInTheDocument();
    expect(screen.getByTestId("responsive-two-column-section")).toBeInTheDocument();
  });

  it("keeps the main quiz setup flow working", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: wordText },
    });

    await user.click(screen.getByLabelText(/increase value/i));

    expect(screen.getByTestId("selected-method")).toHaveTextContent("Hide Words");
    expect(screen.getByTestId("selected-hide-count")).toHaveTextContent("2");
    expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();
  });

  it("keeps generated quiz reset action working", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: wordText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reset quiz/i }));

    expect(screen.queryByTestId("generated-quiz-panel")).not.toBeInTheDocument();
  });
});
















