import Link from "next/link"

export default function SnifferDashboardPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Sniffer Lab</h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-600">
          Research task board for the team. Browse and comment without a password — only{" "}
          <strong className="font-medium text-zinc-800">creating</strong> a task needs the internal
          password.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        <li>
          <Link
            href="/sniffer/tasks"
            className="block h-full rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md"
          >
            <p className="text-sm font-semibold text-zinc-900">All tasks</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">Filter by assignee or status</p>
          </Link>
        </li>
        <li>
          <Link
            href="/sniffer/tasks/new"
            className="block h-full rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md"
          >
            <p className="text-sm font-semibold text-zinc-900">New task</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">Assign to Roshni or Misbah (password required)</p>
          </Link>
        </li>
      </ul>
    </div>
  )
}
