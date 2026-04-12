import Link from "next/link"
import { notFound } from "next/navigation"

import { AssigneeAvatar } from "@/components/sniffer/assignee-avatar"
import { MarkdownBody } from "@/components/sniffer/markdown-body"
import { TaskComments } from "@/components/sniffer/task-comments"
import { TaskStatusControl } from "@/components/sniffer/task-status-control"
import { getTaskById } from "@/lib/tasks-db"
import { statusBadgeClass, statusLabel } from "@/lib/sniffer-ui"

export const dynamic = "force-dynamic"

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let task
  try {
    task = await getTaskById(id)
  } catch {
    task = null
  }

  if (!task) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/sniffer/tasks"
        className="inline-flex items-center gap-1 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
      >
        <span aria-hidden>←</span> All tasks
      </Link>

      <article className="mt-8 space-y-10">
        <header className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-[1.65rem] sm:leading-tight">
              {task.title}
            </h1>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusBadgeClass(task.status)}`}
            >
              {statusLabel(task.status)}
            </span>
          </div>
          <dl className="mt-6 grid gap-4 border-t border-zinc-100 pt-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">Assignee</dt>
              <dd className="mt-2 flex items-center gap-2.5 font-medium text-zinc-900">
                <AssigneeAvatar name={task.assignedTo} />
                <span>{task.assignedTo}</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">Created</dt>
              <dd className="mt-1 tabular-nums text-zinc-700">
                {new Date(task.createdAt).toLocaleString(undefined, {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </dd>
            </div>
          </dl>
          <div className="mt-8 border-t border-zinc-100 pt-6">
            <TaskStatusControl taskId={task._id} initialStatus={task.status} />
          </div>
        </header>

        <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Brief</h2>
          <div className="mt-4">
            <MarkdownBody markdown={task.description} size="md" />
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
          <TaskComments taskId={task._id} initialComments={task.comments} />
        </section>
      </article>
    </div>
  )
}
