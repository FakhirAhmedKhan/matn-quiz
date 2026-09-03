import {
  createDeploymentChecklist,
  DEFAULT_DEPLOYMENT_TARGET,
  getDeploymentCommandSummary,
  getDeploymentEnvironmentVariables,
  getDeploymentReadinessLabel,
  getDeploymentReadinessSummary,
  getDeploymentSiteUrl,
  getDeploymentTargetLabel,
  isDeploymentChecklistComplete,
  type DeploymentChecklistItem,
  type DeploymentTarget,
} from "@/lib/deploy/deployment-config";
import { PRODUCT_NAME } from "@/lib/release/product-metadata";

export interface DeploymentReport {
  productName: string;
  target: DeploymentTarget;
  targetLabel: string;
  siteUrl: string;
  generatedAt: string;
  checklist: DeploymentChecklistItem[];
  ready: boolean;
  readinessLabel: string;
  readinessSummary: string;
  commandSummary: string;
  environmentVariables: ReturnType<typeof getDeploymentEnvironmentVariables>;
  missing: string[];
}

export interface CreateDeploymentReportOptions {
  target?: DeploymentTarget;
  siteUrl?: string;
  generatedAt?: Date;
  completedLabels?: string[];
}

export function createDeploymentReport(
  options: CreateDeploymentReportOptions = {},
): DeploymentReport {
  const target = options.target ?? DEFAULT_DEPLOYMENT_TARGET;
  const siteUrl = getDeploymentSiteUrl(options.siteUrl);
  const checklist = createDeploymentChecklist(options.completedLabels);
  const ready = isDeploymentChecklistComplete(checklist);
  const generatedAt = options.generatedAt ?? new Date();

  return {
    productName: PRODUCT_NAME,
    target,
    targetLabel: getDeploymentTargetLabel(target),
    siteUrl,
    generatedAt: generatedAt.toISOString(),
    checklist,
    ready,
    readinessLabel: getDeploymentReadinessLabel(checklist),
    readinessSummary: getDeploymentReadinessSummary(checklist),
    commandSummary: getDeploymentCommandSummary(target),
    environmentVariables: getDeploymentEnvironmentVariables(siteUrl),
    missing: checklist
      .filter((item) => !item.complete)
      .map((item) => item.label),
  };
}

export function getDeploymentReportTitle(report: DeploymentReport): string {
  return `${report.productName} Deployment Report`;
}

export function formatDeploymentReportMarkdown(
  report: DeploymentReport,
): string {
  const checklist = report.checklist
    .map((item) => `- [${item.complete ? "x" : " "}] ${item.label}`)
    .join("\n");

  const env = report.environmentVariables
    .map((item) => `- ${item.name}=${item.value}`)
    .join("\n");

  const missing =
    report.missing.length > 0
      ? report.missing.map((item) => `- ${item}`).join("\n")
      : "- No missing deployment items.";

  return [
    `# ${getDeploymentReportTitle(report)}`,
    "",
    `Generated at: ${report.generatedAt}`,
    "",
    `Target: ${report.targetLabel}`,
    `Site URL: ${report.siteUrl}`,
    `Status: ${report.readinessLabel}`,
    `Summary: ${report.readinessSummary}`,
    `Command: ${report.commandSummary}`,
    "",
    "## Environment Variables",
    "",
    env,
    "",
    "## Checklist",
    "",
    checklist,
    "",
    "## Missing Items",
    "",
    missing,
    "",
  ].join("\n");
}

export function isDeploymentReportReady(report: DeploymentReport): boolean {
  return report.ready && report.missing.length === 0;
}
