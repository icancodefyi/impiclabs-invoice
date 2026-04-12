"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const nav = [
  { href: "/sniffer", label: "Dashboard", match: (p: string) => p === "/sniffer" },
  {
    href: "/sniffer/tasks",
    label: "Tasks",
    match: (p: string) =>
      p === "/sniffer/tasks" || /^\/sniffer\/tasks\/[^/]+$/.test(p),
  },
  {
    href: "/sniffer/tasks/new",
    label: "New task",
    match: (p: string) => p === "/sniffer/tasks/new",
  },
] as const

export function SnifferShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#f8f8f9] text-zinc-900">
      <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600">
              Internal
            </span>
            <span className="h-4 w-px bg-zinc-200" aria-hidden />
            <span className="text-sm font-semibold tracking-tight text-zinc-900">Sniffer Lab</span>
          </div>
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
            {nav.map(({ href, label, match }) => {
              const active = match(pathname)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  {label}
                </Link>
              )
            })}
            <span className="mx-1 hidden h-4 w-px bg-zinc-200 sm:inline" aria-hidden />
            <Link
              href="/invoice"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
            >
              Invoice
            </Link>
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
    </div>
  )
}
