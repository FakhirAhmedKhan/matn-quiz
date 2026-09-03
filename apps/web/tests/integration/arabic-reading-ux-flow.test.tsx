import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("Arabic reading UX flow", () => {
  const lineText =
    "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ";

  it("generates a line quiz with RTL Arabic reading panel", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: lineText },
    });

    await user.click(screen.getAllByRole("radio")[1]);
    await user.click(screen.getByLabelText(/increase value/i));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-reading-panel")).toBeInTheDocument();
    expect(screen.getByTestId("generated-quiz-text")).toHaveAttribute("dir", "rtl");
    expect(screen.getByTestId("generated-quiz-text")).toHaveAttribute("lang", "ar");
    expect(screen.getByTestId("generated-method-pill")).toHaveTextContent(
      "Line Study",
    );

    await user.click(screen.getByRole("button", { name: /reveal answer 1/i }));

    expect(screen.getByTestId("answer-display-1")).toHaveAttribute("dir", "rtl");
    expect(screen.getByTestId("answer-display-1")).not.toHaveTextContent("••••");
  });
});





















