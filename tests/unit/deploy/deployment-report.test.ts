import { describe, expect, it } from "vitest";
import {
  createDeploymentReport,
  formatDeploymentReportMarkdown,
  getDeploymentReportTitle,
  isDeploymentReportReady,
} from "@/lib/deploy/deployment-report";

describe("deployment report", () => {
  const generatedAt = new Date("2026-09-01T00:00:00.000Z");

  it("creates ready deployment report", () => {
    const report = createDeploymentReport({
      target: "vercel",
      siteUrl: "https://matn.example.com",
      generatedAt,
    });

    expect(report.productName).toBe("Matn Quiz");
    expect(report.target).toBe("vercel");
    expect(report.targetLabel).toBe("Vercel");
    expect(report.siteUrl).toBe("https://matn.example.com");
    expect(report.generatedAt).toBe("2026-09-01T00:00:00.000Z");
    expect(report.ready).toBe(true);
    expect(report.missing).toEqual([]);
    expect(report.readinessLabel).toBe("Ready to deploy");
    expect(isDeploymentReportReady(report)).toBe(true);
  });

  it("creates incomplete deployment report", () => {
    const report = createDeploymentReport({
      completedLabels: ["Production build passes"],
      generatedAt,
    });

    expect(report.ready).toBe(false);
    expect(report.missing.length).toBeGreaterThan(0);
    expect(report.readinessLabel).toBe("Deployment checks remaining");
    expect(isDeploymentReportReady(report)).toBe(false);
  });

  it("formats deployment report markdown", () => {
    const report = createDeploymentReport({
      target: "vercel",
      siteUrl: "https://matn.example.com",
      generatedAt,
    });

    const markdown = formatDeploymentReportMarkdown(report);

    expect(getDeploymentReportTitle(report)).toBe("Matn Quiz Deployment Report");
    expect(markdown).toContain("# Matn Quiz Deployment Report");
    expect(markdown).toContain("Target: Vercel");
    expect(markdown).toContain("Site URL: https://matn.example.com");
    expect(markdown).toContain("- [x] Production build passes");
    expect(markdown).toContain("NEXT_PUBLIC_SITE_URL=https://matn.example.com");
  });
});



