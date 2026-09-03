"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", testId: "home" },
  { href: "/create", label: "Create", testId: "create" },
  { href: "/study", label: "Study", testId: "study" },
  { href: "/import-export", label: "Import / Export", testId: "import-export" },
  { href: "/history", label: "History", testId: "history" },
];

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppTopNav() {
  const pathname = usePathname();

  return (
    <header
      data-testid="app-top-nav"
      className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex min-h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          data-testid="app-brand-link"
          className="group inline-flex items-center gap-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <span className="flex size-10 items-center justify-center rounded-2xl bg-emerald-700 text-lg font-bold text-white shadow-sm shadow-emerald-900/20">
            م
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-slate-950">
              Matn Quiz
            </span>
            <span className="block text-xs font-medium text-slate-500">
              Quran & Matn Study
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 md:flex"
        >
          {navItems.map((item) => {
            const active = isActiveRoute(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`top-nav-${item.testId}`}
                aria-current={active ? "page" : undefined}
                className={[
                  "rounded-xl px-3 py-2 text-sm font-semibold transition",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                  active
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-slate-950",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}