"use client"

import * as React from "react"
import Image from "next/image"
import { Link } from "next-view-transitions"
import { IconDownload, IconPrinter, IconHome, IconChevronRight, IconEye, IconEdit } from "@tabler/icons-react"

import { InvoiceForm } from "@/components/invoice/InvoiceForm"
import { InvoicePreview } from "@/components/invoice/InvoicePreview"
import { exportElementToA4Pdf } from "@/lib/exportPdf"
import { Button } from "@/components/ui/button"
import { useInvoiceStore } from "@/store/invoiceStore"

export default function InvoicePage() {
  const previewRef = React.useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = React.useState(false)
  const [mobileTab, setMobileTab] = React.useState<"form" | "preview">("form")

  const {
    state, resetState, updateClient, updateMeta,
    updateSummary, updateNotes, updateBank,
    addItem, removeItem, updateItem,
  } = useInvoiceStore()

  async function handleExportPdf() {
    if (!previewRef.current) return
    try {
      setIsExporting(true)
      await exportElementToA4Pdf(previewRef.current, {
        fileName: `${state.meta.invoiceNumber || "invoice"}.pdf`,
      })
    } finally {
      setIsExporting(false)
    }
  }

  function handlePrint() {
    if (!previewRef.current) return
    const win = window.open("", "_blank", "width=900,height=1200")
    if (!win) return

    // Collect all CSS from current page (includes Next.js inlined font faces)
    const styleBlocks = Array.from(document.querySelectorAll("style"))
      .map((s) => s.innerHTML)
      .join("\n")
    const linkHrefs = Array.from(document.querySelectorAll("link[rel='stylesheet']" ))
      .map((l) => `<link rel="stylesheet" href="${(l as HTMLLinkElement).href}">`)
      .join("\n")

    const html = previewRef.current.outerHTML
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
      ${linkHrefs}
      <style>
        @page { size: A4 portrait; margin: 12mm; }
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        body { margin: 0; padding: 0; background: #fff; }
        .invoice-a4-sheet { width: 100% !important; height: auto !important; overflow: visible !important; box-shadow: none !important; }
        .invoice-content-fit { transform: none !important; width: 100% !important; height: auto !important; overflow: visible !important; }
        .leading-none { line-height: 1.2 !important; }
        .truncate { overflow: visible !important; text-overflow: clip !important; white-space: normal !important; }
        ${styleBlocks}
      </style>
    </head><body>${html}</body></html>`)
    win.document.close()
    win.focus()
    win.onload = () => {
      win.document.fonts.ready.then(() => {
        win.print()
        win.close()
      })
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">

      {/* ── Top nav ── */}
      <header className="no-print z-20 shrink-0 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex h-14 items-center gap-2 px-3 sm:px-5">

          {/* Breadcrumb */}
          <Link href="/" className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
            <IconHome size={14} stroke={2} />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <IconChevronRight size={13} className="shrink-0 text-slate-300" stroke={2} />
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
              <Image src="/assets/logo.png" alt="Impic Labs" width={20} height={20} />
            </div>
            <p className="text-sm font-bold text-slate-900">Invoice Studio</p>
          </div>

          {/* Right side: actions + tab toggle */}
          <div className="ml-auto flex items-center gap-2">

            {/* Print + PDF — always visible */}
            <button
              onClick={handlePrint}
              className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              title="Print"
            >
              <IconPrinter size={15} stroke={2} />
            </button>
            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              <IconDownload size={13} stroke={2} />
              <span className="hidden sm:inline">{isExporting ? "Exporting..." : "Export PDF"}</span>
              <span className="sm:hidden">PDF</span>
            </button>

            {/* Mobile tab toggle */}
            <div className="flex items-center gap-0.5 rounded-xl border border-slate-200 bg-slate-100 p-1 lg:hidden">
              <button
                onClick={() => setMobileTab("form")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${mobileTab === "form" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                <IconEdit size={13} stroke={2} />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={() => setMobileTab("preview")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${mobileTab === "preview" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                <IconEye size={13} stroke={2} />
                <span className="hidden sm:inline">Preview</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">

        {/* Form panel */}
        <aside className={`no-print flex w-full shrink-0 flex-col overflow-y-auto bg-slate-50 lg:w-[420px] xl:w-[460px] ${mobileTab === "preview" ? "hidden lg:flex" : "flex"}`}>
          <div className="p-3 sm:p-4">
            <InvoiceForm
              state={state}
              onReset={resetState}
              onUpdateClient={updateClient}
              onUpdateMeta={updateMeta}
              onUpdateSummary={updateSummary}
              onUpdateNotes={updateNotes}
              onUpdateBank={updateBank}
              onAddItem={addItem}
              onRemoveItem={removeItem}
              onUpdateItem={updateItem}
            />
          </div>
        </aside>

        {/* Preview panel */}
        <section className={`invoice-preview-section min-w-0 flex-1 overflow-hidden bg-slate-200 ${mobileTab === "form" ? "hidden lg:flex" : "flex"} flex-col`}>
          <ScaledPreview>
            <InvoicePreview state={state} previewRef={previewRef} />
          </ScaledPreview>
        </section>
      </div>
    </div>
  )
}

function ScaledPreview({ children }: { children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(1)

  // A4 at 96dpi
  const A4_W = Math.round((210 / 25.4) * 96)
  const A4_H = Math.round((297 / 25.4) * 96)

  React.useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const calc = () => {
      const availW = el.clientWidth - 48
      const availH = el.clientHeight - 48
      const s = Math.min(1, availW / A4_W, availH / A4_H)
      setScale(s)
    }
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [A4_W, A4_H])

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center overflow-hidden p-6">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          width: A4_W,
          height: A4_H,
          flexShrink: 0,
        }}
      >
        {children}
      </div>
    </div>
  )
}
