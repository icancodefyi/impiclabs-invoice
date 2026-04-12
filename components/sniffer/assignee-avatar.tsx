import type { Assignee } from "@/lib/task-types"
import { isAssignee } from "@/lib/task-types"

const styles: Record<Assignee, { gradient: string; initials: string }> = {
  Roshni: {
    gradient: "from-rose-400 via-rose-500 to-pink-600",
    initials: "Ro",
  },
  Misbah: {
    gradient: "from-violet-500 via-indigo-500 to-indigo-700",
    initials: "Mi",
  },
}

export function AssigneeAvatar({
  name,
  size = "md",
}: {
  name: string
  size?: "sm" | "md"
}) {
  const assignee = isAssignee(name) ? name : null
  const meta = assignee ? styles[assignee] : null
  let initials =
    meta?.initials ??
    name
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase()
  if (!initials) {
    initials = "?"
  }

  const sizeCls = size === "sm" ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs"

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold uppercase tracking-tight text-white shadow-inner ring-2 ring-white ${sizeCls} ${meta ? meta.gradient : "from-zinc-400 to-zinc-600"}`}
      title={name}
      role="img"
      aria-label={name}
    >
      {initials}
    </span>
  )
}
