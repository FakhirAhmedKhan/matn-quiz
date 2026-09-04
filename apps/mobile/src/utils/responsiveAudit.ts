import {
  MOBILE_LAYOUT,
  getResponsiveLayout,
  shouldStackActions,
} from "./responsive";

export type ResponsiveAuditResult = {
  compactPhone: boolean;
  phone: boolean;
  tablet: boolean;
  largeTablet: boolean;
  touchTarget: number;
  compactActionsStack: boolean;
  tabletActionsStack: boolean;
};

export function runResponsiveAudit(): ResponsiveAuditResult {
  const compact =
    getResponsiveLayout(
      320,
      640,
    );

  const phone =
    getResponsiveLayout(
      390,
      844,
    );

  const tablet =
    getResponsiveLayout(
      768,
      1024,
    );

  const largeTablet =
    getResponsiveLayout(
      1024,
      1366,
    );

  return {
    compactPhone:
      compact.isCompactPhone,

    phone:
      phone.isPhone,

    tablet:
      tablet.isTablet,

    largeTablet:
      largeTablet.isLargeTablet,

    touchTarget:
      MOBILE_LAYOUT.minimumTouchTarget,

    compactActionsStack:
      shouldStackActions(
        320,
      ),

    tabletActionsStack:
      shouldStackActions(
        768,
      ),
  };
}