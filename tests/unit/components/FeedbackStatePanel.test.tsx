import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  EmptyStatePanel,
  ErrorStatePanel,
  FeedbackStatePanel,
  InlineStatusMessage,
  LoadingStatePanel,
  SuccessStatePanel,
  WarningStatePanel,
} from "@/components/ui/FeedbackStatePanel";

describe("FeedbackStatePanel", () => {
  it("renders empty state panel", () => {
    render(
      <EmptyStatePanel
        title="No saved quizzes yet."
        description="Generate a quiz first."
      />,
    );

    expect(screen.getByTestId("feedback-state-panel")).toHaveAttribute(
      "role",
      "status",
    );
    expect(screen.getByTestId("feedback-state-title")).toHaveTextContent(
      "No saved quizzes yet.",
    );
    expect(screen.getByTestId("feedback-state-description")).toHaveTextContent(
      "Generate a quiz first.",
    );
    expect(screen.getAllByTestId("feedback-state-icon")[0]!).toHaveAttribute(
      "aria-label",
      "Empty state",
    );
  });

  it("renders loading state panel", () => {
    render(<LoadingStatePanel title="Loading session" />);

    expect(screen.getByTestId("feedback-state-panel")).toHaveAttribute(
      "aria-live",
      "polite",
    );
    expect(screen.getByTestId("feedback-state-title")).toHaveTextContent(
      "Loading session",
    );
    expect(screen.getAllByTestId("feedback-state-icon")[0]!).toHaveAttribute(
      "aria-label",
      "Loading state",
    );
  });

  it("renders error state panel as alert", () => {
    render(<ErrorStatePanel description="Unable to save session." />);

    expect(screen.getByTestId("feedback-state-panel")).toHaveAttribute(
      "role",
      "alert",
    );
    expect(screen.getByTestId("feedback-state-panel")).toHaveAttribute(
      "aria-live",
      "assertive",
    );
    expect(screen.getByTestId("feedback-state-title")).toHaveTextContent(
      "Something went wrong",
    );
  });

  it("renders warning state panel as alert", () => {
    render(<WarningStatePanel title="Review required" />);

    expect(screen.getByTestId("feedback-state-panel")).toHaveAttribute(
      "role",
      "alert",
    );
    expect(screen.getByTestId("feedback-state-title")).toHaveTextContent(
      "Review required",
    );
  });

  it("renders success state panel", () => {
    render(<SuccessStatePanel title="Saved" description="Quiz saved." />);

    expect(screen.getByTestId("feedback-state-title")).toHaveTextContent(
      "Saved",
    );
    expect(screen.getByTestId("feedback-state-description")).toHaveTextContent(
      "Quiz saved.",
    );
  });

  it("renders generic feedback panel actions", () => {
    render(
      <FeedbackStatePanel
        kind="info"
        title="Session available"
        actions={<button type="button">Resume</button>}
      />,
    );

    expect(screen.getByTestId("feedback-state-actions")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resume/i })).toBeInTheDocument();
  });

  it("renders inline status message", () => {
    render(
      <InlineStatusMessage kind="success">
        Quiz saved to history.
      </InlineStatusMessage>,
    );

    expect(screen.getByTestId("inline-status-message")).toHaveAttribute(
      "role",
      "status",
    );
    expect(screen.getByTestId("inline-status-message")).toHaveTextContent(
      "Quiz saved to history.",
    );
  });
});








