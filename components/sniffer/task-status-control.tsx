"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { cn } from "@/lib/utils"
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

  async function onSelect(next: TaskStatus) {
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
    <div className="space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Status</p>
      <div
        className="flex flex-col gap-1.5 rounded-xl bg-zinc-100/90 p-1.5 ring-1 ring-inset ring-zinc-200/60"
        role="group"
        aria-label="Task status"
      >
        {TASK_STATUSES.map((s) => {
          const active = status === s
          return (
            <button
              key={s}
              type="button"
              disabled={pending}
              onClick={() => void onSelect(s)}
              className={cn(
                "relative w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition",
                active
                  ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/80"
                  : "text-zinc-600 hover:bg-white/60 hover:text-zinc-900"
              )}
            >
              <span
                className={cn(
                  "mr-2 inline-block h-2 w-2 rounded-full align-middle",
                  s === "todo" && "bg-zinc-400",
                  s === "doing" && "bg-violet-500",
                  s === "done" && "bg-emerald-500"
                )}
                aria-hidden
              />
              {statusLabel(s)}
            </button>
          )
        })}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
