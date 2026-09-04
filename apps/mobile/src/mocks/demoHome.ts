import type { HomeDemoData } from "../types/home";

export const demoHome: HomeDemoData = {
  eyebrow: "QURAN & MATN MEMORIZATION",
  title: "Matn Quiz",
  subtitle: "Quran & Matn Study",
  tagline: "Memorize. Practice. Master.",

  weeklyProgress: 0.68,

  stats: [
    {
      id: "quizzes",
      label: "Quizzes",
      value: "12",
    },
    {
      id: "accuracy",
      label: "Accuracy",
      value: "87%",
    },
    {
      id: "streak",
      label: "Day Streak",
      value: "7",
    },
  ],

  resumeSession: {
    id: "demo-resume-1",
    title: "الأربعون النووية",
    method: "HIDE_WORD",
    methodLabel: "Hide Words",
    revealed: 5,
    total: 10,
    progress: 0.72,
    accuracy: 72,
    lastActivity: "Today",
  },

  recentQuiz: {
    id: "demo-recent-1",
    title: "الأربعون النووية",
    method: "HIDE_WORD",
    methodLabel: "Hide Words",
    hiddenCount: 10,
    progress: 0.68,
  },

  quickActions: [
    {
      id: "books",
      title: "Books",
      description: "Open Library",
      icon: "book-outline",
    },
    {
      id: "poem",
      title: "Poem",
      description: "Poem Reader",
      icon: "reader-outline",
    },
    {
      id: "audio",
      title: "Audio",
      description: "Arabic Learning",
      icon: "headset-outline",
    },
    {
      id: "import-export",
      title: "Import / Export",
      description: "Share Quiz",
      icon: "swap-horizontal-outline",
    },
  ],
};