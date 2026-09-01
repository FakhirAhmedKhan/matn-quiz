"use client";

import {
  getSkipLinkHref,
  getSkipLinkLabel,
  skipLinkClasses,
} from "@/lib/ui/accessibility-final-pass";
import { cn } from "@/lib/utils/cn";

interface AccessibleSkipLinkProps {
  targetId?: string;
  label?: string;
  className?: string;
}

export function AccessibleSkipLink({
  targetId = "main-content",
  label = "Skip to main content",
  className,
}: AccessibleSkipLinkProps) {
  return (
    <a
      data-testid="skip-to-content-link"
      href={getSkipLinkHref(targetId)}
      className={cn(skipLinkClasses, className)}
    >
      {getSkipLinkLabel(label)}
    </a>
  );
}
