export type MonitoringEventSeverity = "info" | "success" | "warning" | "error";

export type MonitoringEventCategory =
  | "app"
  | "quiz"
  | "study"
  | "review"
  | "storage"
  | "import-export"
  | "performance"
  | "accessibility";

export interface MonitoringEventContext {
  [key: string]: string | number | boolean | null;
}

export interface ClientMonitoringEvent {
  id: string;
  category: MonitoringEventCategory;
  severity: MonitoringEventSeverity;
  message: string;
  createdAt: string;
  context?: MonitoringEventContext;
}

export interface CreateClientMonitoringEventInput {
  category: MonitoringEventCategory;
  severity?: MonitoringEventSeverity;
  message: string;
  context?: MonitoringEventContext;
}

export interface CreateClientMonitoringEventOptions {
  now?: Date;
  random?: () => number;
  id?: string;
}

export interface MonitoringEventSummary {
  total: number;
  info: number;
  success: number;
  warning: number;
  error: number;
  healthy: boolean;
}

export interface MonitoringEventFilters {
  category?: MonitoringEventCategory;
  severity?: MonitoringEventSeverity;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMonitoringEventSeverity(
  value: unknown,
): value is MonitoringEventSeverity {
  return (
    value === "info" ||
    value === "success" ||
    value === "warning" ||
    value === "error"
  );
}

function isMonitoringEventCategory(
  value: unknown,
): value is MonitoringEventCategory {
  return (
    value === "app" ||
    value === "quiz" ||
    value === "study" ||
    value === "review" ||
    value === "storage" ||
    value === "import-export" ||
    value === "performance" ||
    value === "accessibility"
  );
}

function isMonitoringEventContext(
  value: unknown,
): value is MonitoringEventContext {
  if (!isObject(value)) {
    return false;
  }

  return Object.values(value).every(
    (item) =>
      typeof item === "string" ||
      typeof item === "number" ||
      typeof item === "boolean" ||
      item === null,
  );
}

export function createMonitoringEventId(
  now = new Date(),
  random: () => number = Math.random,
): string {
  const timestamp = now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const suffix = Math.floor(random() * 1_000_000)
    .toString(36)
    .padStart(4, "0");

  return `monitor_${timestamp}_${suffix}`;
}

export function createClientMonitoringEvent(
  input: CreateClientMonitoringEventInput,
  options: CreateClientMonitoringEventOptions = {},
): ClientMonitoringEvent {
  const now = options.now ?? new Date();

  return {
    id: options.id ?? createMonitoringEventId(now, options.random),
    category: input.category,
    severity: input.severity ?? "info",
    message:
      input.message.trim().length > 0
        ? input.message.trim()
        : "Monitoring event",
    createdAt: now.toISOString(),
    context: input.context,
  };
}

export function isClientMonitoringEvent(
  value: unknown,
): value is ClientMonitoringEvent {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    value.id.trim().length > 0 &&
    isMonitoringEventCategory(value.category) &&
    isMonitoringEventSeverity(value.severity) &&
    typeof value.message === "string" &&
    value.message.trim().length > 0 &&
    typeof value.createdAt === "string" &&
    value.createdAt.trim().length > 0 &&
    (value.context === undefined || isMonitoringEventContext(value.context))
  );
}

export function serializeMonitoringEvents(
  events: ClientMonitoringEvent[],
): string {
  return JSON.stringify(events, null, 2);
}

export function parseMonitoringEvents(
  value: string | null | undefined,
): ClientMonitoringEvent[] {
  if (!value || value.trim().length === 0) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isClientMonitoringEvent);
  } catch {
    return [];
  }
}

export function filterMonitoringEvents(
  events: ClientMonitoringEvent[],
  filters: MonitoringEventFilters = {},
): ClientMonitoringEvent[] {
  return events.filter((event) => {
    if (filters.category && event.category !== filters.category) {
      return false;
    }

    if (filters.severity && event.severity !== filters.severity) {
      return false;
    }

    return true;
  });
}

export function summarizeMonitoringEvents(
  events: ClientMonitoringEvent[],
): MonitoringEventSummary {
  const info = events.filter((event) => event.severity === "info").length;
  const success = events.filter((event) => event.severity === "success").length;
  const warning = events.filter((event) => event.severity === "warning").length;
  const error = events.filter((event) => event.severity === "error").length;

  return {
    total: events.length,
    info,
    success,
    warning,
    error,
    healthy: error === 0,
  };
}

export function getMonitoringSeverityLabel(
  severity: MonitoringEventSeverity,
): string {
  if (severity === "success") return "Success";
  if (severity === "warning") return "Warning";
  if (severity === "error") return "Error";
  return "Info";
}

export function getMonitoringSeverityTone(
  severity: MonitoringEventSeverity,
): "info" | "success" | "warning" | "danger" {
  if (severity === "success") return "success";
  if (severity === "warning") return "warning";
  if (severity === "error") return "danger";
  return "info";
}

export function getMonitoringHealthLabel(
  summary: MonitoringEventSummary,
): string {
  if (summary.error > 0) return "Needs attention";
  if (summary.warning > 0) return "Warnings detected";
  return "Healthy";
}

export function getMonitoringSummaryText(
  summary: MonitoringEventSummary,
): string {
  return `${summary.total} events · ${summary.error} errors · ${summary.warning} warnings`;
}
