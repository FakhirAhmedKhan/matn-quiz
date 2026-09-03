import { describe, expect, it } from "vitest";
import {
  createDeploymentChecklist,
  DEFAULT_DEPLOYMENT_TARGET,
  DEPLOYMENT_CHECKLIST_ITEMS,
  DEPLOYMENT_TARGETS,
  getDeploymentBuildCommand,
  getDeploymentCommandSummary,
  getDeploymentEnvironmentVariables,
  getDeploymentOutputDirectory,
  getDeploymentReadinessLabel,
  getDeploymentReadinessSummary,
  getDeploymentSiteUrl,
  getDeploymentTargetConfig,
  getDeploymentTargetLabel,
  isDeploymentChecklistComplete,
  normalizeDeploymentUrl,
} from "@/lib/deploy/deployment-config";

describe("deployment config", () => {
  it("defines deployment targets", () => {
    expect(DEFAULT_DEPLOYMENT_TARGET).toBe("vercel");
    expect(DEPLOYMENT_TARGETS.map((item) => item.target)).toEqual([
      "vercel",
      "netlify",
      "cloudflare-pages",
      "static-host",
    ]);
  });

  it("normalizes deployment URLs", () => {
    expect(normalizeDeploymentUrl("https://example.com/")).toBe(
      "https://example.com",
    );
    expect(normalizeDeploymentUrl(" https://example.com/app/// ")).toBe(
      "https://example.com/app",
    );
    expect(getDeploymentSiteUrl("https://matn.example.com/")).toBe(
      "https://matn.example.com",
    );
  });

  it("returns deployment target config", () => {
    expect(getDeploymentTargetConfig("vercel").label).toBe("Vercel");
    expect(getDeploymentTargetLabel("netlify")).toBe("Netlify");
    expect(getDeploymentBuildCommand("vercel")).toBe("pnpm run build");
    expect(getDeploymentOutputDirectory("vercel")).toBe(".next");
  });

  it("returns deployment environment variables", () => {
    expect(getDeploymentEnvironmentVariables("https://example.com")).toEqual([
      {
        name: "NEXT_PUBLIC_SITE_URL",
        value: "https://example.com",
        required: true,
        description: "Public canonical URL for Matn Quiz.",
      },
    ]);
  });

  it("creates deployment checklist", () => {
    const checklist = createDeploymentChecklist(["Production build passes"]);

    expect(checklist).toHaveLength(DEPLOYMENT_CHECKLIST_ITEMS.length);
    expect(checklist[0]).toEqual({
      label: "Production build passes",
      complete: true,
    });
    expect(isDeploymentChecklistComplete(checklist)).toBe(false);
    expect(getDeploymentReadinessSummary(checklist)).toBe(
      `1/${DEPLOYMENT_CHECKLIST_ITEMS.length} deployment checks complete`,
    );
    expect(getDeploymentReadinessLabel(checklist)).toBe(
      "Deployment checks remaining",
    );
  });

  it("detects complete deployment checklist", () => {
    const checklist = createDeploymentChecklist();

    expect(isDeploymentChecklistComplete(checklist)).toBe(true);
    expect(getDeploymentReadinessLabel(checklist)).toBe("Ready to deploy");
  });

  it("returns command summary", () => {
    expect(getDeploymentCommandSummary("vercel")).toBe(
      "Vercel: pnpm run build -> .next",
    );
  });
});



