"use client";

import { Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui";
import { useArabicTts } from "@/hooks/useArabicTts";
import { cn } from "@/lib/utils/cn";

export interface ArabicTtsControlsProps {
  speakableText: string;
  label?: string;
  disabled?: boolean;
  hiddenWarning?: string;
  className?: string;
  testId?: string;
}

export function ArabicTtsControls({
  speakableText,
  label = "Speak visible text",
  disabled = false,
  hiddenWarning = "Hidden text cannot be played.",
  className,
  testId = "arabic-tts-controls",
}: ArabicTtsControlsProps) {
  const { status, isSupported, speak, stop } = useArabicTts();

  const hasSpeakableText = speakableText.trim().length > 0;
  const isBusy = status === "loading" || status === "speaking";
  const isDisabled = disabled || !hasSpeakableText || !isSupported || isBusy;

  const statusText = !hasSpeakableText
    ? hiddenWarning
    : !isSupported || status === "unsupported"
      ? "Audio playback is not supported in this browser."
      : status === "provider-missing"
        ? "Cloud Arabic audio is not configured. Add Azure Speech settings to .env.local."
        : status === "loading"
          ? "Preparing Arabic audio..."
          : status === "speaking"
            ? "Playing visible Arabic text."
            : status === "stopped"
              ? "Audio stopped."
              : status === "error"
                ? "Unable to play Arabic audio."
                : "Ready to play visible Arabic text.";

  return (
    <div
      data-testid={testId}
      className={cn(
        "rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-950">
            Arabic Text-to-Speech
          </p>
          <p
            data-testid="arabic-tts-status"
            role="status"
            aria-live="polite"
            className="mt-1 text-sm leading-6 text-emerald-800"
          >
            {statusText}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={isDisabled}
            aria-label={label}
            onClick={() => speak(speakableText)}
          >
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            <span>{status === "loading" ? "Preparing..." : label}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!isSupported}
            aria-label="Stop Arabic audio"
            onClick={stop}
          >
            <Square className="h-4 w-4" aria-hidden="true" />
            <span>Stop</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
