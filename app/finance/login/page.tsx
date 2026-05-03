"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function FinanceLoginPage() {
  const router = useRouter()
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password === "impic@finance") {
      sessionStorage.setItem("finance_auth", "1")
      router.push("/finance")
    } else {
      setError(true)
      setPassword("")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#ffffff_0%,#f4f4f5_44%,#ececf0_100%)] px-4">
      <div className="w-full max-w-sm rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-black/10 bg-white p-2">
            <Image src="/assets/logo.png" alt="Impic Labs" width={32} height={32} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6C5CE7]">
              Internal Tool
            </p>
            <h1 className="text-lg font-bold tracking-tight text-black">Finance</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="space-y-1 text-xs font-medium text-black/70">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false) }}
              className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-sm text-black outline-none focus:border-[#6C5CE7]"
              placeholder="Enter password"
              autoFocus
            />
          </label>
          {error ? (
            <p className="text-xs font-medium text-red-500">Incorrect password</p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-lg bg-black py-2 text-sm font-semibold text-white hover:bg-black/85"
          >
            Unlock
          </button>
        </form>
      </div>
    </main>
  )
}
