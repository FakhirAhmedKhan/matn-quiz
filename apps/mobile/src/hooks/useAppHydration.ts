import {
  useEffect,
  useState,
} from "react";

import {
  useAudioStore,
} from "../store/audioStore";

import {
  useBookStore,
} from "../store/bookStore";

import {
  usePoemStore,
} from "../store/poemStore";

import {
  useQuizStore,
} from "../store/quizStore";

import {
  useSettingsStore,
} from "../store/settingsStore";

function allStoresHydrated(): boolean {
  return (
    useSettingsStore.persist.hasHydrated() &&
    useQuizStore.persist.hasHydrated() &&
    usePoemStore.persist.hasHydrated() &&
    useBookStore.persist.hasHydrated() &&
    useAudioStore.persist.hasHydrated()
  );
}

export function useAppHydration(): boolean {
  const [
    hydrated,
    setHydrated,
  ] = useState(
    allStoresHydrated(),
  );

  useEffect(() => {
    function update() {
      setHydrated(
        allStoresHydrated(),
      );
    }

    const unsubscribers = [
      useSettingsStore.persist.onFinishHydration(
        update,
      ),

      useQuizStore.persist.onFinishHydration(
        update,
      ),

      usePoemStore.persist.onFinishHydration(
        update,
      ),

      useBookStore.persist.onFinishHydration(
        update,
      ),

      useAudioStore.persist.onFinishHydration(
        update,
      ),
    ];

    update();

    return () => {
      unsubscribers.forEach(
        (unsubscribe) =>
          unsubscribe(),
      );
    };
  }, []);

  return hydrated;
}