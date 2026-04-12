import { Link } from "next-view-transitions"

export default function TaskNotFound() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-xl font-semibold text-zinc-900">Task not found</h1>
      <Link
        href="/sniffer/tasks"
        className="inline-flex min-h-11 touch-manipulation items-center justify-center text-sm font-medium text-violet-700 underline-offset-2 hover:underline"
      >
        Back to tasks
      </Link>
    </div>
  )
}
