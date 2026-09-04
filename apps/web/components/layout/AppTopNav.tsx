"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", testId: "home" },
  { href: "/create", label: "Create", testId: "create" },
  { href: "/study", label: "Study", testId: "study" },
  { href: "/poem", label: "Poem", testId: "poem" },
{ href: "/books", label: "Books", testId: "books" },
  // { href: "/import-export", label: "Import / Export", testId: "import-export" },
  { href: "/history", label: "History", testId: "history" },
];

function getSafePathname(pathname: string | null | undefined) {
  return pathname ?? "/";
}

function isActiveRoute(pathname: string | null | undefined, href: string) {
  const currentPathname = getSafePathname(pathname);

  if (href === "/") {
    return currentPathname === "/";
  }

  return currentPathname === href || currentPathname.startsWith(`${href}/`);
}

function getCurrentLabel(pathname: string | null | undefined) {
  const currentPathname = getSafePathname(pathname);
  const currentItem =
    navItems.find((item) => isActiveRoute(currentPathname, item.href)) ??
    navItems[0];

  return currentItem.label;
}

export function AppTopNav() {
  const pathname = usePathname();
  const currentLabel = getCurrentLabel(pathname);

  return (
    <header
      data-testid="app-top-nav"
      className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm shadow-slate-950/[0.03] backdrop-blur-xl"
    >
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          data-testid="app-brand-link"
          aria-label="Matn Quiz home"
          className="group inline-flex min-w-0 items-center gap-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <Image src="/matn-quiz-header-icon.png" alt="Matn Quiz" width={40} height={40} className="size-10 shrink-0 rounded-2xl object-cover shadow-sm shadow-emerald-900/20" />

          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-bold text-slate-950 sm:text-base">
              Matn Quiz
            </span>
            <span className="block truncate text-xs font-medium text-slate-500">
              Quran & Matn Study
            </span>
          </span>
        </Link>

        <div
          data-testid="mobile-current-route-pill"
          className="inline-flex shrink-0 items-center rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 md:hidden"
        >
          {currentLabel}
        </div>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 rounded-3xl border border-slate-200 bg-slate-50 p-1 shadow-inner md:flex"
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
                  "rounded-2xl px-3 py-2.5 text-sm font-bold transition lg:px-4",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                  active
                    ? "bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200/80"
                    : "text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-sm",
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
