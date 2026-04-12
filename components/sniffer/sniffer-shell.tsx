"use client"

import { IconMenu2, IconX } from "@tabler/icons-react"
import { Link } from "next-view-transitions"
import { usePathname } from "next/navigation"
import * as React from "react"

import { cn } from "@/lib/utils"

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

const navLinkClass = (active: boolean) =>
  cn(
    "flex min-h-11 items-center rounded-xl px-3.5 text-sm font-medium transition touch-manipulation",
    active
      ? "bg-zinc-900 text-white"
      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200/80"
  )

const navLinkClassDesktop = (active: boolean) =>
  cn(
    "rounded-lg px-3 py-2 text-sm font-medium transition touch-manipulation",
    active
      ? "bg-zinc-900 text-white"
      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
  )

/** Header bar height for aligning the mobile drawer (py-3 + h-10 row ≈ 4rem). */
const MOBILE_DRAWER_TOP = "top-16"

export function SnifferShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  React.useEffect(() => {
    if (!mobileOpen) {
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  return (
    <div className="min-h-screen bg-[#f8f8f9] text-zinc-900">
      {/* z-[100]: stay above mobile overlay (fixed siblings below use z-90) */}
      <header className="sticky top-0 z-[100] border-b border-zinc-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-600 sm:text-[11px]">
              Internal
            </span>
            <span className="h-4 w-px shrink-0 bg-zinc-200" aria-hidden />
            <span className="truncate text-sm font-semibold tracking-tight text-zinc-900">
              Sniffer Lab
            </span>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-800 shadow-sm transition hover:bg-zinc-50 active:bg-zinc-100 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="sniffer-mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <IconX className="h-[1.15rem] w-[1.15rem]" stroke={2} /> : <IconMenu2 className="h-[1.15rem] w-[1.15rem]" stroke={2} />}
          </button>

          <nav
            className="hidden items-center gap-1 lg:flex lg:gap-2"
            aria-label="Sniffer navigation"
          >
            {nav.map(({ href, label, match }) => {
              const active = match(pathname)
              return (
                <Link key={href} href={href} className={navLinkClassDesktop(active)}>
                  {label}
                </Link>
              )
            })}
            <span className="mx-1 hidden h-4 w-px bg-zinc-200 lg:inline" aria-hidden />
            <Link
              href="/invoice"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
            >
              Invoice
            </Link>
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Outside <header>: backdrop-filter on header creates a containing block that breaks
          position:fixed children. Sibling layer uses viewport-fixed positioning. */}
      <div
        id="sniffer-mobile-nav"
        className={cn(
          "fixed inset-0 z-[90] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-zinc-950/50 backdrop-blur-[2px] transition-opacity duration-200",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          tabIndex={mobileOpen ? 0 : -1}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
        <nav
          className={cn(
            MOBILE_DRAWER_TOP,
            "absolute right-0 bottom-0 flex w-[min(100%,20rem)] flex-col gap-0.5 overflow-y-auto border-l border-zinc-200/90 bg-white p-3 pb-10 shadow-2xl transition-transform duration-200 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
          aria-label="Sniffer navigation"
        >
          {nav.map(({ href, label, match }) => {
            const active = match(pathname)
            return (
              <Link
                key={href}
                href={href}
                className={navLinkClass(active)}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            )
          })}
          <div className="my-2 border-t border-zinc-100" role="separator" />
          <Link href="/invoice" className={navLinkClass(false)} onClick={() => setMobileOpen(false)}>
            Invoice
          </Link>
          <Link href="/" className={navLinkClass(false)} onClick={() => setMobileOpen(false)}>
            Home
          </Link>
        </nav>
      </div>

      <main className="sniffer-safe-pb relative z-0 mx-auto max-w-5xl px-4 py-6 sm:py-10">{children}</main>
    </div>
  )
}
