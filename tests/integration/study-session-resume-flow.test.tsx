import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import {
  clearPersistedStudySession,
  loadPersistedStudySession,
} from "@/lib/quiz/study-session-repository";

function getQuranTextarea() {
  return screen.getAllByRole("textbox")[0]!;
}

describe("Study session resume flow", () => {
  const arabicText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

  beforeEach(() => {
    window.localStorage.clear();
    clearPersistedStudySession();
  });

  it("shows saved study session and resumes it", async () => {
    const user = userEvent.setup();

    const firstRender = render(<HomePage />);

    fireEvent.change(getQuranTextarea(), {
      target: { value: arabicText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /reveal answer 1/i }));
    await user.click(
      screen.getByRole("button", { name: /mark answer 1 correct/i }),
    );

    await waitFor(() => {
      expect(loadPersistedStudySession()).not.toBeNull();
    });

    firstRender.unmount();

    render(<HomePage />);

    expect(screen.getByTestId("study-session-resume-state")).toHaveTextContent(
      "Session found",
    );
    expect(screen.getByTestId("study-session-resume-summary")).toHaveTextContent(
      "1 revealed · 1 reviewed · 100% accuracy",
    );

    await user.click(screen.getByRole("button", { name: /resume session/i }));

    expect(screen.getByTestId("generated-quiz-panel")).toBeInTheDocument();
    expect(screen.getByTestId("history-status")).toHaveTextContent(
      "Study session resumed.",
    );
    expect(screen.getByTestId("study-session-save-status")).toHaveTextContent(
      "Study session auto-saved.",
    );
    expect(screen.getByTestId("answer-display-1")).toHaveTextContent("اللَّهِ");
    expect(screen.getByTestId("review-progress-summary-text")).toHaveTextContent(
      "1 of 1 reviewed · 100% accuracy",
    );
  });

  it("clears saved study session from resume panel", async () => {
    const user = userEvent.setup();

    const firstRender = render(<HomePage />);

    fireEvent.change(getQuranTextarea(), {
      target: { value: arabicText },
    });

    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /reveal answer 1/i }));

    await waitFor(() => {
      expect(loadPersistedStudySession()).not.toBeNull();
    });

    firstRender.unmount();

    render(<HomePage />);

    expect(screen.getByTestId("study-session-resume-state")).toHaveTextContent(
      "Session found",
    );

    await user.click(screen.getByRole("button", { name: /clear session/i }));

    expect(screen.getByTestId("study-session-resume-state")).toHaveTextContent(
      "No session",
    );
    expect(screen.getByTestId("history-status")).toHaveTextContent(
      "Study session cleared.",
    );
    expect(loadPersistedStudySession()).toBeNull();
  });
});










