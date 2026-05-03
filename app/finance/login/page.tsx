"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50/40 px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <Image src="/assets/logo.png" alt="Impic Labs" width={40} height={40} />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Impic Labs</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Finance</h1>
          <p className="mt-1 text-sm text-slate-500">Enter your password to continue</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false) }}
                className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${
                  error ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50"
                }`}
                placeholder="••••••••••••••"
                autoFocus
              />
              {error ? (
                <p className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                  <span>✕</span> Incorrect password. Try again.
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Unlocking..." : "Unlock Finance"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          This area is restricted to authorised team members only.
        </p>
      </div>
    </main>
  )
}
