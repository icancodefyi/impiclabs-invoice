import Image from "next/image"
import Link from "next/link"
import { Link as VtLink } from "next-view-transitions"

import { COMPANY_DETAILS } from "@/config/company"

const tools = [
  {
    href: "/invoice",
    label: "Invoice Studio",
    description: "Generate A4 invoices, export PDF, and print.",
    tag: "Billing",
    accent: "#6C5CE7",
    accentBg: "#F0EEFF",
    icon: "🧾",
    Component: Link,
  },
  {
    href: "/sniffer",
    label: "Sniffer Lab",
    description: "Team task board — track, assign, and discuss work.",
    tag: "Tasks",
    accent: "#0284c7",
    accentBg: "#EFF6FF",
    icon: "🔍",
    Component: VtLink,
  },
  {
    href: "/finance",
    label: "Finance",
    description: "Track revenue, expenses, and monthly P&L.",
    tag: "Internal",
    accent: "#059669",
    accentBg: "#ECFDF5",
    icon: "📊",
    Component: Link,
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/40 px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-xl">

        {/* Hero */}
        <header className="mb-12 text-center sm:mb-16">
          <div className="mb-5 inline-flex rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <Image src="/assets/logo.png" alt="Impic Labs" width={48} height={48} priority />
          </div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
            {COMPANY_DETAILS.name}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Internal HQ
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
            Private tools for the team — fast, focused, no distractions.
          </p>
        </header>

        {/* Tools */}
        <ul className="space-y-3">
          {tools.map(({ href, label, description, tag, accent, accentBg, icon, Component }) => (
            <li key={href}>
              <Component
                href={href}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm transition-all duration-150 hover:-translate-y-px hover:border-slate-300 hover:shadow-md active:translate-y-0 sm:px-6 sm:py-5"
              >
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl text-xl sm:size-12"
                  style={{ background: accentBg }}
                >
                  {icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-semibold text-slate-900">{label}</p>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{ background: accentBg, color: accent }}
                    >
                      {tag}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{description}</p>
                </div>
                <svg
                  className="size-4 shrink-0 text-slate-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-slate-500"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Component>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-center text-[11px] text-slate-300">
          © {new Date().getFullYear()} {COMPANY_DETAILS.name} · All rights reserved
        </p>
      </div>
    </main>
  )
}
