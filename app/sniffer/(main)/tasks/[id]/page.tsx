import type { ReactNode } from "react"
import { Link } from "next-view-transitions"
import { notFound } from "next/navigation"

import { AssigneeAvatar } from "@/components/sniffer/assignee-avatar"
import { MarkdownBody } from "@/components/sniffer/markdown-body"
import { TaskComments } from "@/components/sniffer/task-comments"
import { TaskStatusControl } from "@/components/sniffer/task-status-control"
import { getTaskById } from "@/lib/tasks-db"
import { statusBadgeClass, statusLabel } from "@/lib/sniffer-ui"

export const dynamic = "force-dynamic"

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-px flex-1 max-w-8 bg-gradient-to-r from-violet-400/80 to-transparent" aria-hidden />
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
        {children}
      </span>
    </div>
  )
}

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

  const created = new Date(task.createdAt).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  })

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/sniffer/tasks"
        className="group inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-full border border-zinc-200/90 bg-white/80 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 shadow-sm backdrop-blur-sm transition hover:border-zinc-300 hover:bg-white hover:text-zinc-800 sm:min-h-0 sm:px-3.5 sm:py-2"
      >
        <span
          className="transition group-hover:-translate-x-0.5"
          aria-hidden
        >
          ←
        </span>
        All tasks
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-y-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_min(100%,17.5rem)] lg:gap-x-10 lg:gap-y-12 xl:grid-cols-[minmax(0,1fr)_19rem] xl:gap-x-14">
        <header className="relative min-w-0 overflow-hidden rounded-[1.75rem] border border-zinc-200/70 bg-white p-7 shadow-[0_1px_0_rgba(0,0,0,0.03),0_24px_48px_-20px_rgba(15,23,42,0.12)] sm:p-9 lg:col-start-1">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-400/15 blur-3xl"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-white to-zinc-50/30" aria-hidden />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-600">Task</p>
            <h1 className="mt-4 font-heading text-[1.65rem] font-semibold leading-[1.2] tracking-tight text-zinc-950 sm:text-3xl sm:leading-[1.18]">
              {task.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide ${statusBadgeClass(task.status)}`}
              >
                {statusLabel(task.status)}
              </span>
            </div>
          </div>
        </header>

        <aside className="min-w-0 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:self-start">
          <div className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.03),0_16px_40px_-16px_rgba(15,23,42,0.1)] lg:sticky lg:top-24">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Details</p>
            <dl className="mt-5 space-y-5 text-sm">
              <div>
                <dt className="text-xs font-medium text-zinc-500">Assignee</dt>
                <dd className="mt-2 flex items-center gap-2.5 font-medium text-zinc-900">
                  <AssigneeAvatar name={task.assignedTo} />
                  <span>{task.assignedTo}</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-zinc-500">Created</dt>
                <dd className="mt-2 text-[13px] leading-snug tabular-nums text-zinc-700">{created}</dd>
              </div>
            </dl>
            <div className="mt-6 border-t border-zinc-100 pt-6">
              <TaskStatusControl taskId={task._id} initialStatus={task.status} />
            </div>
          </div>
        </aside>

        <section className="min-w-0 lg:col-start-1">
          <SectionLabel>Brief</SectionLabel>
          <div className="rounded-[1.35rem] border border-zinc-200/70 bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)] sm:p-8 sm:pl-9">
            <div className="border-l-2 border-violet-200/90 pl-5 sm:pl-6">
              <MarkdownBody markdown={task.description} size="lg" />
            </div>
          </div>
        </section>

        <section className="min-w-0 pb-4 lg:col-start-1">
          <TaskComments taskId={task._id} initialComments={task.comments} />
        </section>
      </div>
    </div>
  )
}
