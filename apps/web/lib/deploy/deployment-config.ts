import {
  PRODUCT_NAME,
  PRODUCT_SITE_URL,
} from "@/lib/release/product-metadata";

export type DeploymentTarget =
  | "vercel"
  | "netlify"
  | "cloudflare-pages"
  | "static-host";

export interface DeploymentTargetConfig {
  target: DeploymentTarget;
  label: string;
  buildCommand: string;
  outputDirectory: string;
  environmentVariables: string[];
  notes: string[];
}

export interface DeploymentEnvironmentVariable {
  name: string;
  value: string;
  required: boolean;
  description: string;
}

export interface DeploymentChecklistItem {
  label: string;
  complete: boolean;
}

export const DEFAULT_DEPLOYMENT_TARGET: DeploymentTarget = "vercel";

export const DEPLOYMENT_CHECKLIST_ITEMS = [
  "Production build passes",
  "Production smoke check passes",
  "NEXT_PUBLIC_SITE_URL configured",
  "Metadata routes available",
  "PWA icons available",
  "Deployment documentation available",
  "CI workflow available",
  "Release checklist complete",
];

export const DEPLOYMENT_TARGETS: DeploymentTargetConfig[] = [
  {
    target: "vercel",
    label: "Vercel",
    buildCommand: "pnpm run build",
    outputDirectory: ".next",
    environmentVariables: ["NEXT_PUBLIC_SITE_URL"],
    notes: [
      "Recommended for Next.js App Router deployment.",
      "Uses the normal Next.js production build output.",
    ],
  },
  {
    target: "netlify",
    label: "Netlify",
    buildCommand: "pnpm run build",
    outputDirectory: ".next",
    environmentVariables: ["NEXT_PUBLIC_SITE_URL"],
    notes: [
      "Use a Next.js-compatible Netlify deployment setup.",
      "Keep NEXT_PUBLIC_SITE_URL aligned with the production domain.",
    ],
  },
  {
    target: "cloudflare-pages",
    label: "Cloudflare Pages",
    buildCommand: "pnpm run build",
    outputDirectory: ".next",
    environmentVariables: ["NEXT_PUBLIC_SITE_URL"],
    notes: [
      "Use a Next.js-compatible Cloudflare Pages deployment setup.",
      "Confirm the platform adapter before production deployment.",
    ],
  },
  {
    target: "static-host",
    label: "Static Host",
    buildCommand: "pnpm run build",
    outputDirectory: ".next",
    environmentVariables: ["NEXT_PUBLIC_SITE_URL"],
    notes: [
      "Use only after confirming the selected host supports the current Next.js output.",
      "For a pure static export, add an explicit static export configuration later.",
    ],
  },
];

export function normalizeDeploymentUrl(
  value: string | undefined | null,
  fallback = PRODUCT_SITE_URL,
): string {
  const candidate = value?.trim();

  if (!candidate) {
    return fallback.replace(/\/+$/, "");
  }

  return candidate.replace(/\/+$/, "");
}

export function getDeploymentSiteUrl(
  value: string | undefined | null = process.env.NEXT_PUBLIC_SITE_URL,
): string {
  return normalizeDeploymentUrl(value);
}

export function getDeploymentTargetConfig(
  target: DeploymentTarget = DEFAULT_DEPLOYMENT_TARGET,
): DeploymentTargetConfig {
  return (
    DEPLOYMENT_TARGETS.find((item) => item.target === target) ??
    DEPLOYMENT_TARGETS[0]
  );
}

export function getDeploymentTargetLabel(
  target: DeploymentTarget = DEFAULT_DEPLOYMENT_TARGET,
): string {
  return getDeploymentTargetConfig(target).label;
}

export function getDeploymentBuildCommand(
  target: DeploymentTarget = DEFAULT_DEPLOYMENT_TARGET,
): string {
  return getDeploymentTargetConfig(target).buildCommand;
}

export function getDeploymentOutputDirectory(
  target: DeploymentTarget = DEFAULT_DEPLOYMENT_TARGET,
): string {
  return getDeploymentTargetConfig(target).outputDirectory;
}

export function getDeploymentEnvironmentVariables(
  siteUrl = getDeploymentSiteUrl(),
): DeploymentEnvironmentVariable[] {
  return [
    {
      name: "NEXT_PUBLIC_SITE_URL",
      value: siteUrl,
      required: true,
      description: `Public canonical URL for ${PRODUCT_NAME}.`,
    },
  ];
}

export function createDeploymentChecklist(
  completedLabels: string[] = DEPLOYMENT_CHECKLIST_ITEMS,
): DeploymentChecklistItem[] {
  const completed = new Set(completedLabels);

  return DEPLOYMENT_CHECKLIST_ITEMS.map((label) => ({
    label,
    complete: completed.has(label),
  }));
}

export function isDeploymentChecklistComplete(
  checklist: DeploymentChecklistItem[],
): boolean {
  return checklist.length > 0 && checklist.every((item) => item.complete);
}

export function getDeploymentReadinessSummary(
  checklist: DeploymentChecklistItem[],
): string {
  const complete = checklist.filter((item) => item.complete).length;

  return `${complete}/${checklist.length} deployment checks complete`;
}

export function getDeploymentReadinessLabel(
  checklist: DeploymentChecklistItem[],
): string {
  return isDeploymentChecklistComplete(checklist)
    ? "Ready to deploy"
    : "Deployment checks remaining";
}

export function getDeploymentCommandSummary(
  target: DeploymentTarget = DEFAULT_DEPLOYMENT_TARGET,
): string {
  const config = getDeploymentTargetConfig(target);

  return `${config.label}: ${config.buildCommand} -> ${config.outputDirectory}`;
}
