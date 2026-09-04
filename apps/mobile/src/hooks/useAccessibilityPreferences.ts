import {
  useEffect,
  useState,
} from "react";

import {
  AccessibilityInfo,
} from "react-native";

export type AccessibilityPreferences = {
  screenReaderEnabled:
    boolean;

  reduceMotionEnabled:
    boolean;

  loaded:
    boolean;
};

export function useAccessibilityPreferences(): AccessibilityPreferences {
  const [
    screenReaderEnabled,
    setScreenReaderEnabled,
  ] = useState(false);

  const [
    reduceMotionEnabled,
    setReduceMotionEnabled,
  ] = useState(false);

  const [
    loaded,
    setLoaded,
  ] = useState(false);

  useEffect(() => {
    let active =
      true;

    Promise.all([
      AccessibilityInfo.isScreenReaderEnabled(),
      AccessibilityInfo.isReduceMotionEnabled(),
    ])
      .then(
        ([
          screenReader,
          reducedMotion,
        ]) => {
          if (!active) {
            return;
          }

          setScreenReaderEnabled(
            screenReader,
          );

          setReduceMotionEnabled(
            reducedMotion,
          );

          setLoaded(
            true,
          );
        },
      )
      .catch(
        () => {
          if (active) {
            setLoaded(
              true,
            );
          }
        },
      );

    const screenReaderSubscription =
      AccessibilityInfo.addEventListener(
        "screenReaderChanged",
        (
          enabled,
        ) => {
          setScreenReaderEnabled(
            enabled,
          );
        },
      );

    const reduceMotionSubscription =
      AccessibilityInfo.addEventListener(
        "reduceMotionChanged",
        (
          enabled,
        ) => {
          setReduceMotionEnabled(
            enabled,
          );
        },
      );

    return () => {
      active =
        false;

      screenReaderSubscription.remove();

      reduceMotionSubscription.remove();
    };
  }, []);

  return {
    screenReaderEnabled,

    reduceMotionEnabled,

    loaded,
  };
}