"use client"

import { useTransitionRouter } from "next-view-transitions"
import * as React from "react"

import { MarkdownBody } from "@/components/sniffer/markdown-body"
import { Button } from "@/components/ui/button"
import { ASSIGNEES } from "@/lib/task-types"

export function NewTaskForm() {
  const router = useTransitionRouter()
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [assignedTo, setAssignedTo] = React.useState<string>(ASSIGNEES[0])
  const [password, setPassword] = React.useState("")
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [descTab, setDescTab] = React.useState<"write" | "preview">("write")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)
    try {
      const res = await fetch("/api/sniffer/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, assignedTo, password }),
      })
      const data = (await res.json()) as { id?: string; error?: string }
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to create task")
      }
      if (data.id) {
        router.push(`/sniffer/tasks/${data.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task")
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-8">
      <div className="max-w-2xl space-y-2">
        <label className="block text-sm font-medium text-zinc-800">Title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
          placeholder="Short, clear title"
        />
      </div>

      <div className="max-w-4xl space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-sm font-medium text-zinc-800">Description</label>
          <div className="flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setDescTab("write")}
              className={`rounded-md px-3 py-1.5 transition ${
                descTab === "write"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setDescTab("preview")}
              className={`rounded-md px-3 py-1.5 transition ${
                descTab === "preview"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Preview
            </button>
          </div>
        </div>
        {descTab === "write" ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={14}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 font-mono text-sm outline-none transition focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
            placeholder="Use **markdown** — lists, links, code blocks…"
          />
        ) : (
          <div className="min-h-[320px] rounded-lg border border-zinc-200 bg-white px-4 py-4">
            <MarkdownBody markdown={description} size="md" />
          </div>
        )}
      </div>

      <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-800">Assign to</label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
          >
            {ASSIGNEES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-800">Internal password</label>
          <input
            type="password"
            required
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
            placeholder="Required to create a task"
          />
          <p className="text-xs text-zinc-500">Only this step is protected. Viewing tasks is open to the team.</p>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending} className="bg-zinc-900 text-white hover:bg-zinc-800">
          {pending ? "Creating…" : "Create task"}
        </Button>
      </div>
    </form>
  )
}
