"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { IconLock, IconArrowLeft, IconAlertCircle, IconHome } from "@tabler/icons-react"

export default function FinanceLoginPage() {
  const router = useRouter()
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (password === "impic@finance") {
        sessionStorage.setItem("finance_auth", "1")
        router.push("/finance")
      } else {
        setError(true)
        setPassword("")
        setLoading(false)
      }
    }, 300)
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-violet-50/30">

      {/* Nav */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
            <IconHome size={14} stroke={2} />
            Home
          </Link>
          <span className="text-slate-200">/</span>
          <span className="text-xs font-semibold text-slate-400">Finance</span>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <Image src="/assets/logo.png" alt="Impic Labs" width={40} height={40} />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Impic Labs</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Finance</h1>
            <p className="mt-1.5 text-sm text-slate-500">Restricted access — team members only</p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <IconLock size={12} stroke={2.5} />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false) }}
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:ring-2 focus:ring-violet-100 ${
                    error
                      ? "border-red-300 bg-red-50 focus:border-red-400"
                      : "border-slate-200 bg-slate-50 focus:border-violet-400 focus:bg-white"
                  }`}
                  placeholder="Enter password"
                  autoFocus
                />
                {error ? (
                  <p className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                    <IconAlertCircle size={13} stroke={2} />
                    Incorrect password. Try again.
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={loading || !password}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <IconLock size={15} stroke={2} />
                {loading ? "Unlocking..." : "Unlock Finance"}
              </button>
            </form>
          </div>

          <div className="mt-5 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-slate-700">
              <IconArrowLeft size={13} stroke={2} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
