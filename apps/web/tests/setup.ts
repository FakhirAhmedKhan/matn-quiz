import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("@/components/quiz/dynamic-components", async () => {
  const actual = await vi.importActual<typeof import("@/components/quiz")>(
    "@/components/quiz",
  );

  return actual;
});



import { beforeEach as beforeEachQuizWorkflowDraft } from "vitest";

beforeEachQuizWorkflowDraft(() => {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem("matn-quiz:quiz-workflow-draft:v1");
  }
});