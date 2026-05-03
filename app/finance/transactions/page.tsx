"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"

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

const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
const labelCls = "block space-y-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400"

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

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)

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
              <p className="text-sm font-bold text-slate-900">Transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/finance"
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 sm:px-4 sm:text-sm"
            >
              ← Dashboard
            </Link>
            <button
              onClick={() => setShowForm((v) => !v)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition sm:px-4 sm:text-sm ${
                showForm
                  ? "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {showForm ? "Cancel" : "+ Add"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-5 px-4 py-5 sm:px-6 sm:py-6">

        {/* Add form */}
        {showForm ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="mb-5 text-base font-bold text-slate-900">New Transaction</p>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Type toggle */}
              <div className="flex gap-2">
                {(["income", "expense"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t, category: (t === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES)[0] }))}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold capitalize transition-all ${
                      form.type === t
                        ? t === "income"
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "bg-red-500 text-white shadow-sm"
                        : "border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {t === "income" ? "↑ Income" : "↓ Expense"}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelCls}>
                  Amount (₹)
                  <input
                    type="number" min={1} value={form.amount} required
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    className={inputCls} placeholder="0.00"
                  />
                </label>

                <label className={labelCls}>
                  Date
                  <input
                    type="date" value={form.date} required
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className={inputCls}
                  />
                </label>

                <label className={labelCls}>
                  Category
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inputCls}>
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </label>

                <label className={labelCls}>
                  Bank Account
                  <select value={form.bank} onChange={(e) => setForm((f) => ({ ...f, bank: e.target.value }))} className={inputCls}>
                    {BANKS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </label>

                <label className={`${labelCls} sm:col-span-2`}>
                  Description
                  <input
                    type="text" value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className={inputCls} placeholder="Optional note"
                  />
                </label>
              </div>

              <button
                type="submit" disabled={saving}
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40"
              >
                {saving ? "Saving..." : "Save Transaction"}
              </button>
            </form>
          </div>
        ) : null}

        {/* Summary strip */}
        {!loading && transactions.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2">
              <span className="text-xs font-semibold text-emerald-600">↑ In</span>
              <span className="text-sm font-bold text-emerald-700">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2">
              <span className="text-xs font-semibold text-red-500">↓ Out</span>
              <span className="text-sm font-bold text-red-600">{formatCurrency(totalExpense)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-4 py-2">
              <span className="text-xs font-semibold text-violet-600">Net</span>
              <span className={`text-sm font-bold ${totalIncome - totalExpense >= 0 ? "text-violet-700" : "text-red-600"}`}>
                {formatCurrency(totalIncome - totalExpense)}
              </span>
            </div>
          </div>
        ) : null}

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            <select key="type" value={filterType} onChange={(e) => setFilterType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-violet-400">
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>,
            <select key="bank" value={filterBank} onChange={(e) => setFilterBank(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-violet-400">
              <option value="">All Banks</option>
              {BANKS.map((b) => <option key={b}>{b}</option>)}
            </select>,
            <input key="month" type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-violet-400" />,
          ]}
          {(filterType || filterBank || filterMonth) ? (
            <button
              onClick={() => { setFilterType(""); setFilterBank(""); setFilterMonth("") }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-800"
            >
              Clear
            </button>
          ) : null}
        </div>

        {/* List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="space-y-px p-2">
              {[1,2,3,4,5].map(i => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-2xl">📭</p>
              <p className="mt-2 text-sm font-medium text-slate-400">No transactions found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.map((t) => (
                <div key={t._id} className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-slate-50 sm:gap-4 sm:px-5">
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                    t.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                  }`}>
                    {t.type === "income" ? "↑" : "↓"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{t.description || t.category}</p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-400">{t.date} · {t.category} · {t.bank}</p>
                  </div>
                  <span className={`shrink-0 text-sm font-bold ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="shrink-0 rounded-lg p-1.5 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    title="Delete"
                  >
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
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
