"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const base =
  "markdown-sniffer leading-relaxed text-zinc-800 [&_a]:font-medium [&_a]:text-violet-700 [&_a]:underline [&_a]:decoration-violet-300 [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mt-5 [&_h2]:font-semibold [&_h2]:tracking-tight [&_li]:ml-4 [&_li]:list-disc [&_li]:marker:text-zinc-400 [&_ol]:ml-4 [&_ol]:list-decimal [&_ol]:marker:text-zinc-400 [&_p]:my-2.5 [&_p]:first:mt-0 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-zinc-200 [&_pre]:bg-zinc-950 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:text-zinc-100 [&_strong]:font-semibold [&_strong]:text-zinc-900 [&_ul]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-200 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-600"

const sizes = {
  sm: "text-sm [&_h1]:text-base [&_h2]:text-sm",
  md: "text-[15px] [&_h1]:text-xl [&_h2]:text-lg",
  lg: "text-base leading-[1.7] [&_h1]:text-2xl [&_h1]:mt-0 [&_h1]:mb-1 [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:my-3.5 [&_li]:my-1",
} as const

export function MarkdownBody({
  markdown,
  size = "sm",
  className = "",
}: {
  markdown: string
  size?: keyof typeof sizes
  className?: string
}) {
  return (
    <div className={`${base} ${sizes[size]} ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown || "_No description._"}
      </ReactMarkdown>
    </div>
  )
}
