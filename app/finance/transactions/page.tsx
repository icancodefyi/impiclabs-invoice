"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  IconHome,
  IconChevronRight,
  IconArrowUpRight,
  IconArrowDownRight,
  IconPlus,
  IconX,
  IconTrash,
  IconFilter,
  IconInbox,
} from "@tabler/icons-react"

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

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
const labelCls = "block space-y-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400"

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />
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
  const hasFilters = filterType || filterBank || filterMonth

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
          <Link href="/finance" className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
            <div className="rounded-md border border-slate-200 bg-white p-0.5">
              <Image src="/assets/logo.png" alt="Impic Labs" width={16} height={16} />
            </div>
            <span className="hidden sm:inline">Finance</span>
          </Link>
          <IconChevronRight size={13} className="text-slate-300" stroke={2} />
          <span className="text-sm font-bold text-slate-900">Transactions</span>

          {/* Add button */}
          <button
            onClick={() => setShowForm((v) => !v)}
            className={`ml-auto flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition sm:px-4 sm:text-sm ${
              showForm
                ? "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {showForm ? <IconX size={14} stroke={2.5} /> : <IconPlus size={14} stroke={2.5} />}
            {showForm ? "Cancel" : "Add"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-5 px-4 py-5 sm:px-6 sm:py-7">

        {/* Page title */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Finance</p>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Transactions</h2>
        </div>

        {/* Add form */}
        {showForm ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="mb-5 text-base font-bold text-slate-900">New Transaction</p>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-2">
                {(["income", "expense"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t, category: (t === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES)[0] }))}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                      form.type === t
                        ? t === "income"
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "bg-red-500 text-white shadow-sm"
                        : "border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {t === "income"
                      ? <IconArrowUpRight size={16} stroke={2.5} />
                      : <IconArrowDownRight size={16} stroke={2.5} />
                    }
                    {t === "income" ? "Income" : "Expense"}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelCls}>
                  Amount (₹)
                  <input type="number" min={1} value={form.amount} required
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    className={inputCls} placeholder="0.00" />
                </label>

                <label className={labelCls}>
                  Date
                  <input type="date" value={form.date} required
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className={inputCls} />
                </label>

                <label className={labelCls}>
                  Category
                  <select value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className={inputCls}>
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </label>

                <label className={labelCls}>
                  Bank Account
                  <select value={form.bank}
                    onChange={(e) => setForm((f) => ({ ...f, bank: e.target.value }))}
                    className={inputCls}>
                    {BANKS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </label>

                <label className={`${labelCls} sm:col-span-2`}>
                  Description
                  <input type="text" value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className={inputCls} placeholder="Optional note" />
                </label>
              </div>

              <button type="submit" disabled={saving}
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40">
                {saving ? "Saving..." : "Save Transaction"}
              </button>
            </form>
          </div>
        ) : null}

        {/* Summary strip */}
        {!loading && transactions.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2">
              <IconArrowUpRight size={14} className="text-emerald-600" stroke={2.5} />
              <span className="text-xs font-semibold text-emerald-600">Income</span>
              <span className="text-sm font-bold text-emerald-700">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2">
              <IconArrowDownRight size={14} className="text-red-500" stroke={2.5} />
              <span className="text-xs font-semibold text-red-500">Expenses</span>
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
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <IconFilter size={13} stroke={2} />
            <span>Filter</span>
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-violet-400">
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filterBank} onChange={(e) => setFilterBank(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-violet-400">
            <option value="">All Banks</option>
            {BANKS.map((b) => <option key={b}>{b}</option>)}
          </select>
          <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-violet-400" />
          {hasFilters ? (
            <button
              onClick={() => { setFilterType(""); setFilterBank(""); setFilterMonth("") }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <IconX size={13} stroke={2.5} /> Clear
            </button>
          ) : null}
        </div>

        {/* List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="space-y-px p-3">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-100">
                <IconInbox size={22} className="text-slate-300" stroke={1.5} />
              </div>
              <p className="text-sm font-semibold text-slate-500">No transactions found</p>
              <p className="mt-1 text-xs text-slate-400">
                {hasFilters ? "Try adjusting your filters" : "Add your first transaction above"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.map((t) => (
                <div key={t._id} className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-slate-50 sm:gap-4 sm:px-5">
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                    t.type === "income" ? "bg-emerald-50" : "bg-red-50"
                  }`}>
                    {t.type === "income"
                      ? <IconArrowUpRight size={16} className="text-emerald-600" stroke={2.5} />
                      : <IconArrowDownRight size={16} className="text-red-500" stroke={2.5} />
                    }
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
                    <IconTrash size={14} stroke={2} />
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
