export const ASSIGNEES = ["Roshni", "Misbah"] as const
export type Assignee = (typeof ASSIGNEES)[number]

export const TASK_STATUSES = ["todo", "doing", "done"] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export type TaskComment = {
  id: string
  author: string
  body: string
  createdAt: string
  /** Set when this comment is a reply to another comment in the same task. */
  parentId: string | null
}

export type Task = {
  _id: string
  title: string
  description: string
  assignedTo: string
  status: TaskStatus
  createdAt: string
  comments: TaskComment[]
}

export function isTaskStatus(v: string): v is TaskStatus {
  return (TASK_STATUSES as readonly string[]).includes(v)
}

export function isAssignee(v: string): v is Assignee {
  return (ASSIGNEES as readonly string[]).includes(v)
}
