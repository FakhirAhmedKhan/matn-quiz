"use client";

import Link from "next/link";

import {
  AppContainer,
  AppShell,
  ResponsiveCard,
  ResponsiveCardGrid,
} from "@/components/layout";
import { HomeHeroSection } from "./HomeHeroSection";

const workflowCards = [
  {
    href: "/create",
    testId: "home-create-workflow-link",
    title: "Create Quiz",
    description: "Paste Arabic text and start a new memorization quiz.",
    action: "Create quiz",
  },
  {
    href: "/study",
    testId: "home-study-workflow-link",
    title: "Study",
    description: "Continue your quiz and review hidden answers.",
    action: "Start studying",
  },
  {
    href: "/books",
    testId: "home-books-workflow-link",
    title: "Book Library",
    description: "Browse, upload, verify, and read PDF books.",
    action: "Open library",
  },
  {
    href: "/history",
    testId: "home-history-workflow-link",
    title: "History",
    description: "Open quizzes previously saved in this browser.",
    action: "View history",
  },
];
export function HomePageView() {
  return (
    <AppShell>
      <AppContainer>
        <HomeHeroSection />

        <ResponsiveCardGrid className="grid gap-4 space-y-0 sm:grid-cols-2">
          {workflowCards.map((card) => (
            <ResponsiveCard key={card.href} ariaLabel={card.title}>
              <div className="flex h-full flex-col justify-between gap-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-950">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>
                </div>

                <Link
                  href={card.href}
                  data-testid={card.testId}
                  className="inline-flex min-h-11 w-fit items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-emerald-900/20 transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  {card.action}
                </Link>
              </div>
            </ResponsiveCard>
          ))}
        </ResponsiveCardGrid>
      </AppContainer>
    </AppShell>
  );
}