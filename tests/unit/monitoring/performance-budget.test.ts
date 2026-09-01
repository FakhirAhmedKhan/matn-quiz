import { describe, expect, it } from "vitest";
import {
  createPerformanceBudgetReport,
  DEFAULT_PERFORMANCE_BUDGETS,
  evaluatePerformanceBudgetMetric,
  formatPerformanceBudgetMarkdown,
  formatPerformanceBudgetValue,
  getPerformanceBudgetMetric,
  getPerformanceBudgetStatusTone,
  isPerformanceBudgetReportPassing,
} from "@/lib/monitoring/performance-budget";

describe("performance budget utilities", () => {
  const generatedAt = new Date("2026-09-01T00:00:00.000Z");

  it("defines default performance budgets", () => {
    expect(DEFAULT_PERFORMANCE_BUDGETS).toHaveLength(6);
    expect(getPerformanceBudgetMetric("largest-contentful-paint").label).toBe(
      "Largest Contentful Paint",
    );
  });

  it("formats performance values", () => {
    expect(formatPerformanceBudgetValue(null, "ms")).toBe("Missing");
    expect(formatPerformanceBudgetValue(1234.4, "ms")).toBe("1234 ms");
    expect(formatPerformanceBudgetValue(123.6, "kb")).toBe("124 kb");
    expect(formatPerformanceBudgetValue(0.1234, "score")).toBe("0.12");
  });

  it("evaluates budget values", () => {
    const metric = getPerformanceBudgetMetric("largest-contentful-paint");

    expect(evaluatePerformanceBudgetMetric(metric, 2000).status).toBe("pass");
    expect(evaluatePerformanceBudgetMetric(metric, 3000).status).toBe("warn");
    expect(evaluatePerformanceBudgetMetric(metric, 5000).status).toBe("fail");
    expect(evaluatePerformanceBudgetMetric(metric, null).status).toBe("missing");
  });

  it("creates reports", () => {
    const report = createPerformanceBudgetReport(
      {
        "largest-contentful-paint": 2000,
        "cumulative-layout-shift": 0.05,
      },
      generatedAt,
    );

    expect(report.generatedAt).toBe("2026-09-01T00:00:00.000Z");
    expect(report.passing).toBe(true);
    expect(isPerformanceBudgetReportPassing(report)).toBe(true);
    expect(formatPerformanceBudgetMarkdown(report)).toContain(
      "# Matn Quiz Performance Budget Report",
    );
  });

  it("returns status tones", () => {
    expect(getPerformanceBudgetStatusTone("pass")).toBe("success");
    expect(getPerformanceBudgetStatusTone("warn")).toBe("warning");
    expect(getPerformanceBudgetStatusTone("fail")).toBe("danger");
    expect(getPerformanceBudgetStatusTone("missing")).toBe("info");
  });
});

