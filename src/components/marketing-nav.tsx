"use client";

import Link from "next/link";

export function MarketingNav() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <Mark />
          <span className="display text-[22px] leading-none text-ink">Salvo</span>
          <span className="label !text-[9px] hidden sm:inline">v0.9</span>
        </Link>

        <nav className="hidden items-center gap-7 text-[13px] text-ink-2 md:flex">
          <Link href="/app" className="hover:text-ink transition-colors">Incidents</Link>
          <Link href="/method" className="hover:text-ink transition-colors">Method</Link>
          <Link href="/security" className="hover:text-ink transition-colors">Security</Link>
          <Link href="/changelog" className="hover:text-ink transition-colors">Changelog</Link>
        </nav>

        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 bg-ink text-paper px-3.5 py-2 text-[12.5px] font-medium rounded-[4px] hover:bg-ink-2 transition-colors"
        >
          <span>Open console</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    </header>
  );
}

function Mark() {
  return (
    <span aria-hidden className="relative flex h-5 w-5 items-center justify-center">
      <svg viewBox="0 0 20 20" className="h-5 w-5">
        <circle cx={5} cy={10} r={2.3} fill="var(--crit)" />
        <circle cx={15} cy={5.5} r={1.4} fill="var(--warn)" />
        <circle cx={15} cy={14.5} r={1.4} fill="var(--accent)" />
        <path d="M 6.5 10 L 14 6" stroke="var(--ink-3)" strokeWidth={0.7} fill="none" />
        <path d="M 6.5 10 L 14 14" stroke="var(--ink-3)" strokeWidth={0.7} fill="none" />
      </svg>
    </span>
  );
}
