"use client"

import { IconTrash } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"

export function TaskDeleteButton({
  taskId,
  taskTitle,
}: {
  taskId: string
  taskTitle: string
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  function close() {
    setOpen(false)
    setPassword("")
    setError(null)
  }

  async function confirmDelete(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)
    try {
      const res = await fetch(`/api/sniffer/tasks/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        throw new Error(data.error ?? "Could not delete")
      }
      close()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed")
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
        className="flex min-h-10 min-w-10 touch-manipulation items-center justify-center rounded-lg text-zinc-400 transition hover:bg-red-50 hover:text-red-700 active:bg-red-100"
        aria-label={`Delete task: ${taskTitle}`}
      >
        <IconTrash className="h-[1.125rem] w-[1.125rem]" stroke={1.75} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-zinc-950/50 backdrop-blur-[2px]"
            aria-label="Close"
            onClick={() => !pending && close()}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-delete-title"
            className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="task-delete-title" className="text-base font-semibold text-zinc-900">
              Delete task?
            </h2>
            <p className="mt-2 line-clamp-3 text-sm text-zinc-600">{taskTitle}</p>
            <p className="mt-3 text-xs text-zinc-500">
              Enter the same internal password used when creating tasks.
            </p>
            <form onSubmit={(e) => void confirmDelete(e)} className="mt-4 space-y-3">
              <div>
                <label htmlFor={`del-pw-${taskId}`} className="sr-only">
                  Internal password
                </label>
                <input
                  id={`del-pw-${taskId}`}
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
                  placeholder="Internal password"
                  disabled={pending}
                />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  disabled={pending}
                  onClick={() => close()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={pending || !password}
                  className="w-full bg-red-600 text-white hover:bg-red-700 sm:w-auto"
                >
                  {pending ? "Deleting…" : "Delete task"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
