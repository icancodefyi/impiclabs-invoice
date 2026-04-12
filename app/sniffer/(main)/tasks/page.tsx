import Link from "next/link"

import { AssigneeAvatar } from "@/components/sniffer/assignee-avatar"
import { listTasks } from "@/lib/tasks-db"
import { ASSIGNEES, TASK_STATUSES } from "@/lib/task-types"
import { statusBadgeClass, statusLabel } from "@/lib/sniffer-ui"

export const dynamic = "force-dynamic"

export default async function TasksListPage({
  searchParams,
}: {
  searchParams: Promise<{ assignedTo?: string; status?: string }>
}) {
  const sp = await searchParams
  let tasks: Awaited<ReturnType<typeof listTasks>> = []
  let loadError: string | null = null

  try {
    tasks = await listTasks({
      assignedTo: sp.assignedTo || undefined,
      status: sp.status || undefined,
    })
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Could not load tasks"
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Tasks</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            {loadError ? "" : " · Open to everyone on the team"}
          </p>
        </div>
        <Link
          href="/sniffer/tasks/new"
          className="inline-flex w-fit items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
        >
          Add task
        </Link>
      </div>

      <form
        className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm"
        action="/sniffer/tasks"
        method="get"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">Assignee</label>
          <select
            name="assignedTo"
            defaultValue={sp.assignedTo ?? ""}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
          >
            <option value="">Everyone</option>
            {ASSIGNEES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">Status</label>
          <select
            name="status"
            defaultValue={sp.status ?? ""}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
          >
            <option value="">All</option>
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
        >
          Apply
        </button>
        <Link
          href="/sniffer/tasks"
          className="rounded-lg px-3 py-2 text-sm text-zinc-600 underline-offset-2 hover:underline"
        >
          Reset
        </Link>
      </form>

      {loadError ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Database unavailable</p>
          <p className="mt-1 text-amber-900">{loadError}</p>
          <p className="mt-2 text-xs text-amber-800/90">
            Add MONGODB_URI to <code className="rounded bg-amber-100/80 px-1">.env.local</code> and restart.
          </p>
        </div>
      ) : null}

      <ul className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm">
        {tasks.length === 0 ? (
          <li className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-zinc-700">No tasks match</p>
            <p className="mt-1 text-sm text-zinc-500">Create one or adjust filters.</p>
            <Link
              href="/sniffer/tasks/new"
              className="mt-4 inline-block text-sm font-medium text-violet-700 underline-offset-2 hover:underline"
            >
              New task →
            </Link>
          </li>
        ) : (
          tasks.map((t) => (
            <li key={t._id} className="border-b border-zinc-100 last:border-b-0">
              <Link
                href={`/sniffer/tasks/${t._id}`}
                className="group flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition hover:bg-zinc-50/80"
              >
                <span className="min-w-0 flex-1 font-medium text-zinc-900 group-hover:text-violet-900">
                  {t.title}
                </span>
                <span className="flex shrink-0 items-center gap-3 text-sm">
                  <span className="flex items-center gap-2 text-zinc-600">
                    <AssigneeAvatar name={t.assignedTo} size="sm" />
                    {t.assignedTo}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${statusBadgeClass(t.status)}`}
                  >
                    {statusLabel(t.status)}
                  </span>
                  <span className="text-zinc-400 transition group-hover:text-violet-600" aria-hidden>
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
