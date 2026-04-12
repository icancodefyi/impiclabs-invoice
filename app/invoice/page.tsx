"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { IconDownload, IconPrinter } from "@tabler/icons-react"

import { InvoiceForm } from "@/components/invoice/InvoiceForm"
import { InvoicePreview } from "@/components/invoice/InvoicePreview"
import { BRAND, COMPANY_DETAILS } from "@/config/company"
import { exportElementToA4Pdf } from "@/lib/exportPdf"
import { Button } from "@/components/ui/button"
import { useInvoiceStore } from "@/store/invoiceStore"

export default function InvoicePage() {
  const previewRef = React.useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = React.useState(false)

  const {
    state,
    resetState,
    updateClient,
    updateMeta,
    updateSummary,
    updateNotes,
    addItem,
    removeItem,
    updateItem,
  } = useInvoiceStore()

  async function handleExportPdf() {
    if (!previewRef.current) {
      return
    }

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
    window.print()
  }

  return (
    <main className="app-shell min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f4f4f5_44%,#ececf0_100%)] px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
      <section className="mx-auto max-w-[1600px] min-w-0">
        <header className="no-print mb-4 rounded-3xl border border-black/10 bg-white/90 p-4 shadow-sm backdrop-blur md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-black/10 bg-white p-2">
                <Image src="/assets/logo.png" alt="Impic Labs logo" width={34} height={34} />
              </div>
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.24em]"
                  style={{ color: BRAND.accentColor }}
                >
                  Internal Tool
                </p>
                <h1 className="text-lg font-bold tracking-tight text-black md:text-xl">
                  Impic Invoice Studio
                </h1>
                <p className="text-xs text-black/60">{COMPANY_DETAILS.name} invoice generator</p>
              </div>
            </div>

            <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:w-auto">
              <Link
                href="/"
                className="text-sm font-medium text-black/60 underline-offset-2 hover:text-black hover:underline"
              >
                Home
              </Link>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11 w-full border-black/20 bg-white text-black hover:bg-zinc-100 sm:min-h-9 sm:w-auto"
                  onClick={handlePrint}
                >
                  <IconPrinter className="size-4" /> Print
                </Button>
                <Button
                  type="button"
                  className="min-h-11 w-full bg-black text-white hover:bg-black/85 sm:min-h-9 sm:w-auto"
                  onClick={handleExportPdf}
                  disabled={isExporting}
                >
                  <IconDownload className="size-4" />
                  {isExporting ? "Exporting..." : "Export A4 PDF"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="grid min-w-0 gap-4 xl:grid-cols-[1.08fr_1fr]">
          <aside className="no-print min-h-0 overflow-y-auto rounded-3xl border border-black/10 bg-white/75 p-3 backdrop-blur md:p-4 xl:max-h-[calc(100vh-7rem)]">
            <InvoiceForm
              state={state}
              onReset={resetState}
              onUpdateClient={updateClient}
              onUpdateMeta={updateMeta}
              onUpdateSummary={updateSummary}
              onUpdateNotes={updateNotes}
              onAddItem={addItem}
              onRemoveItem={removeItem}
              onUpdateItem={updateItem}
            />
          </aside>

          <section className="invoice-preview-section min-w-0 rounded-3xl border border-black/10 bg-white/65 p-2 backdrop-blur sm:p-3 md:p-4">
            <p className="no-print mb-2 max-w-xl text-xs font-semibold uppercase tracking-[0.2em] text-black/55">
              True A4 size on screen (210 × 297 mm). Exported PDF matches this preview — scroll sideways on
              narrow viewports.
            </p>
            <InvoicePreview state={state} previewRef={previewRef} />
          </section>
        </div>
      </section>
    </main>
  )
}
