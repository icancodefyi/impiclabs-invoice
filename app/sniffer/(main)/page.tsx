import { Link } from "next-view-transitions"

export default function SnifferDashboardPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 sm:space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-zinc-900 sm:text-[1.65rem]">
          Sniffer Lab
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-600">
          Research task board for the team. Browse and comment without a password — only{" "}
          <strong className="font-medium text-zinc-800">creating</strong> a task needs the internal
          password.
        </p>
      </div>

      <Link
        href="/sniffer/tasks/new"
        className="flex min-h-12 w-full touch-manipulation items-center justify-center rounded-2xl bg-zinc-900 px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800 active:bg-zinc-950 sm:max-w-xs"
      >
        Add task
      </Link>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Browse</h2>
        <Link
          href="/sniffer/tasks"
          className="mt-3 block min-h-[5.25rem] touch-manipulation rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition active:scale-[0.99] sm:min-h-0 sm:p-6 sm:hover:border-violet-200 sm:hover:shadow-md"
        >
          <p className="text-sm font-semibold text-zinc-900">All tasks</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">Filter by assignee or status</p>
        </Link>
      </div>
    </div>
  )
}
