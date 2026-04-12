import { ObjectId, type Document } from "mongodb"

import { getDb } from "@/lib/mongodb"
import type { Task, TaskComment, TaskStatus } from "@/lib/task-types"
import { isAssignee, isTaskStatus } from "@/lib/task-types"

const COLL = "tasks"

type CommentDoc = {
  _id: ObjectId
  author: string
  body: string
  createdAt: Date
  parentId?: ObjectId
}

type TaskDoc = Document & {
  _id: ObjectId
  title: string
  description: string
  assignedTo: string
  status: string
  createdAt: Date
  comments?: CommentDoc[]
}

function normalizeComments(raw: unknown): TaskComment[] {
  if (!Array.isArray(raw)) {
    return []
  }
  const out: TaskComment[] = []
  for (const c of raw) {
    if (!c || typeof c !== "object") {
      continue
    }
    const o = c as Record<string, unknown>
    const id =
      o._id instanceof ObjectId
        ? o._id.toHexString()
        : typeof o._id === "string"
          ? o._id
          : typeof o.id === "string"
            ? o.id
            : ""
    const author = typeof o.author === "string" ? o.author : ""
    const body = typeof o.body === "string" ? o.body : ""
    const createdAt =
      o.createdAt instanceof Date
        ? o.createdAt.toISOString()
        : typeof o.createdAt === "string"
          ? o.createdAt
          : new Date(0).toISOString()
    let parentId: string | null = null
    if (o.parentId instanceof ObjectId) {
      parentId = o.parentId.toHexString()
    } else if (typeof o.parentId === "string" && ObjectId.isValid(o.parentId)) {
      parentId = o.parentId
    }
    if (id && author) {
      out.push({ id, author, body, createdAt, parentId })
    }
  }
  return out.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
}

function toTask(doc: TaskDoc): Task {
  return {
    _id: doc._id.toHexString(),
    title: doc.title,
    description: doc.description,
    assignedTo: doc.assignedTo,
    status: isTaskStatus(doc.status) ? doc.status : "todo",
    createdAt: doc.createdAt.toISOString(),
    comments: normalizeComments(doc.comments),
  }
}

export async function listTasks(filters: { assignedTo?: string; status?: string }) {
  const db = await getDb()
  const query: Record<string, string> = {}
  if (filters.assignedTo && isAssignee(filters.assignedTo)) {
    query.assignedTo = filters.assignedTo
  }
  if (filters.status && isTaskStatus(filters.status)) {
    query.status = filters.status
  }
  const rows = await db.collection<TaskDoc>(COLL).find(query).sort({ createdAt: -1 }).toArray()
  return rows.map(toTask)
}

export async function getTaskById(id: string): Promise<Task | null> {
  if (!ObjectId.isValid(id)) {
    return null
  }
  const db = await getDb()
  const doc = await db.collection<TaskDoc>(COLL).findOne({ _id: new ObjectId(id) })
  if (!doc) {
    return null
  }
  return toTask(doc)
}

export async function createTask(input: {
  title: string
  description: string
  assignedTo: string
  status: TaskStatus
}) {
  const db = await getDb()
  const createdAt = new Date()
  const result = await db.collection(COLL).insertOne({
    title: input.title.trim(),
    description: input.description,
    assignedTo: input.assignedTo,
    status: input.status,
    createdAt,
    comments: [],
  })
  return result.insertedId.toHexString()
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    return false
  }
  const db = await getDb()
  const result = await db.collection(COLL).updateOne({ _id: new ObjectId(id) }, { $set: { status } })
  return result.matchedCount > 0
}

export async function addTaskComment(
  taskId: string,
  input: { author: string; body: string; parentId?: string | null }
): Promise<boolean> {
  if (!ObjectId.isValid(taskId)) {
    return false
  }
  if (!isAssignee(input.author)) {
    return false
  }
  const body = input.body.trim()
  if (!body) {
    return false
  }

  let parentObjectId: ObjectId | undefined
  if (input.parentId) {
    if (!ObjectId.isValid(input.parentId)) {
      return false
    }
    parentObjectId = new ObjectId(input.parentId)
  }

  const db = await getDb()
  const task = await db.collection<TaskDoc>(COLL).findOne(
    { _id: new ObjectId(taskId) },
    { projection: { comments: 1 } }
  )
  if (!task) {
    return false
  }

  if (parentObjectId) {
    const parentExists = (task.comments ?? []).some((c) => c._id.equals(parentObjectId))
    if (!parentExists) {
      return false
    }
  }

  const comment: CommentDoc = {
    _id: new ObjectId(),
    author: input.author,
    body,
    createdAt: new Date(),
    ...(parentObjectId ? { parentId: parentObjectId } : {}),
  }

  const result = await db.collection(COLL).updateOne(
    { _id: new ObjectId(taskId) },
    // MongoDB Node driver's PushOperator types reject nested subdocuments; runtime shape is valid.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { $push: { comments: comment } } as any
  )
  return result.matchedCount > 0
}
