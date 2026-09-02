import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("@/components/quiz/dynamic-components", async () => {
  const actual = await vi.importActual<typeof import("@/components/quiz")>(
    "@/components/quiz",
  );

  return actual;
});
