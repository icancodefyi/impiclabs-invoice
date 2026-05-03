"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { BRAND } from "@/config/company"
import type { Transaction } from "@/lib/finance-types"
import { formatCurrency } from "@/lib/formatCurrency"

function toMonthParam(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
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

  const byCategory = transactions.reduce<Record<string, { amount: number; type: string }>>(
    (acc, t) => {
      if (!acc[t.category]) acc[t.category] = { amount: 0, type: t.type }
      acc[t.category].amount += t.amount
      return acc
    },
    {}
  )

  function handleLogout() {
    sessionStorage.removeItem("finance_auth")
    router.push("/finance/login")
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f4f4f5_44%,#ececf0_100%)] px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
      <div className="mx-auto max-w-4xl space-y-4">

        {/* Header */}
        <header className="rounded-3xl border border-black/10 bg-white/90 p-4 shadow-sm backdrop-blur md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-black/10 bg-white p-2">
                <Image src="/assets/logo.png" alt="Impic Labs" width={34} height={34} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: BRAND.accentColor }}>
                  Internal Tool
                </p>
                <h1 className="text-lg font-bold tracking-tight text-black md:text-xl">Finance</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/finance/transactions" className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/85">
                Transactions
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-black/50 hover:text-black">
                Lock
              </button>
            </div>
          </div>
        </header>

        {/* Month picker */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.14em] text-black/40">Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-sm text-black outline-none focus:border-[#6C5CE7]"
          />
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Revenue", value: revenue, color: "#10b981" },
            { label: "Expenses", value: expenses, color: "#ef4444" },
            { label: "Profit", value: profit, color: profit >= 0 ? "#6C5CE7" : "#ef4444" },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35">{card.label}</p>
              <p className="mt-1 text-xl font-bold tracking-tight" style={{ color: card.color }}>
                {loading ? "—" : formatCurrency(card.value)}
              </p>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35">Category Breakdown</p>
          {loading ? (
            <p className="text-sm text-black/40">Loading...</p>
          ) : Object.keys(byCategory).length === 0 ? (
            <p className="text-sm text-black/40">No transactions this month.</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(byCategory)
                .sort((a, b) => b[1].amount - a[1].amount)
                .map(([cat, { amount, type }]) => (
                  <div key={cat} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${type === "income" ? "bg-emerald-500" : "bg-red-400"}`} />
                      <span className="text-black/70">{cat}</span>
                    </div>
                    <span className="font-semibold text-black">{formatCurrency(amount)}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Recent transactions */}
        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35">Recent Transactions</p>
            <Link href="/finance/transactions" className="text-xs font-medium text-[#6C5CE7] hover:underline">View all</Link>
          </div>
          {loading ? (
            <p className="text-sm text-black/40">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-black/40">No transactions this month.</p>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 8).map((t) => (
                <div key={t._id} className="flex items-center justify-between gap-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-black">{t.description || t.category}</p>
                    <p className="text-xs text-black/40">{t.date} · {t.bank}</p>
                  </div>
                  <span className={`shrink-0 font-semibold ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
