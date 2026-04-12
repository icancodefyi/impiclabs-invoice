import type { TaskStatus } from "@/lib/task-types"

export function statusBadgeClass(status: TaskStatus): string {
  switch (status) {
    case "todo":
      return "bg-zinc-100 text-zinc-700 ring-1 ring-inset ring-zinc-200"
    case "doing":
      return "bg-violet-50 text-violet-800 ring-1 ring-inset ring-violet-200"
    case "done":
      return "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200"
    default:
      return "bg-zinc-100 text-zinc-700"
  }
}

export function statusLabel(status: TaskStatus): string {
  switch (status) {
    case "todo":
      return "To do"
    case "doing":
      return "Doing"
    case "done":
      return "Done"
    default:
      return status
  }
}
