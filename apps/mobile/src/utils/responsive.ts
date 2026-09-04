export const MOBILE_LAYOUT = {
  compactPhoneMax:
    359,

  phoneMax:
    599,

  tabletMin:
    600,

  largeTabletMin:
    900,

  desktopLikeMin:
    1200,

  minimumTouchTarget:
    44,

  compactHorizontalPadding:
    12,

  phoneHorizontalPadding:
    16,

  tabletHorizontalPadding:
    24,

  largeHorizontalPadding:
    32,

  contentMaxWidth:
    760,

  wideContentMaxWidth:
    960,
} as const;

export type ResponsiveLayoutInfo = {
  width: number;
  height: number;

  isCompactPhone: boolean;
  isPhone: boolean;
  isTablet: boolean;
  isLargeTablet: boolean;
  isWide: boolean;

  horizontalPadding: number;

  contentMaxWidth: number;

  gridColumns:
    1 | 2 | 3;
};

export function getResponsiveLayout(
  width: number,
  height: number,
): ResponsiveLayoutInfo {
  const safeWidth =
    Math.max(
      0,
      width,
    );

  const safeHeight =
    Math.max(
      0,
      height,
    );

  const isCompactPhone =
    safeWidth <=
    MOBILE_LAYOUT.compactPhoneMax;

  const isPhone =
    safeWidth <
    MOBILE_LAYOUT.tabletMin;

  const isTablet =
    safeWidth >=
    MOBILE_LAYOUT.tabletMin;

  const isLargeTablet =
    safeWidth >=
    MOBILE_LAYOUT.largeTabletMin;

  const isWide =
    safeWidth >=
    MOBILE_LAYOUT.desktopLikeMin;

  let horizontalPadding =
    MOBILE_LAYOUT.phoneHorizontalPadding;

  if (isCompactPhone) {
    horizontalPadding =
      MOBILE_LAYOUT.compactHorizontalPadding;
  }
  else if (isLargeTablet) {
    horizontalPadding =
      MOBILE_LAYOUT.largeHorizontalPadding;
  }
  else if (isTablet) {
    horizontalPadding =
      MOBILE_LAYOUT.tabletHorizontalPadding;
  }

  let gridColumns:
    1 | 2 | 3 = 1;

  if (isWide) {
    gridColumns = 3;
  }
  else if (isTablet) {
    gridColumns = 2;
  }

  return {
    width:
      safeWidth,

    height:
      safeHeight,

    isCompactPhone,

    isPhone,

    isTablet,

    isLargeTablet,

    isWide,

    horizontalPadding,

    contentMaxWidth:
      isWide
        ? MOBILE_LAYOUT.wideContentMaxWidth
        : MOBILE_LAYOUT.contentMaxWidth,

    gridColumns,
  };
}

export function getResponsiveGap(
  width: number,
): number {
  if (
    width <=
    MOBILE_LAYOUT.compactPhoneMax
  ) {
    return 8;
  }

  if (
    width >=
    MOBILE_LAYOUT.tabletMin
  ) {
    return 20;
  }

  return 12;
}

export function shouldStackActions(
  width: number,
): boolean {
  return (
    width <
    MOBILE_LAYOUT.tabletMin
  );
}