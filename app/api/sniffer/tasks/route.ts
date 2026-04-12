import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { scheduleNewTaskEmail } from "@/lib/sniffer-email"
import { validateSnifferPassword } from "@/lib/sniffer-auth"
import { isAssignee } from "@/lib/task-types"
import { createTask, listTasks } from "@/lib/tasks-db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const assignedTo = searchParams.get("assignedTo") ?? undefined
    const status = searchParams.get("status") ?? undefined
    const tasks = await listTasks({ assignedTo, status })
    return NextResponse.json(tasks)
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  let body: { password?: string; title?: string; description?: string; assignedTo?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!validateSnifferPassword(body.password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const title = typeof body.title === "string" ? body.title.trim() : ""
  const description = typeof body.description === "string" ? body.description : ""
  const assignedTo = typeof body.assignedTo === "string" ? body.assignedTo : ""

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 })
  }
  if (!isAssignee(assignedTo)) {
    return NextResponse.json({ error: "Invalid assignee" }, { status: 400 })
  }

  try {
    const id = await createTask({
      title,
      description,
      assignedTo,
      status: "todo",
    })
    scheduleNewTaskEmail({
      taskId: id,
      title,
      assignedTo,
    })
    return NextResponse.json({ id }, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
