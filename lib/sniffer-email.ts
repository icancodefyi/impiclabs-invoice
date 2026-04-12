import { after } from "next/server"
import nodemailer from "nodemailer"

import { statusLabel } from "@/lib/sniffer-ui"
import type { Assignee, TaskStatus } from "@/lib/task-types"
import { isAssignee } from "@/lib/task-types"

/**
 * Base URL for links inside Sniffer notification emails.
 * Prefer SNIFFER_PUBLIC_BASE_URL (or SNIFFER_APP_URL) on Vercel so links use your
 * real domain (e.g. https://hq.impiclabs.com) instead of *.vercel.app deploy URLs.
 */
function snifferAppOrigin(): string {
  const explicit =
    process.env.SNIFFER_PUBLIC_BASE_URL?.trim() ?? process.env.SNIFFER_APP_URL?.trim()
  if (explicit) {
    return explicit.replace(/\/$/, "")
  }
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (site) {
    return site.replace(/\/$/, "")
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`
  }
  return "http://localhost:3000"
}

/** Internal inbox for all Sniffer activity (e.g. impic.tech@gmail.com). */
export function getOpsNotifyEmail(): string | null {
  const raw = process.env.SNIFFER_NOTIFY_EMAIL_OPS?.trim()
  return raw || null
}

/** Notify address for an assignee (from env). */
export function getAssigneeNotifyEmail(assignee: string): string | null {
  if (!isAssignee(assignee)) {
    return null
  }
  const key =
    assignee === "Roshni" ? "SNIFFER_NOTIFY_EMAIL_ROSHNI" : "SNIFFER_NOTIFY_EMAIL_MISBAH"
  const raw = process.env[key]?.trim()
  return raw || null
}

/** Primary recipient + optional BCC to ops when different address. */
function resolveToAndBcc(assigneeEmail: string | null): { to: string; bcc?: string } | null {
  const ops = getOpsNotifyEmail()
  const to = assigneeEmail ?? ops
  if (!to) {
    return null
  }
  if (assigneeEmail && ops && assigneeEmail.toLowerCase() !== ops.toLowerCase()) {
    return { to: assigneeEmail, bcc: ops }
  }
  return { to }
}

async function sendViaSmtp(params: {
  to: string
  bcc?: string
  subject: string
  text: string
}): Promise<void> {
  const host = process.env.SNIFFER_SMTP_HOST?.trim()
  const user = process.env.SNIFFER_SMTP_USER?.trim()
  const pass = process.env.SNIFFER_SMTP_PASS?.trim()

  if (!host || !user || !pass) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[sniffer-email] Set SNIFFER_SMTP_HOST, SNIFFER_SMTP_USER, and SNIFFER_SMTP_PASS; skipping email to",
        params.to
      )
    }
    return
  }

  const portRaw = process.env.SNIFFER_SMTP_PORT?.trim()
  const port = portRaw ? Number.parseInt(portRaw, 10) : 587
  const secureFlag = process.env.SNIFFER_SMTP_SECURE?.trim().toLowerCase()
  const secure =
    secureFlag === "true" ||
    secureFlag === "1" ||
    (!Number.isNaN(port) && port === 465)

  const from = process.env.SNIFFER_EMAIL_FROM?.trim() || user

  const transport = nodemailer.createTransport({
    host,
    port: Number.isNaN(port) ? 587 : port,
    secure,
    auth: { user, pass },
  })

  await transport.sendMail({
    from,
    to: params.to,
    ...(params.bcc ? { bcc: params.bcc } : {}),
    subject: params.subject,
    text: params.text,
  })
}

export async function notifyNewTaskAssigned(params: {
  taskId: string
  title: string
  assignedTo: Assignee
}): Promise<void> {
  const assigneeTo = getAssigneeNotifyEmail(params.assignedTo)
  const routing = resolveToAndBcc(assigneeTo)
  if (!routing) {
    return
  }

  const url = `${snifferAppOrigin()}/sniffer/tasks/${params.taskId}`
  const assigneeBody = `Hi ${params.assignedTo},

You have been assigned a new task.

Title: ${params.title}

Open in Sniffer Lab: ${url}

— Impic internal · Sniffer Lab`

  const opsOnlyBody = `New task (assignee notify email not set for ${params.assignedTo}).

Assignee: ${params.assignedTo}
Title: ${params.title}

Open: ${url}

— Sniffer Lab · ops copy`

  const text = assigneeTo ? assigneeBody : opsOnlyBody

  await sendViaSmtp({
    to: routing.to,
    bcc: routing.bcc,
    subject: `[Sniffer Lab] New task assigned: ${params.title}`,
    text,
  })
}

export async function notifyTaskStatusChanged(params: {
  taskId: string
  title: string
  assignedTo: string
  fromStatus: TaskStatus
  toStatus: TaskStatus
}): Promise<void> {
  if (params.fromStatus === params.toStatus) {
    return
  }

  const assigneeTo = getAssigneeNotifyEmail(params.assignedTo)
  const routing = resolveToAndBcc(assigneeTo)
  if (!routing) {
    return
  }

  const url = `${snifferAppOrigin()}/sniffer/tasks/${params.taskId}`
  const fromL = statusLabel(params.fromStatus)
  const toL = statusLabel(params.toStatus)

  const assigneeBody = `Hi,

Task status was updated: ${fromL} → ${toL}

Task: ${params.title}

Open: ${url}

— Sniffer Lab`

  const opsOnlyBody = `Status change (assignee notify email not set for ${params.assignedTo}).

Assignee: ${params.assignedTo}
Task: ${params.title}
Status: ${fromL} → ${toL}

Open: ${url}

— Sniffer Lab · ops copy`

  const text = assigneeTo ? assigneeBody : opsOnlyBody

  await sendViaSmtp({
    to: routing.to,
    bcc: routing.bcc,
    subject: `[Sniffer Lab] Status: ${params.title}`,
    text,
  })
}

export async function notifyTaskCommentPosted(params: {
  taskId: string
  taskTitle: string
  assignedTo: string
  author: string
  body: string
  isReply: boolean
}): Promise<void> {
  const assigneeTo = getAssigneeNotifyEmail(params.assignedTo)
  const routing = resolveToAndBcc(assigneeTo)
  if (!routing) {
    return
  }

  const url = `${snifferAppOrigin()}/sniffer/tasks/${params.taskId}`
  const excerpt =
    params.body.length > 600 ? `${params.body.slice(0, 600).trim()}…` : params.body
  const kind = params.isReply ? "Reply" : "Comment"

  const assigneeBody = `Hi,

${params.author} posted a ${kind.toLowerCase()} on your task.

Task: ${params.taskTitle}

---
${excerpt}
---

Open: ${url}

— Sniffer Lab`

  const opsOnlyBody = `${kind} on task (assignee notify email not set for ${params.assignedTo}).

Author: ${params.author}
Assignee: ${params.assignedTo}
Task: ${params.taskTitle}

---
${excerpt}
---

Open: ${url}

— Sniffer Lab · ops copy`

  const text = assigneeTo ? assigneeBody : opsOnlyBody

  await sendViaSmtp({
    to: routing.to,
    bcc: routing.bcc,
    subject: `[Sniffer Lab] ${kind} on: ${params.taskTitle}`,
    text,
  })
}

/** Run email work after the response is sent (keeps API snappy on serverless). */
export function scheduleNewTaskEmail(payload: {
  taskId: string
  title: string
  assignedTo: Assignee
}): void {
  after(async () => {
    try {
      await notifyNewTaskAssigned(payload)
    } catch (e) {
      console.error("[sniffer-email] notifyNewTaskAssigned:", e)
    }
  })
}

export function scheduleStatusChangeEmail(payload: {
  taskId: string
  title: string
  assignedTo: string
  fromStatus: TaskStatus
  toStatus: TaskStatus
}): void {
  after(async () => {
    try {
      await notifyTaskStatusChanged(payload)
    } catch (e) {
      console.error("[sniffer-email] notifyTaskStatusChanged:", e)
    }
  })
}

export function scheduleTaskCommentEmail(payload: {
  taskId: string
  taskTitle: string
  assignedTo: string
  author: string
  body: string
  isReply: boolean
}): void {
  after(async () => {
    try {
      await notifyTaskCommentPosted(payload)
    } catch (e) {
      console.error("[sniffer-email] notifyTaskCommentPosted:", e)
    }
  })
}

export async function notifyTaskDeleted(params: {
  taskId: string
  title: string
  assignedTo: string
}): Promise<void> {
  const ops = getOpsNotifyEmail()
  if (!ops) {
    return
  }
  const listUrl = `${snifferAppOrigin()}/sniffer/tasks`
  await sendViaSmtp({
    to: ops,
    subject: `[Sniffer Lab] Task deleted: ${params.title}`,
    text: `A task was removed (password-protected delete).

Title: ${params.title}
Assignee: ${params.assignedTo}
Task id: ${params.taskId}

Tasks list: ${listUrl}

— Sniffer Lab · ops`,
  })
}

export function scheduleTaskDeletedEmail(payload: {
  taskId: string
  title: string
  assignedTo: string
}): void {
  after(async () => {
    try {
      await notifyTaskDeleted(payload)
    } catch (e) {
      console.error("[sniffer-email] notifyTaskDeleted:", e)
    }
  })
}
