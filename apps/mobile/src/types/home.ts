export type HomeQuizMethod = "HIDE_WORD" | "HIDE_LINE";

export type HomeStat = {
  id: "quizzes" | "accuracy" | "streak";
  label: string;
  value: string;
};

export type HomeResumeSession = {
  id: string;
  title: string;
  method: HomeQuizMethod;
  methodLabel: string;
  revealed: number;
  total: number;
  progress: number;
  accuracy: number;
  lastActivity: string;
};

export type HomeRecentQuiz = {
  id: string;
  title: string;
  method: HomeQuizMethod;
  methodLabel: string;
  hiddenCount: number;
  progress: number;
};

export type HomeQuickAction = {
  id: "books" | "poem" | "audio" | "import-export";
  title: string;
  description: string;
  icon:
    | "book-outline"
    | "reader-outline"
    | "headset-outline"
    | "swap-horizontal-outline";
};

export type HomeDemoData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  tagline: string;

  weeklyProgress: number;

  stats: HomeStat[];

  resumeSession: HomeResumeSession;
  recentQuiz: HomeRecentQuiz;

  quickActions: HomeQuickAction[];
};