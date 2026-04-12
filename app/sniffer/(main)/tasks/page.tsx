import { Link } from "next-view-transitions"

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
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-zinc-900 sm:text-[1.65rem]">
          Tasks
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          {loadError ? "" : " · Open to everyone on the team"}
        </p>
      </div>

   

      {loadError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 sm:p-5">
          <p className="font-semibold">Database unavailable</p>
          <p className="mt-1 text-amber-900">{loadError}</p>
          <p className="mt-2 text-xs text-amber-800/90">
            Add MONGODB_URI to <code className="rounded bg-amber-100/80 px-1">.env.local</code> and restart.
          </p>
        </div>
      ) : null}

      <ul className="space-y-3 sm:space-y-0 sm:overflow-hidden sm:rounded-2xl sm:border sm:border-zinc-200/80 sm:bg-white sm:shadow-sm">
        {tasks.length === 0 ? (
          <li className="rounded-2xl border border-zinc-200/80 bg-white px-5 py-14 text-center shadow-sm sm:border-0 sm:shadow-none">
            <p className="text-sm font-medium text-zinc-700">No tasks match</p>
            <p className="mt-1 text-sm text-zinc-500">Create one or adjust filters.</p>
            <Link
              href="/sniffer"
              className="mt-5 inline-flex min-h-11 touch-manipulation items-center justify-center rounded-xl px-4 text-sm font-medium text-violet-700 underline-offset-2 hover:underline"
            >
              Go to dashboard to add a task →
            </Link>
          </li>
        ) : (
          tasks.map((t) => (
            <li key={t._id} className="sm:border-b sm:border-zinc-100 sm:last:border-b-0">
              <Link
                href={`/sniffer/tasks/${t._id}`}
                className="group block touch-manipulation rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm transition hover:border-violet-200/80 hover:bg-violet-50/30 active:bg-violet-50/50 sm:border-0 sm:shadow-none sm:transition-colors sm:hover:bg-zinc-50/80"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-4">
                  <span className="min-w-0 text-base font-medium leading-snug text-zinc-900 group-hover:text-violet-950 sm:text-[15px]">
                    {t.title}
                  </span>
                  <span className="flex flex-wrap items-center gap-2.5 sm:shrink-0 sm:gap-3">
                    <span className="flex min-w-0 items-center gap-2 text-sm text-zinc-600">
                      <AssigneeAvatar name={t.assignedTo} size="sm" />
                      <span className="truncate">{t.assignedTo}</span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusBadgeClass(t.status)}`}
                    >
                      {statusLabel(t.status)}
                    </span>
                    <span
                      className="ms-auto text-zinc-400 transition group-hover:text-violet-600 sm:ms-0"
                      aria-hidden
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
