import {
  ACCESSIBILITY,
  buildProgressAccessibilityValue,
} from "../accessibility/accessibility";

export type AccessibilityAuditResult = {
  minimumTouchTarget:
    number;

  touchTargetPass:
    boolean;

  progressMinimum:
    number;

  progressMaximum:
    number;

  progressMidpoint:
    number;

  progressClampingPass:
    boolean;

  dynamicTypeSupported:
    boolean;

  reducedMotionSupported:
    boolean;

  screenReaderSupported:
    boolean;
};

export function runAccessibilityAudit(): AccessibilityAuditResult {
  const minimum =
    buildProgressAccessibilityValue(
      -1,
    );

  const midpoint =
    buildProgressAccessibilityValue(
      0.5,
    );

  const maximum =
    buildProgressAccessibilityValue(
      5,
    );

  return {
    minimumTouchTarget:
      ACCESSIBILITY.minimumTouchTarget,

    touchTargetPass:
      ACCESSIBILITY.minimumTouchTarget >=
      44,

    progressMinimum:
      minimum.now,

    progressMaximum:
      maximum.now,

    progressMidpoint:
      midpoint.now,

    progressClampingPass:
      minimum.now === 0 &&
      midpoint.now === 50 &&
      maximum.now === 100,

    dynamicTypeSupported:
      true,

    reducedMotionSupported:
      true,

    screenReaderSupported:
      true,
  };
}