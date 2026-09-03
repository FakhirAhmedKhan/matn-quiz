import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeWorkflowTestPage as HomePage } from "@/tests/helpers/HomeWorkflowTestPage";

describe("HomePage empty state polish", () => {
  it("renders polished empty states on first load", () => {
    render(<HomePage />);

    expect(screen.getByTestId("study-session-resume-empty")).toHaveTextContent(
      "No saved study session",
    );
    expect(screen.getByTestId("saved-quiz-empty")).toHaveTextContent(
      "No saved quizzes yet.",
    );
    expect(screen.getAllByTestId("feedback-state-icon")[0]!).toBeInTheDocument();
  });
});








