export type PerformanceBudgetMetricName =
  | "first-contentful-paint"
  | "largest-contentful-paint"
  | "interaction-to-next-paint"
  | "cumulative-layout-shift"
  | "time-to-first-byte"
  | "javascript-bundle-kb";

export type PerformanceBudgetUnit = "ms" | "score" | "kb";

export type PerformanceBudgetStatus = "pass" | "warn" | "fail" | "missing";

export interface PerformanceBudgetMetric {
  name: PerformanceBudgetMetricName;
  label: string;
  unit: PerformanceBudgetUnit;
  good: number;
  warning: number;
  description: string;
}

export interface PerformanceBudgetEvaluation {
  metric: PerformanceBudgetMetric;
  value: number | null;
  status: PerformanceBudgetStatus;
  label: string;
}

export interface PerformanceBudgetReport {
  generatedAt: string;
  evaluations: PerformanceBudgetEvaluation[];
  passing: boolean;
  summary: string;
}

export type PerformanceBudgetValues = Partial<
  Record<PerformanceBudgetMetricName, number>
>;

export const DEFAULT_PERFORMANCE_BUDGETS: PerformanceBudgetMetric[] = [
  {
    name: "first-contentful-paint",
    label: "First Contentful Paint",
    unit: "ms",
    good: 1800,
    warning: 3000,
    description: "Time until the first visible content appears.",
  },
  {
    name: "largest-contentful-paint",
    label: "Largest Contentful Paint",
    unit: "ms",
    good: 2500,
    warning: 4000,
    description: "Time until the largest visible content finishes rendering.",
  },
  {
    name: "interaction-to-next-paint",
    label: "Interaction to Next Paint",
    unit: "ms",
    good: 200,
    warning: 500,
    description: "Responsiveness after a user interaction.",
  },
  {
    name: "cumulative-layout-shift",
    label: "Cumulative Layout Shift",
    unit: "score",
    good: 0.1,
    warning: 0.25,
    description: "Visual layout movement during page load.",
  },
  {
    name: "time-to-first-byte",
    label: "Time to First Byte",
    unit: "ms",
    good: 800,
    warning: 1800,
    description: "Server response start time.",
  },
  {
    name: "javascript-bundle-kb",
    label: "JavaScript Bundle",
    unit: "kb",
    good: 350,
    warning: 700,
    description: "Approximate client JavaScript budget.",
  },
];

export function getPerformanceBudgetMetric(
  name: PerformanceBudgetMetricName,
): PerformanceBudgetMetric {
  const metric = DEFAULT_PERFORMANCE_BUDGETS.find(
    (item) => item.name === name,
  );

  if (!metric) {
    throw new Error(`Unknown performance budget metric: ${name}`);
  }

  return metric;
}

export function formatPerformanceBudgetValue(
  value: number | null,
  unit: PerformanceBudgetUnit,
): string {
  if (value === null || !Number.isFinite(value)) {
    return "Missing";
  }

  if (unit === "score") {
    return value.toFixed(2);
  }

  return `${Math.round(value)} ${unit}`;
}

export function evaluatePerformanceBudgetMetric(
  metric: PerformanceBudgetMetric,
  value: number | null | undefined,
): PerformanceBudgetEvaluation {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return {
      metric,
      value: null,
      status: "missing",
      label: "Missing",
    };
  }

  if (value <= metric.good) {
    return {
      metric,
      value,
      status: "pass",
      label: "Good",
    };
  }

  if (value <= metric.warning) {
    return {
      metric,
      value,
      status: "warn",
      label: "Needs attention",
    };
  }

  return {
    metric,
    value,
    status: "fail",
    label: "Over budget",
  };
}

export function createPerformanceBudgetReport(
  values: PerformanceBudgetValues = {},
  generatedAt = new Date(),
): PerformanceBudgetReport {
  const evaluations = DEFAULT_PERFORMANCE_BUDGETS.map((metric) =>
    evaluatePerformanceBudgetMetric(metric, values[metric.name]),
  );

  const failCount = evaluations.filter(
    (item) => item.status === "fail",
  ).length;
  const warnCount = evaluations.filter((item) => item.status === "warn").length;
  const missingCount = evaluations.filter(
    (item) => item.status === "missing",
  ).length;

  return {
    generatedAt: generatedAt.toISOString(),
    evaluations,
    passing: failCount === 0,
    summary: `${failCount} failed · ${warnCount} warnings · ${missingCount} missing`,
  };
}

export function getPerformanceBudgetStatusTone(
  status: PerformanceBudgetStatus,
): "success" | "warning" | "danger" | "info" {
  if (status === "pass") return "success";
  if (status === "warn") return "warning";
  if (status === "fail") return "danger";
  return "info";
}

export function isPerformanceBudgetReportPassing(
  report: PerformanceBudgetReport,
): boolean {
  return report.passing;
}

export function formatPerformanceBudgetMarkdown(
  report: PerformanceBudgetReport,
): string {
  const rows = report.evaluations
    .map((evaluation) => {
      const value = formatPerformanceBudgetValue(
        evaluation.value,
        evaluation.metric.unit,
      );

      return `| ${evaluation.metric.label} | ${value} | ${evaluation.label} |`;
    })
    .join("\n");

  return [
    "# Matn Quiz Performance Budget Report",
    "",
    `Generated at: ${report.generatedAt}`,
    "",
    `Summary: ${report.summary}`,
    "",
    "| Metric | Value | Status |",
    "| --- | ---: | --- |",
    rows,
    "",
  ].join("\n");
}
