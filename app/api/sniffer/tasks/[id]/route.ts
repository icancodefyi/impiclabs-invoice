import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { scheduleStatusChangeEmail, scheduleTaskDeletedEmail } from "@/lib/sniffer-email"
import { validateSnifferPassword } from "@/lib/sniffer-auth"
import { isTaskStatus } from "@/lib/task-types"
import { deleteTaskById, getTaskById, updateTaskStatus } from "@/lib/tasks-db"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  try {
    const task = await getTaskById(id)
    if (!task) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(task)
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  let body: { status?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const status = typeof body.status === "string" ? body.status : ""
  if (!isTaskStatus(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  try {
    const existing = await getTaskById(id)
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    if (existing.status === status) {
      return NextResponse.json({ ok: true })
    }
    const ok = await updateTaskStatus(id, status)
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    scheduleStatusChangeEmail({
      taskId: id,
      title: existing.title,
      assignedTo: existing.assignedTo,
      fromStatus: existing.status,
      toStatus: status,
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!validateSnifferPassword(body.password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  try {
    const existing = await getTaskById(id)
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    const ok = await deleteTaskById(id)
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    scheduleTaskDeletedEmail({
      taskId: id,
      title: existing.title,
      assignedTo: existing.assignedTo,
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
