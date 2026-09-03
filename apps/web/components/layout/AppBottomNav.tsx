"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", testId: "home", icon: "⌂" },
  { href: "/create", label: "Create", testId: "create", icon: "+" },
  { href: "/study", label: "Study", testId: "study", icon: "◉" },
  { href: "/import-export", label: "Share", testId: "share", icon: "⇄" },
  { href: "/history", label: "History", testId: "history", icon: "□" },
];

function isActiveRoute(pathname: string | null | undefined, href: string) {
  const currentPathname = pathname ?? "/";

  if (href === "/") {
    return currentPathname === "/";
  }

  return currentPathname === href || currentPathname.startsWith(`${href}/`);
}

export function AppBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      data-testid="app-bottom-nav"
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 shadow-2xl shadow-slate-950/15 backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1 rounded-[1.7rem] border border-slate-200 bg-slate-50/90 p-1">
        {navItems.map((item) => {
          const active = isActiveRoute(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`bottom-nav-${item.testId}`}
              aria-current={active ? "page" : undefined}
              className={[
                "flex min-h-[3.25rem] flex-col items-center justify-center rounded-[1.25rem] px-1 text-[0.66rem] font-bold leading-none transition sm:text-xs",
                "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                active
                  ? "bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200/80"
                  : "text-slate-500 hover:bg-white hover:text-slate-900",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={[
                  "flex size-5 items-center justify-center rounded-full text-sm leading-none transition",
                  active ? "bg-emerald-50" : "",
                ].join(" ")}
              >
                {item.icon}
              </span>
              <span className="mt-1.5 truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}