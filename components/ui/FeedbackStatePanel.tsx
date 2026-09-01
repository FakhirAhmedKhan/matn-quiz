"use client";

import type { ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2,
  SearchX,
  TriangleAlert,
} from "lucide-react";
import {
  getFeedbackStateAriaLive,
  getFeedbackStateDefaultTitle,
  getFeedbackStateDescription,
  getFeedbackStateIconClasses,
  getFeedbackStateIconLabel,
  getFeedbackStateRole,
  getFeedbackStateTone,
  getFeedbackStateToneClasses,
  type FeedbackStateKind,
} from "@/lib/ui/feedback-state";
import { cn } from "@/lib/utils/cn";

interface FeedbackStatePanelProps {
  kind: FeedbackStateKind;
  title?: string;
  description?: string;
  actions?: ReactNode;
  compact?: boolean;
  testId?: string;
  className?: string;
}

type PresetFeedbedackStatePanelProps = Omit<FeedbackStatePanelProps, "kind">

function FeedbackIcon({ kind }: { kind: FeedbackStateKind }) {
  const tone = getFeedbackStateTone(kind);
  const iconClasses = cn(
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1",
    getFeedbackStateIconClasses(tone),
  );

  return (
    <span
      data-testid="feedback-state-icon"
      aria-label={getFeedbackStateIconLabel(kind)}
      className={iconClasses}
    >
      {kind === "empty" && <SearchX className="h-5 w-5" />}
      {kind === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
      {kind === "success" && <CheckCircle2 className="h-5 w-5" />}
      {kind === "warning" && <TriangleAlert className="h-5 w-5" />}
      {kind === "error" && <AlertCircle className="h-5 w-5" />}
      {kind === "info" && <Info className="h-5 w-5" />}
    </span>
  );
}

export function FeedbackStatePanel({
  kind,
  title,
  description,
  actions,
  compact = false,
  testId = "feedback-state-panel",
  className,
}: FeedbackStatePanelProps) {
  const tone = getFeedbackStateTone(kind);

  return (
    <section
      data-testid={testId}
      role={getFeedbackStateRole(kind)}
      aria-live={getFeedbackStateAriaLive(kind)}
      className={cn(
        "rounded-2xl border",
        compact ? "p-4" : "p-5 sm:p-6",
        getFeedbackStateToneClasses(tone),
        className,
      )}
    >
      <div className="flex gap-3">
        <FeedbackIcon kind={kind} />

        <div className="min-w-0 flex-1">
          <h3
            data-testid="feedback-state-title"
            className="text-sm font-semibold sm:text-base"
          >
            {title ?? getFeedbackStateDefaultTitle(kind)}
          </h3>

          <p
            data-testid="feedback-state-description"
            className="mt-1 text-sm leading-6 opacity-85"
          >
            {getFeedbackStateDescription(kind, description)}
          </p>

          {actions && (
            <div
              data-testid="feedback-state-actions"
              className="mt-4 flex flex-wrap gap-2"
            >
              {actions}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function EmptyStatePanel(props: PresetFeedbackStatePanelProps) {
  return <FeedbackStatePanel kind="empty" {...props} />;
}

export function LoadingStatePanel(props: PresetFeedbackStatePanelProps) {
  return <FeedbackStatePanel kind="loading" {...props} />;
}

export function ErrorStatePanel(props: PresetFeedbackStatePanelProps) {
  return <FeedbackStatePanel kind="error" {...props} />;
}

export function SuccessStatePanel(props: PresetFeedbackStatePanelProps) {
  return <FeedbackStatePanel kind="success" {...props} />;
}

export function WarningStatePanel(props: PresetFeedbackStatePanelProps) {
  return <FeedbackStatePanel kind="warning" {...props} />;
}

export function InfoStatePanel(props: PresetFeedbackStatePanelProps) {
  return <FeedbackStatePanel kind="info" {...props} />;
}

export function InlineStatusMessage({
  kind,
  children,
  testId = "inline-status-message",
  className,
}: {
  kind: FeedbackStateKind;
  children: ReactNode;
  testId?: string;
  className?: string;
}) {
  const tone = getFeedbackStateTone(kind);

  return (
    <p
      data-testid={testId}
      role={getFeedbackStateRole(kind)}
      aria-live={getFeedbackStateAriaLive(kind)}
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm leading-6",
        getFeedbackStateToneClasses(tone),
        className,
      )}
    >
      {children}
    </p>
  );
}
