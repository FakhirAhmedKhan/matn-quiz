import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage saved quiz history flow", () => {
  const wordText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
  const lineText =
    "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ";

  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows empty saved quiz history by default", () => {
    render(<HomePage />);

    expect(screen.getByTestId("saved-quiz-history")).toBeInTheDocument();
    expect(screen.getByTestId("saved-quiz-empty")).toHaveTextContent(
      "No saved quizzes yet.",
    );
  });

  it("saves generated quiz to browser history", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: wordText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /save quiz/i }));

    expect(screen.getByTestId("history-status")).toHaveTextContent(
      "Quiz saved to history.",
    );
    expect(screen.getAllByTestId("saved-quiz-item")).toHaveLength(1);
    expect(screen.getByTestId("saved-quiz-title")).toHaveTextContent(
      "Hide Words",
    );
  });

  it("opens saved quiz from browser history", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: wordText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /save quiz/i }));
    await user.click(screen.getByRole("button", { name: /reset quiz/i }));

    expect(screen.queryByTestId("generated-quiz-panel")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /open quiz/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();
    expect(screen.getByTestId("history-status")).toHaveTextContent(
      "Saved quiz opened.",
    );
  });

  it("deletes saved quiz from browser history", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: wordText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /save quiz/i }));

    expect(screen.getAllByTestId("saved-quiz-item")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(screen.queryByTestId("saved-quiz-item")).not.toBeInTheDocument();
    expect(screen.getByTestId("saved-quiz-empty")).toBeInTheDocument();
    expect(screen.getByTestId("history-status")).toHaveTextContent(
      "Saved quiz deleted.",
    );
  });

  it("clears all saved quiz history", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: wordText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /save quiz/i }));

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: lineText },
    });

    await user.click(screen.getAllByRole("radio")[1]);
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /save quiz/i }));

    expect(screen.getAllByTestId("saved-quiz-item")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: /clear history/i }));

    expect(screen.queryByTestId("saved-quiz-item")).not.toBeInTheDocument();
    expect(screen.getByTestId("saved-quiz-empty")).toBeInTheDocument();
    expect(screen.getByTestId("history-status")).toHaveTextContent(
      "Saved history cleared.",
    );
  });

  it("keeps newest saved quiz first", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: wordText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /save quiz/i }));

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: lineText },
    });

    await user.click(screen.getAllByRole("radio")[1]);
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /save quiz/i }));

    const items = screen.getAllByTestId("saved-quiz-item");

    expect(within(items[0]!).getByTestId("saved-quiz-title")).toHaveTextContent(
      "Hide Lines",
    );
    expect(within(items[1]!).getByTestId("saved-quiz-title")).toHaveTextContent(
      "Hide Words",
    );
  });
});

