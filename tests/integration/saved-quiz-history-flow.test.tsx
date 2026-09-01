import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("Saved quiz persistence integration flow", () => {
  const wordText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  beforeEach(() => {
    window.localStorage.clear();
  });

  it("generates, saves, reopens, and deletes a quiz", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: wordText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /save quiz/i }));

    expect(screen.getAllByTestId("saved-quiz-item")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: /reset quiz/i }));

    expect(screen.queryByTestId("generated-quiz-panel")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /open quiz/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(screen.queryByTestId("saved-quiz-item")).not.toBeInTheDocument();
  });
});




















