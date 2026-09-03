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

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      data-testid="app-bottom-nav"
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/90 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-2xl shadow-slate-950/10 backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1 rounded-3xl bg-slate-50 p-1">
        {navItems.map((item) => {
          const active = isActiveRoute(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`bottom-nav-${item.testId}`}
              aria-current={active ? "page" : undefined}
              className={[
                "flex min-h-14 flex-col items-center justify-center rounded-2xl px-1 text-[0.68rem] font-semibold transition sm:text-xs",
                "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                active
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:bg-white hover:text-slate-900",
              ].join(" ")}
            >
              <span aria-hidden="true" className="text-base leading-none sm:text-lg">
                {item.icon}
              </span>
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}