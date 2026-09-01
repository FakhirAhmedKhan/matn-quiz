import { describe, expect, it } from "vitest";
import {
  createClientMonitoringEvent,
  getMonitoringHealthLabel,
  summarizeMonitoringEvents,
} from "@/lib/monitoring/client-observability";
import {
  createPerformanceBudgetReport,
  formatPerformanceBudgetMarkdown,
  isPerformanceBudgetReportPassing,
} from "@/lib/monitoring/performance-budget";

describe("Phase 17 complete verification", () => {
  it("verifies client observability summary", () => {
    const summary = summarizeMonitoringEvents([
      createClientMonitoringEvent({
        category: "quiz",
        severity: "success",
        message: "Quiz generated",
      }),
      createClientMonitoringEvent({
        category: "storage",
        severity: "warning",
        message: "Storage unavailable",
      }),
    ]);

    expect(summary.total).toBe(2);
    expect(getMonitoringHealthLabel(summary)).toBe("Warnings detected");
  });

  it("verifies performance budget report", () => {
    const report = createPerformanceBudgetReport({
      "first-contentful-paint": 1200,
      "largest-contentful-paint": 2200,
      "interaction-to-next-paint": 180,
      "cumulative-layout-shift": 0.05,
      "time-to-first-byte": 600,
      "javascript-bundle-kb": 320,
    });

    expect(isPerformanceBudgetReportPassing(report)).toBe(true);
    expect(formatPerformanceBudgetMarkdown(report)).toContain(
      "# Matn Quiz Performance Budget Report",
    );
  });
});

