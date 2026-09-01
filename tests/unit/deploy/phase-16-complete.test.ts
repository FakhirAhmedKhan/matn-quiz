import { describe, expect, it } from "vitest";
import {
  createDeploymentChecklist,
  getDeploymentCommandSummary,
  getDeploymentEnvironmentVariables,
  getDeploymentReadinessLabel,
  getDeploymentTargetConfig,
  isDeploymentChecklistComplete,
} from "@/lib/deploy/deployment-config";
import {
  createDeploymentReport,
  formatDeploymentReportMarkdown,
  isDeploymentReportReady,
} from "@/lib/deploy/deployment-report";

describe("Phase 16 complete verification", () => {
  it("verifies deployment target configuration", () => {
    expect(getDeploymentTargetConfig("vercel").label).toBe("Vercel");
    expect(getDeploymentCommandSummary("vercel")).toBe(
      "Vercel: pnpm run build -> .next",
    );
    expect(getDeploymentEnvironmentVariables("https://example.com")[0]).toEqual({
      name: "NEXT_PUBLIC_SITE_URL",
      value: "https://example.com",
      required: true,
      description: "Public canonical URL for Matn Quiz.",
    });
  });

  it("verifies deployment checklist readiness", () => {
    const checklist = createDeploymentChecklist();

    expect(isDeploymentChecklistComplete(checklist)).toBe(true);
    expect(getDeploymentReadinessLabel(checklist)).toBe("Ready to deploy");
  });

  it("verifies deployment report readiness", () => {
    const report = createDeploymentReport({
      target: "vercel",
      siteUrl: "https://matn.example.com",
      generatedAt: new Date("2026-09-01T00:00:00.000Z"),
    });

    expect(isDeploymentReportReady(report)).toBe(true);
    expect(formatDeploymentReportMarkdown(report)).toContain(
      "# Matn Quiz Deployment Report",
    );
  });
});


