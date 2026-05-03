import Image from "next/image"
import Link from "next/link"
import { Link as VtLink } from "next-view-transitions"
import {
  IconFileInvoice,
  IconBug,
  IconChartBar,
  IconArrowRight,
} from "@tabler/icons-react"

import { COMPANY_DETAILS } from "@/config/company"

const tools = [
  {
    href: "/invoice",
    label: "Invoice Studio",
    description: "Generate A4 invoices, export PDF, and print.",
    tag: "Billing",
    accent: "#6C5CE7",
    accentBg: "#F0EEFF",
    Icon: IconFileInvoice,
    Component: Link,
  },
  {
    href: "/sniffer",
    label: "Sniffer Lab",
    description: "Team task board — track, assign, and discuss work.",
    tag: "Tasks",
    accent: "#0284c7",
    accentBg: "#EFF6FF",
    Icon: IconBug,
    Component: VtLink,
  },
  {
    href: "/finance",
    label: "Finance",
    description: "Track revenue, expenses, and monthly P&L.",
    tag: "Internal",
    accent: "#059669",
    accentBg: "#ECFDF5",
    Icon: IconChartBar,
    Component: Link,
  },
]

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-violet-50/30">

      {/* Top bar */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3 sm:px-6">
          <div className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
            <Image src="/assets/logo.png" alt="Impic Labs" width={26} height={26} priority />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-violet-500">
              {COMPANY_DETAILS.name}
            </p>
            <p className="text-sm font-bold leading-none text-slate-900">Internal HQ</p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-lg">

          <div className="mb-10 text-center sm:mb-12">
            <div className="mb-5 inline-flex rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <Image src="/assets/logo.png" alt="Impic Labs" width={44} height={44} priority />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-[2.25rem]">
              Internal HQ
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
              Private tools for the team — fast, focused, no distractions.
            </p>
          </div>

          {/* Tool cards */}
          <ul className="space-y-2.5">
            {tools.map(({ href, label, description, tag, accent, accentBg, Icon, Component }) => (
              <li key={href}>
                <Component
                  href={href}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition-all duration-150 hover:-translate-y-px hover:border-slate-300 hover:shadow-md active:translate-y-0 sm:px-5"
                >
                  <div
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl sm:size-12"
                    style={{ background: accentBg }}
                  >
                    <Icon size={22} style={{ color: accent }} stroke={1.75} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[15px] font-semibold text-slate-900">{label}</p>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                        style={{ background: accentBg, color: accent }}
                      >
                        {tag}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{description}</p>
                  </div>

                  <IconArrowRight
                    size={16}
                    className="shrink-0 text-slate-300 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-slate-500"
                    stroke={2}
                  />
                </Component>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-center text-[11px] text-slate-300">
            © {new Date().getFullYear()} {COMPANY_DETAILS.name} · All rights reserved
          </p>
        </div>
      </div>
    </main>
  )
}
