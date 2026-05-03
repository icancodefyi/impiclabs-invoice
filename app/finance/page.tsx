"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import type { Transaction } from "@/lib/finance-types"
import { formatCurrency } from "@/lib/formatCurrency"

function toMonthParam(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

function StatCard({ label, value, loading, color }: { label: string; value: number; loading: boolean; color: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-bold tracking-tight sm:text-2xl" style={{ color }}>
        {loading ? <span className="text-slate-300">—</span> : formatCurrency(value)}
      </p>
    </div>
  )
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

  const maxCatAmount = Math.max(...Object.values(byCategory).map((v) => v.amount), 1)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/40">

      {/* Top nav */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
              <Image src="/assets/logo.png" alt="Impic Labs" width={28} height={28} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-500">Finance</p>
              <p className="text-sm font-bold text-slate-900">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/finance/transactions"
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:px-4 sm:text-sm"
            >
              Transactions
            </Link>
            <button
              onClick={() => { sessionStorage.removeItem("finance_auth"); router.push("/finance/login") }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-800 sm:px-4 sm:text-sm"
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-5 px-4 py-5 sm:px-6 sm:py-6">

        {/* Month picker */}
        <div className="flex items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Period</p>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <StatCard label="Revenue" value={revenue} loading={loading} color="#059669" />
          <StatCard label="Expenses" value={expenses} loading={loading} color="#dc2626" />
          <StatCard label="Profit" value={profit} loading={loading} color={profit >= 0 ? "#6C5CE7" : "#dc2626"} />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">

          {/* Category breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Category Breakdown</p>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-5 animate-pulse rounded-lg bg-slate-100" />)}
              </div>
            ) : Object.keys(byCategory).length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">No data for this period.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(byCategory)
                  .sort((a, b) => b[1].amount - a[1].amount)
                  .map(([cat, { amount, type }]) => (
                    <div key={cat}>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`size-1.5 rounded-full ${type === "income" ? "bg-emerald-500" : "bg-red-400"}`} />
                          <span className="text-xs font-medium text-slate-600">{cat}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-800">{formatCurrency(amount)}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${type === "income" ? "bg-emerald-400" : "bg-red-400"}`}
                          style={{ width: `${(amount / maxCatAmount) * 100}%` }}
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Recent</p>
              <Link href="/finance/transactions" className="text-xs font-semibold text-violet-600 hover:underline">
                View all →
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-100" />)}
              </div>
            ) : transactions.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">No transactions this period.</p>
            ) : (
              <div className="space-y-1">
                {transactions.slice(0, 7).map((t) => (
                  <div key={t._id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50">
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs ${
                      t.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                    }`}>
                      {t.type === "income" ? "↑" : "↓"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{t.description || t.category}</p>
                      <p className="text-[11px] text-slate-400">{t.date}</p>
                    </div>
                    <span className={`shrink-0 text-sm font-semibold ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
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
