import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { isTaskStatus } from "@/lib/task-types"
import { getTaskById, updateTaskStatus } from "@/lib/tasks-db"

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
    const ok = await updateTaskStatus(id, status)
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
