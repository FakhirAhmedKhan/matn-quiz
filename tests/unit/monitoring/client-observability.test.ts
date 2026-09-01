import { describe, expect, it } from "vitest";
import {
  createClientMonitoringEvent,
  createMonitoringEventId,
  filterMonitoringEvents,
  getMonitoringHealthLabel,
  getMonitoringSeverityLabel,
  getMonitoringSeverityTone,
  getMonitoringSummaryText,
  isClientMonitoringEvent,
  parseMonitoringEvents,
  serializeMonitoringEvents,
  summarizeMonitoringEvents,
} from "@/lib/monitoring/client-observability";

describe("client observability utilities", () => {
  const now = new Date("2026-09-01T00:00:00.000Z");

  it("creates deterministic monitoring event id", () => {
    expect(createMonitoringEventId(now, () => 0)).toBe(
      "monitor_20260901000000_0000",
    );
  });

  it("creates monitoring event", () => {
    const event = createClientMonitoringEvent(
      {
        category: "quiz",
        severity: "success",
        message: "Quiz generated",
      },
      {
        now,
        id: "monitor_custom",
      },
    );

    expect(event.id).toBe("monitor_custom");
    expect(event.category).toBe("quiz");
    expect(event.severity).toBe("success");
    expect(event.createdAt).toBe("2026-09-01T00:00:00.000Z");
  });

  it("validates monitoring events", () => {
    const event = createClientMonitoringEvent(
      {
        category: "storage",
        severity: "warning",
        message: "Storage unavailable",
      },
      {
        now,
        id: "monitor_storage",
      },
    );

    expect(isClientMonitoringEvent(event)).toBe(true);
    expect(isClientMonitoringEvent({})).toBe(false);
  });

  it("serializes parses and filters monitoring events", () => {
    const events = [
      createClientMonitoringEvent(
        {
          category: "quiz",
          severity: "success",
          message: "Quiz generated",
        },
        {
          now,
          id: "monitor_1",
        },
      ),
      createClientMonitoringEvent(
        {
          category: "storage",
          severity: "error",
          message: "Storage failed",
        },
        {
          now,
          id: "monitor_2",
        },
      ),
    ];

    expect(parseMonitoringEvents(serializeMonitoringEvents(events))).toEqual(
      events,
    );
    expect(parseMonitoringEvents("{bad json")).toEqual([]);
    expect(filterMonitoringEvents(events, { category: "quiz" })).toHaveLength(1);
    expect(filterMonitoringEvents(events, { severity: "error" })).toHaveLength(
      1,
    );
  });

  it("summarizes events", () => {
    const events = [
      createClientMonitoringEvent({
        category: "quiz",
        severity: "success",
        message: "Generated",
      }),
      createClientMonitoringEvent({
        category: "storage",
        severity: "warning",
        message: "Slow",
      }),
    ];

    const summary = summarizeMonitoringEvents(events);

    expect(summary.total).toBe(2);
    expect(summary.warning).toBe(1);
    expect(getMonitoringHealthLabel(summary)).toBe("Warnings detected");
    expect(getMonitoringSummaryText(summary)).toBe(
      "2 events · 0 errors · 1 warnings",
    );
  });

  it("returns severity labels and tones", () => {
    expect(getMonitoringSeverityLabel("info")).toBe("Info");
    expect(getMonitoringSeverityLabel("success")).toBe("Success");
    expect(getMonitoringSeverityLabel("warning")).toBe("Warning");
    expect(getMonitoringSeverityLabel("error")).toBe("Error");

    expect(getMonitoringSeverityTone("info")).toBe("info");
    expect(getMonitoringSeverityTone("success")).toBe("success");
    expect(getMonitoringSeverityTone("warning")).toBe("warning");
    expect(getMonitoringSeverityTone("error")).toBe("danger");
  });
});

