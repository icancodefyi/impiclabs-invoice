"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  IconHome,
  IconArrowUpRight,
  IconArrowDownRight,
  IconTrendingUp,
  IconList,
  IconLockOpen,
  IconChevronRight,
} from "@tabler/icons-react"

import type { Transaction } from "@/lib/finance-types"
import { formatCurrency } from "@/lib/formatCurrency"

function toMonthParam(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />
}

export default function FinanceDashboard() {
  const router = useRouter()
  const [month, setMonth] = React.useState(() => toMonthParam(new Date()))
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)
    fetch(`/api/finance/transactions?month=${month}`)
      .then((r) => r.json())
      .then((data) => { setTransactions(data); setLoading(false) })
  }, [month])

  const revenue = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  const profit = revenue - expenses

  const byCategory = transactions.reduce<Record<string, { amount: number; type: string }>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = { amount: 0, type: t.type }
    acc[t.category].amount += t.amount
    return acc
  }, {})
  const maxCat = Math.max(...Object.values(byCategory).map((v) => v.amount), 1)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">

      {/* Sticky nav */}
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-3 sm:px-6">

          {/* Breadcrumb */}
          <Link href="/" className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
            <IconHome size={14} stroke={2} />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <IconChevronRight size={13} className="text-slate-300" stroke={2} />
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
              <Image src="/assets/logo.png" alt="Impic Labs" width={22} height={22} />
            </div>
            <span className="text-sm font-bold text-slate-900">Finance</span>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/finance/transactions"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:px-4 sm:text-sm"
            >
              <IconList size={14} stroke={2} />
              <span>Transactions</span>
            </Link>
            <button
              onClick={() => { sessionStorage.removeItem("finance_auth"); router.push("/finance/login") }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-800 sm:px-4 sm:text-sm"
            >
              <IconLockOpen size={14} stroke={2} />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-5 px-4 py-5 sm:px-6 sm:py-7">

        {/* Page title + month picker */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Overview</p>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Dashboard</h2>
          </div>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: "Revenue", value: revenue, color: "#059669", bg: "#ECFDF5", Icon: IconArrowUpRight },
            { label: "Expenses", value: expenses, color: "#dc2626", bg: "#FEF2F2", Icon: IconArrowDownRight },
            { label: "Net Profit", value: profit, color: profit >= 0 ? "#6C5CE7" : "#dc2626", bg: profit >= 0 ? "#F0EEFF" : "#FEF2F2", Icon: IconTrendingUp },
          ].map(({ label, value, color, bg, Icon }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
                <div className="rounded-lg p-1.5" style={{ background: bg }}>
                  <Icon size={15} style={{ color }} stroke={2.5} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight" style={{ color }}>
                {loading ? <Skeleton className="h-7 w-28" /> : formatCurrency(value)}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">

          {/* Category breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Category Breakdown</p>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between">
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-3.5 w-16" />
                    </div>
                    <Skeleton className="h-1.5 w-full" />
                  </div>
                ))}
              </div>
            ) : Object.keys(byCategory).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-slate-100">
                  <IconChevronRight size={18} className="text-slate-300" stroke={2} />
                </div>
                <p className="text-sm font-medium text-slate-400">No data for this period</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {Object.entries(byCategory)
                  .sort((a, b) => b[1].amount - a[1].amount)
                  .map(([cat, { amount, type }]) => (
                    <div key={cat}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`size-1.5 rounded-full ${type === "income" ? "bg-emerald-500" : "bg-red-400"}`} />
                          <span className="text-xs font-medium text-slate-600">{cat}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-800">{formatCurrency(amount)}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${type === "income" ? "bg-emerald-400" : "bg-red-400"}`}
                          style={{ width: `${(amount / maxCat) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Recent transactions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Recent</p>
              <Link href="/finance/transactions" className="flex items-center gap-1 text-xs font-semibold text-violet-600 transition hover:text-violet-800">
                View all <IconChevronRight size={13} stroke={2.5} />
              </Link>
            </div>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-slate-100">
                  <IconList size={18} className="text-slate-300" stroke={1.5} />
                </div>
                <p className="text-sm font-medium text-slate-400">No transactions this period</p>
                <Link href="/finance/transactions" className="mt-2 text-xs font-semibold text-violet-600 hover:underline">
                  Add one →
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {transactions.slice(0, 7).map((t) => (
                  <div key={t._id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-slate-50">
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                      t.type === "income" ? "bg-emerald-50" : "bg-red-50"
                    }`}>
                      {t.type === "income"
                        ? <IconArrowUpRight size={15} className="text-emerald-600" stroke={2.5} />
                        : <IconArrowDownRight size={15} className="text-red-500" stroke={2.5} />
                      }
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{t.description || t.category}</p>
                      <p className="text-[11px] text-slate-400">{t.date} · {t.bank}</p>
                    </div>
                    <span className={`shrink-0 text-sm font-bold ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                      {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}
