"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppNav() {
  const pathname = usePathname() ?? "";
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-[6px]">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3 md:px-8">
        <div className="flex items-baseline gap-8">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="display text-[22px] leading-none text-ink">Salvo</span>
            <span className="label !text-[9px]">CONSOLE</span>
          </Link>
          <nav className="hidden items-baseline gap-6 text-[13.5px] md:flex">
            <Tab href="/app" active={pathname === "/app" || pathname === "/app/"}>
              Incidents
            </Tab>
            <Tab href="/method" active={pathname.startsWith("/method")}>Method</Tab>
            <Tab href="/security" active={pathname.startsWith("/security")}>Security</Tab>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 mono text-[10.5px] text-ink-3">
            <span
              aria-hidden
              className="h-[6px] w-[6px] rounded-full signal-pulse"
              style={{ background: "var(--accent)" }}
            />
            <span>watching · 12 sources</span>
          </span>
        </div>
      </div>
    </header>
  );
}

function Tab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={[
        "relative pb-[3px] transition-colors",
        active ? "text-ink" : "text-ink-3 hover:text-ink",
      ].join(" ")}
    >
      {children}
      {active && (
        <span
          aria-hidden
          className="absolute -bottom-[9px] left-0 right-0 h-[2px]"
          style={{ background: "var(--accent)" }}
        />
      )}
    </Link>
  );
}
