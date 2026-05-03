"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"

import { BRAND } from "@/config/company"
import { BANKS, INCOME_CATEGORIES, EXPENSE_CATEGORIES, type Transaction } from "@/lib/finance-types"
import { formatCurrency } from "@/lib/formatCurrency"

const EMPTY_FORM = {
  type: "income" as "income" | "expense",
  amount: "",
  category: INCOME_CATEGORIES[0] as string,
  description: "",
  bank: BANKS[0] as string,
  date: new Date().toISOString().split("T")[0],
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [loading, setLoading] = React.useState(true)
  const [filterType, setFilterType] = React.useState("")
  const [filterBank, setFilterBank] = React.useState("")
  const [filterMonth, setFilterMonth] = React.useState("")
  const [form, setForm] = React.useState(EMPTY_FORM)
  const [saving, setSaving] = React.useState(false)
  const [showForm, setShowForm] = React.useState(false)

  const categories = form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function fetchTransactions() {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterType) params.set("type", filterType)
    if (filterBank) params.set("bank", filterBank)
    if (filterMonth) params.set("month", filterMonth)
    fetch(`/api/finance/transactions?${params}`)
      .then((r) => r.json())
      .then((data) => { setTransactions(data); setLoading(false) })
  }

  React.useEffect(() => { fetchTransactions() }, [filterType, filterBank, filterMonth])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) return
    setSaving(true)
    await fetch("/api/finance/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    })
    setForm(EMPTY_FORM)
    setShowForm(false)
    setSaving(false)
    fetchTransactions()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/finance/transactions/${id}`, { method: "DELETE" })
    setTransactions((prev) => prev.filter((t) => t._id !== id))
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
                  Finance
                </p>
                <h1 className="text-lg font-bold tracking-tight text-black md:text-xl">Transactions</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/finance" className="text-sm font-medium text-black/60 hover:text-black">
                ← Dashboard
              </Link>
              <button
                onClick={() => setShowForm((v) => !v)}
                className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/85"
              >
                {showForm ? "Cancel" : "+ Add"}
              </button>
            </div>
          </div>
        </header>

        {/* Add form */}
        {showForm ? (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-black">New Transaction</p>
            <div className="grid gap-3 sm:grid-cols-2">

              {/* Type toggle */}
              <div className="flex gap-2 sm:col-span-2">
                {(["income", "expense"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t, category: (t === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES)[0] }))}
                    className={`rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
                      form.type === t
                        ? t === "income" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                        : "bg-zinc-100 text-black/60"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <label className="space-y-1 text-xs font-medium text-black/70">
                Amount (₹)
                <input
                  type="number"
                  min={1}
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  required
                  className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-sm text-black outline-none focus:border-[#6C5CE7]"
                  placeholder="0"
                />
              </label>

              <label className="space-y-1 text-xs font-medium text-black/70">
                Date
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  required
                  className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-sm text-black outline-none focus:border-[#6C5CE7]"
                />
              </label>

              <label className="space-y-1 text-xs font-medium text-black/70">
                Category
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-sm text-black outline-none focus:border-[#6C5CE7]"
                >
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>

              <label className="space-y-1 text-xs font-medium text-black/70">
                Bank Account
                <select
                  value={form.bank}
                  onChange={(e) => setForm((f) => ({ ...f, bank: e.target.value }))}
                  className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-sm text-black outline-none focus:border-[#6C5CE7]"
                >
                  {BANKS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </label>

              <label className="space-y-1 text-xs font-medium text-black/70 sm:col-span-2">
                Description
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-sm text-black outline-none focus:border-[#6C5CE7]"
                  placeholder="Optional note"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-4 w-full rounded-lg bg-black py-2 text-sm font-semibold text-white hover:bg-black/85 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Transaction"}
            </button>
          </form>
        ) : null}

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-sm text-black outline-none focus:border-[#6C5CE7]"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filterBank}
            onChange={(e) => setFilterBank(e.target.value)}
            className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-sm text-black outline-none focus:border-[#6C5CE7]"
          >
            <option value="">All Banks</option>
            {BANKS.map((b) => <option key={b}>{b}</option>)}
          </select>

          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-sm text-black outline-none focus:border-[#6C5CE7]"
          />
        </div>

        {/* Transactions list */}
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
          {loading ? (
            <p className="p-6 text-sm text-black/40">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="p-6 text-sm text-black/40">No transactions found.</p>
          ) : (
            <div className="divide-y divide-black/5">
              {transactions.map((t) => (
                <div key={t._id} className="flex items-center gap-3 px-4 py-3">
                  <div className={`size-2 shrink-0 rounded-full ${t.type === "income" ? "bg-emerald-500" : "bg-red-400"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-black">{t.description || t.category}</p>
                    <p className="text-xs text-black/40">{t.date} · {t.category} · {t.bank}</p>
                  </div>
                  <span className={`shrink-0 text-sm font-semibold ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="shrink-0 text-xs text-black/25 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
