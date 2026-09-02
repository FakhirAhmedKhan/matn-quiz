"use client";

import dynamic from "next/dynamic";

function LoadingEditor() {
  return <p>Loading editor...</p>;
}

function LoadingPreview() {
  return <p>Loading preview...</p>;
}

function LoadingPanel() {
  return <p>Loading panel...</p>;
}

export const QuranTextInput = dynamic(
  () => import("./QuranTextInput").then((mod) => mod.QuranTextInput),
  {
    loading: LoadingEditor,
  },
);

export const QuizMethodSelector = dynamic(
  () => import("./QuizMethodSelector").then((mod) => mod.QuizMethodSelector),
  {
    loading: LoadingPanel,
  },
);

export const HideCountSelector = dynamic(
  () => import("./HideCountSelector").then((mod) => mod.HideCountSelector),
  {
    loading: LoadingPanel,
  },
);

export const GeneratedQuizPreview = dynamic(
  () => import("./GeneratedQuizPreview").then((mod) => mod.GeneratedQuizPreview),
  {
    loading: LoadingPreview,
    ssr: false,
  },
);

export const SavedQuizHistory = dynamic(
  () => import("./SavedQuizHistory").then((mod) => mod.SavedQuizHistory),
  {
    loading: LoadingPanel,
    ssr: false,
  },
);

export const ShareableQuizPanel = dynamic(
  () => import("./ShareableQuizPanel").then((mod) => mod.ShareableQuizPanel),
  {
    loading: LoadingPanel,
    ssr: false,
  },
);

export const StudySessionResumePanel = dynamic(
  () =>
    import("./StudySessionResumePanel").then(
      (mod) => mod.StudySessionResumePanel,
    ),
  {
    loading: LoadingPanel,
    ssr: false,
  },
);
