import Image from "next/image"
import Link from "next/link"

import { COMPANY_DETAILS } from "@/config/company"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#ffffff_0%,_#f4f4f6_45%,_#ececf1_100%)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-lg">
        <header className="mb-12 flex flex-col items-center text-center">
          <div className="mb-5 rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-sm">
            <Image src="/assets/logo.png" alt="Impic Labs" width={52} height={52} priority />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-[1.75rem]">
            Impic internal tools
          </h1>
          <p className="mt-2 text-sm text-zinc-600">{COMPANY_DETAILS.name}</p>
        </header>

        <ul className="grid gap-4">
          <li>
            <Link
              href="/invoice"
              className="group block rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm transition hover:border-zinc-300 hover:shadow-md"
            >
              <p className="text-lg font-semibold text-zinc-900">Generate invoice</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">A4 layout, PDF export, print</p>
              <p className="mt-3 text-sm font-medium text-violet-700 group-hover:underline">Open →</p>
            </Link>
          </li>
          <li>
            <Link
              href="/sniffer"
              className="group block rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md"
            >
              <p className="text-lg font-semibold text-zinc-900">Tasks · Sniffer Lab</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                Team task board — browse and discuss freely; password only to add a new task
              </p>
              <p className="mt-3 text-sm font-medium text-violet-700 group-hover:underline">Open →</p>
            </Link>
          </li>
        </ul>
      </div>
    </main>
  )
}
