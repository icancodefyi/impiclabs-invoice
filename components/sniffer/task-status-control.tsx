"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import type { TaskStatus } from "@/lib/task-types"
import { TASK_STATUSES } from "@/lib/task-types"
import { statusLabel } from "@/lib/sniffer-ui"

export function TaskStatusControl({
  taskId,
  initialStatus,
}: {
  taskId: string
  initialStatus: TaskStatus
}) {
  const router = useRouter()
  const [status, setStatus] = React.useState<TaskStatus>(initialStatus)
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setStatus(initialStatus)
  }, [initialStatus])

  async function onChange(next: TaskStatus) {
    if (next === status) {
      return
    }
    setPending(true)
    setError(null)
    try {
      const res = await fetch(`/api/sniffer/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? "Update failed")
      }
      setStatus(next)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Status</label>
      <select
        className="w-full max-w-xs rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium outline-none transition focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
        value={status}
        disabled={pending}
        onChange={(e) => void onChange(e.target.value as TaskStatus)}
      >
        {TASK_STATUSES.map((s) => (
          <option key={s} value={s}>
            {statusLabel(s)}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
