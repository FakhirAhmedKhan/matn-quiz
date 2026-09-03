import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Textarea } from "@/components/ui/Textarea";

describe("Textarea", () => {
  it("renders label and helper text", () => {
    render(
      <Textarea
        label="Arabic Text"
        helperText="Paste Quran text here"
      />,
    );

    expect(screen.getByLabelText(/arabic text/i)).toBeInTheDocument();
    expect(screen.getByText(/paste quran text here/i)).toBeInTheDocument();
  });

  it("allows Arabic typing", async () => {
    const user = userEvent.setup();

    render(
      <Textarea
        label="Arabic Text"
        rtl
      />,
    );

    const textarea = screen.getByLabelText(/arabic text/i);

    await user.type(textarea, "بِسْمِ اللَّهِ");

    expect(textarea).toHaveValue("بِسْمِ اللَّهِ");
  });

  it("sets RTL direction when rtl is true", () => {
    render(
      <Textarea
        label="Arabic Text"
        rtl
      />,
    );

    expect(screen.getByLabelText(/arabic text/i)).toHaveAttribute("dir", "rtl");
  });

  it("shows max length counter", () => {
    render(
      <Textarea
        label="Arabic Text"
        value="abc"
        maxLength={100}
        readOnly
      />,
    );

    expect(screen.getByText("3/100")).toBeInTheDocument();
  });
});





















