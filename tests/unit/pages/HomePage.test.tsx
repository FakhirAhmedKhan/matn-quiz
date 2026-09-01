import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage unified quiz generation integration", () => {
  const oneLineText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  const twoLineText =
    "بِسْمِ اللَّهِ\nالرَّحْمَٰنِ الرَّحِيمِ";

  it("renders Quran input, method selector, hide count selector, and summary", () => {
    render(<HomePage />);

    expect(screen.getAllByRole("textbox")[0]!).toBeInTheDocument();

    const radios = screen.getAllByRole("radio");

    expect(radios).toHaveLength(2);
    expect(radios[0]).toHaveTextContent("Hide Words");
    expect(radios[1]).toHaveTextContent("Hide Lines");

    expect(
      screen.getByRole("heading", { name: /words to hide/i }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("selected-method")).toHaveTextContent(
      "Hide Words",
    );
    expect(screen.getByTestId("selected-hide-count")).toHaveTextContent("1");
  });

  it("keeps Continue disabled without valid Arabic text", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("button", { name: /continue/i }),
    ).toBeDisabled();

    expect(
      screen.queryByTestId("generated-quiz-panel"),
    ).not.toBeInTheDocument();
  });

  it("generates Hide Words quiz from homepage", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: oneLineText },
    });

    await user.click(screen.getByLabelText(/increase value/i));

    expect(screen.getByTestId("selected-hide-count")).toHaveTextContent("2");

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();
    expect(screen.getByTestId("generation-success-message")).toHaveTextContent(
      "Text accepted with Hide Words and hide count 2.",
    );
    expect(screen.getByTestId("generated-hidden-count")).toHaveTextContent("2");
    expect(screen.getByTestId("generated-quiz-text")).toHaveTextContent("____");
    expect(screen.getAllByTestId("generated-answer-item")).toHaveLength(2);
  });

  it("generates Hide Lines quiz from homepage", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: twoLineText },
    });

    await user.click(screen.getAllByRole("radio")[1]);
    await user.click(screen.getByLabelText(/increase value/i));

    expect(screen.getByTestId("selected-method")).toHaveTextContent(
      "Hide Lines",
    );
    expect(screen.getByTestId("selected-hide-count")).toHaveTextContent("2");

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();
    expect(screen.getByTestId("generation-success-message")).toHaveTextContent(
      "Text accepted with Hide Lines and hide count 2.",
    );
    expect(screen.getByTestId("generated-hidden-count")).toHaveTextContent("2");
    expect(screen.getByTestId("generated-quiz-text")).toHaveTextContent("____");
    expect(screen.getAllByTestId("generated-answer-item")).toHaveLength(2);
  });

  it("clears generated quiz when text changes", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: oneLineText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: `${oneLineText} اللَّهِ` },
    });

    expect(
      screen.queryByTestId("generated-quiz-panel"),
    ).not.toBeInTheDocument();
  });

  it("clears generated quiz when method changes", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: oneLineText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();

    await user.click(screen.getAllByRole("radio")[1]);

    expect(
      screen.queryByTestId("generated-quiz-panel"),
    ).not.toBeInTheDocument();
  });

  it("clears generated quiz when hide count changes", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    fireEvent.change(screen.getAllByRole("textbox")[0]!, {
      target: { value: oneLineText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();

    await user.click(screen.getByLabelText(/increase value/i));

    expect(
      screen.queryByTestId("generated-quiz-panel"),
    ).not.toBeInTheDocument();
  });
});




















