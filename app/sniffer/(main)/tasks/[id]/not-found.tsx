import Link from "next/link"

export default function TaskNotFound() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-xl font-semibold text-zinc-900">Task not found</h1>
      <Link href="/sniffer/tasks" className="text-sm text-[#6C5CE7] underline-offset-2 hover:underline">
        Back to tasks
      </Link>
    </div>
  )
}
