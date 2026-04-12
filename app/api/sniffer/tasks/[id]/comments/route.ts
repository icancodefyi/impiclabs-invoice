import { NextResponse } from "next/server"

import { scheduleTaskCommentEmail } from "@/lib/sniffer-email"
import { isAssignee } from "@/lib/task-types"
import { addTaskComment, getTaskById } from "@/lib/tasks-db"

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params

  let body: { author?: string; body?: string; parentId?: string | null }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const author = typeof body.author === "string" ? body.author : ""
  const text = typeof body.body === "string" ? body.body : ""
  const parentId =
    typeof body.parentId === "string" && body.parentId.trim()
      ? body.parentId.trim()
      : body.parentId === null || body.parentId === ""
        ? null
        : undefined

  if (!isAssignee(author)) {
    return NextResponse.json({ error: "Pick Roshni or Misbah" }, { status: 400 })
  }
  if (!text.trim()) {
    return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 })
  }

  try {
    const ok = await addTaskComment(id, {
      author,
      body: text,
      parentId: parentId ?? undefined,
    })
    if (!ok) {
      return NextResponse.json(
        { error: parentId ? "Task or parent comment not found" : "Task not found" },
        { status: 404 }
      )
    }
    const task = await getTaskById(id)
    if (task) {
      scheduleTaskCommentEmail({
        taskId: id,
        taskTitle: task.title,
        assignedTo: task.assignedTo,
        author,
        body: text,
        isReply: Boolean(parentId),
      })
    }
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
