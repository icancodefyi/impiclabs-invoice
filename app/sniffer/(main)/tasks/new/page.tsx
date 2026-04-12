import { NewTaskForm } from "@/components/sniffer/new-task-form"

export default function NewTaskPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="rounded-xl border border-violet-200 bg-violet-50/60 px-4 py-3 text-sm text-violet-950">
        <p className="font-medium">Password only for this step</p>
        <p className="mt-1 text-violet-900/90">
          Anyone can view tasks and add comments. Enter the internal password at the bottom to create this
          task.
        </p>
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">New task</h1>
        <p className="mt-1 text-sm text-zinc-600">Markdown description with live preview.</p>
      </div>
      <NewTaskForm />
    </div>
  )
}
