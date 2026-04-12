"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { AssigneeAvatar } from "@/components/sniffer/assignee-avatar"
import { MarkdownBody } from "@/components/sniffer/markdown-body"
import { Button } from "@/components/ui/button"
import { ASSIGNEES } from "@/lib/task-types"
import type { TaskComment } from "@/lib/task-types"

function byCreatedAt(a: TaskComment, b: TaskComment) {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
}

function CommentThread({
  comment,
  all,
  onReply,
  depth,
}: {
  comment: TaskComment
  all: TaskComment[]
  onReply: (c: TaskComment) => void
  depth: number
}) {
  const replies = all.filter((c) => c.parentId === comment.id).sort(byCreatedAt)

  return (
    <li className={depth > 0 ? "pt-1" : ""}>
      <div
        className={`flex gap-3 rounded-xl border border-zinc-200/80 bg-white px-3 py-3 shadow-sm sm:px-4 sm:py-3.5 ${depth > 0 ? "bg-zinc-50/80" : ""}`}
      >
        <AssigneeAvatar name={comment.author} size={depth > 0 ? "sm" : "md"} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100/90 pb-2">
            <span className="text-sm font-semibold text-zinc-900">{comment.author}</span>
            <time className="text-xs tabular-nums text-zinc-500">
              {new Date(comment.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </time>
          </div>
          <div className="pt-2.5">
            <MarkdownBody markdown={comment.body} size="sm" />
          </div>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => onReply(comment)}
              className="text-xs font-medium text-violet-700 underline-offset-2 hover:underline"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
      {replies.length > 0 ? (
        <ul
          className={`mt-3 space-y-3 ${depth === 0 ? "ml-2 border-l-2 border-violet-100 pl-4 sm:ml-3 sm:pl-5" : "ml-1 border-l border-zinc-200 pl-3 sm:ml-2 sm:pl-4"}`}
        >
          {replies.map((r) => (
            <CommentThread key={r.id} comment={r} all={all} onReply={onReply} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export function TaskComments({
  taskId,
  initialComments,
}: {
  taskId: string
  initialComments: TaskComment[]
}) {
  const router = useRouter()
  const [author, setAuthor] = React.useState<string>(ASSIGNEES[0])
  const [body, setBody] = React.useState("")
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [replyingTo, setReplyingTo] = React.useState<TaskComment | null>(null)

  const topLevel = initialComments
    .filter((c) => !c.parentId)
    .sort(byCreatedAt)

  async function submitComment(parentId: string | undefined) {
    setPending(true)
    setError(null)
    try {
      const res = await fetch(`/api/sniffer/tasks/${taskId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author,
          body,
          ...(parentId ? { parentId } : {}),
        }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        throw new Error(data.error ?? "Could not post comment")
      }
      setBody("")
      setReplyingTo(null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed")
    } finally {
      setPending(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    await submitComment(replyingTo?.id)
  }

  function onReply(c: TaskComment) {
    setReplyingTo(c)
    setError(null)
  }

  function cancelReply() {
    setReplyingTo(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Discussion</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Threaded replies · pick your name · markdown supported
        </p>
      </div>

      {initialComments.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-10 text-center text-sm text-zinc-500">
          No comments yet. Be the first to add a note.
        </p>
      ) : (
        <ul className="space-y-4">
          {topLevel.map((c) => (
            <CommentThread key={c.id} comment={c} all={initialComments} onReply={onReply} depth={0} />
          ))}
        </ul>
      )}

      <form
        onSubmit={(e) => void onSubmit(e)}
        className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 sm:p-5"
      >
        {replyingTo ? (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-950 ring-1 ring-violet-200/80">
            <span>
              Replying to <strong className="font-semibold">{replyingTo.author}</strong>
            </span>
            <button
              type="button"
              onClick={cancelReply}
              className="text-xs font-medium text-violet-800 underline-offset-2 hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : null}
        <p className="mb-3 text-sm font-medium text-zinc-800">
          {replyingTo ? "Your reply" : "Add a comment"}
        </p>
        <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">Your name</label>
            <div className="flex items-center gap-2">
              <AssigneeAvatar name={author} size="sm" />
              <select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
              >
                {ASSIGNEES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-zinc-500">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
              placeholder="Write an update… (markdown ok)"
            />
          </div>
        </div>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="submit"
            disabled={pending || !body.trim()}
            className="bg-zinc-900 text-white hover:bg-zinc-800"
          >
            {pending ? "Posting…" : replyingTo ? "Post reply" : "Post comment"}
          </Button>
        </div>
      </form>
    </div>
  )
}
