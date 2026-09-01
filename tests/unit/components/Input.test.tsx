import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("renders label and placeholder", () => {
    render(
      <Input
        label="Student Name"
        placeholder="Enter name"
      />,
    );

    expect(screen.getByLabelText(/student name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter name/i)).toBeInTheDocument();
  });

  it("allows typing", async () => {
    const user = userEvent.setup();

    render(
      <Input
        label="Student Name"
        placeholder="Enter name"
      />,
    );

    const input = screen.getByLabelText(/student name/i);

    await user.type(input, "Ahmed");

    expect(input).toHaveValue("Ahmed");
  });

  it("shows helper text", () => {
    render(
      <Input
        label="Student Name"
        helperText="This is helper text"
      />,
    );

    expect(screen.getByText(/this is helper text/i)).toBeInTheDocument();
  });

  it("shows error text", () => {
    render(
      <Input
        label="Student Name"
        error="Name is required"
      />,
    );

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  });
});
















