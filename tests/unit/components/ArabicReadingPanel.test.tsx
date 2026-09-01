import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArabicReadingPanel } from "@/components/quiz/ArabicReadingPanel";

describe("ArabicReadingPanel accessibility", () => {
  it("renders title, description, and Arabic text", () => {
    render(
      <ArabicReadingPanel
        title="Quiz Text"
        description="Read from right to left."
        text="بِسْمِ اللَّهِ"
      />,
    );

    expect(screen.getByTestId("arabic-reading-panel")).toBeInTheDocument();
    expect(screen.getByText("Quiz Text")).toBeInTheDocument();
    expect(screen.getByText("Read from right to left.")).toBeInTheDocument();
    expect(screen.getByTestId("arabic-reading-text")).toHaveTextContent(
      "بِسْمِ اللَّهِ",
    );
  });

  it("uses rtl direction and Arabic language", () => {
    render(<ArabicReadingPanel title="Quiz Text" text="بِسْمِ اللَّهِ" />);

    expect(screen.getByTestId("arabic-reading-text")).toHaveAttribute("dir", "rtl");
    expect(screen.getByTestId("arabic-reading-text")).toHaveAttribute("lang", "ar");
  });

  it("is keyboard focusable with an accessible label", () => {
    render(<ArabicReadingPanel title="Quiz Text" text="بِسْمِ اللَّهِ" />);

    expect(screen.getByTestId("arabic-reading-text")).toHaveAttribute("tabindex", "0");
    expect(screen.getByTestId("arabic-reading-text")).toHaveAttribute(
      "aria-label",
      "Quiz Text Arabic reading area",
    );
  });

  it("shows reading metadata", () => {
    render(<ArabicReadingPanel title="Quiz Text" text="بِسْمِ اللَّهِ" />);

    expect(screen.getByTestId("arabic-reading-panel-meta")).toHaveTextContent(
      "1 line · 14 characters",
    );
  });

  it("supports custom test ids", () => {
    render(
      <ArabicReadingPanel
        title="Quiz Text"
        text="بِسْمِ اللَّهِ"
        testId="custom-panel"
        textTestId="custom-text"
      />,
    );

    expect(screen.getByTestId("custom-panel")).toBeInTheDocument();
    expect(screen.getByTestId("custom-text")).toHaveTextContent("بِسْمِ اللَّهِ");
  });
});


















