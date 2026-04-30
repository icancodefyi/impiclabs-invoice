"use client"

import * as React from "react"
import Image from "next/image"

import { PaymentSection } from "@/components/invoice/PaymentSection"
import { A4_HEIGHT_PX, A4_WIDTH_PX } from "@/lib/a4"
import { BANK_ACCOUNTS, BRAND, COMPANY_DETAILS } from "@/config/company"
import { calculateItemTotal, calculateTotals } from "@/lib/calculateTotals"
import { formatCurrency } from "@/lib/formatCurrency"
import type { InvoiceItem, InvoiceState } from "@/lib/invoice-types"

type InvoicePreviewProps = {
  state: InvoiceState
  previewRef: React.RefObject<HTMLDivElement | null>
}

function toLineList(text: string) {
  const normalized = text.replace(/\r/g, "").trim()

  if (!normalized) {
    return ["-"]
  }

  if (normalized.includes("\n")) {
    return normalized
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
  }

  const sentenceSplit = normalized
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean)

  return sentenceSplit.length > 0 ? sentenceSplit : [normalized]
}

function useContentFitScale(measureRef: React.RefObject<HTMLDivElement | null>) {
  const [fitScale, setFitScale] = React.useState(1)

  React.useLayoutEffect(() => {
    const node = measureRef.current
    if (!node) {
      return
    }

    const measure = () => {
      const h = node.scrollHeight
      const w = node.scrollWidth
      if (h <= 0 || w <= 0) {
        return
      }
      const next = Math.min(1, A4_HEIGHT_PX / h, A4_WIDTH_PX / w)
      setFitScale((prev) => (Math.abs(prev - next) < 0.001 ? prev : next))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)

    return () => observer.disconnect()
  }, [measureRef])

  return fitScale
}

export function InvoicePreview({ state, previewRef }: InvoicePreviewProps) {
  const totals = calculateTotals(state.items, state.summary)
  const notesLines = toLineList(state.notes.notes)
  const paymentTermsLines = toLineList(state.notes.paymentTerms)
  const measureRef = React.useRef<HTMLDivElement>(null)
  const fitScale = useContentFitScale(measureRef)

  return (
    <div className="invoice-preview-viewport w-full min-w-0 overflow-x-auto overflow-y-visible py-2 touch-pan-x [-webkit-overflow-scrolling:touch]">
      <div className="invoice-preview-frame mx-auto flex w-max max-w-none justify-center">
        <div
          ref={previewRef}
          data-pdf-page="true"
          className="invoice-a4-sheet box-border overflow-hidden bg-white text-black shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          style={{
            width: A4_WIDTH_PX,
            height: A4_HEIGHT_PX,
          }}
        >
          <div
            ref={measureRef}
            className="invoice-content-fit box-border bg-white px-8 py-7"
            style={
              {
                width: A4_WIDTH_PX,
                ["--inv-fit"]: String(fitScale),
              } as React.CSSProperties
            }
          >
            <InvoicePageBody
              state={state}
              items={state.items}
              notesLines={notesLines}
              paymentTermsLines={paymentTermsLines}
              totals={totals}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

type InvoicePageBodyProps = {
  state: InvoiceState
  items: InvoiceItem[]
  notesLines: string[]
  paymentTermsLines: string[]
  totals: ReturnType<typeof calculateTotals>
}

function InvoicePageBody({
  state,
  items,
  notesLines,
  paymentTermsLines,
  totals,
}: InvoicePageBodyProps) {
  return (
    <>
      <header className="border-b border-black/15 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Image src="/assets/parent.png" alt="Company logo" width={66} height={66} className="shrink-0" />
            <div className="min-w-0">
              <h1
                className="text-[34px] leading-none font-bold tracking-tight sm:text-[38px]"
                style={{ color: BRAND.baseBlack }}
              >
                {COMPANY_DETAILS.name}
              </h1>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
                Official Invoice
              </p>
              <p className="mt-1 truncate text-[12px] font-medium text-black/65">{COMPANY_DETAILS.website}</p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">Invoice</p>
            <p className="mt-1 text-[22px] leading-none font-extrabold text-black sm:text-[24px]">
              #{state.meta.invoiceNumber || "-"}
            </p>
            <div className="mt-3 grid gap-1 text-[11px] text-black/70">
              <p>
                <span className="mr-2 font-semibold uppercase tracking-[0.14em] text-black/35">Issue</span>
                {state.meta.issueDate || "-"}
              </p>
              <p>
                <span className="mr-2 font-semibold uppercase tracking-[0.14em] text-black/35">Due</span>
                {state.meta.dueDate || "-"}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 h-px w-24" style={{ backgroundColor: BRAND.accentColor }} />
      </header>

      <section className="grid grid-cols-1 gap-6 py-4 sm:grid-cols-[1.1fr_1fr] sm:gap-8 sm:py-5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">Bill To</p>
          {state.client.name ? (
            <p className="mt-2 text-[17px] font-semibold leading-snug text-black sm:text-[18px]">
              {state.client.name}
            </p>
          ) : null}
          {state.client.companyName ? (
            <p className="mt-1 text-[13px] text-black/75">{state.client.companyName}</p>
          ) : null}
          {state.client.email ? (
            <p className="mt-2 text-[12px] text-black/72">{state.client.email}</p>
          ) : null}
          {state.client.address ? (
            <p className="mt-1 whitespace-pre-wrap break-words text-[12px] leading-relaxed text-black/72">
              {state.client.address}
            </p>
          ) : null}
        </div>

        <div className="min-w-0 text-left sm:text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">From</p>
          <p className="mt-2 text-[14px] font-semibold text-black/90">{COMPANY_DETAILS.name}</p>
          <p className="mt-2 text-[12px] text-black/65">{COMPANY_DETAILS.email}</p>
          <p className="mt-1 whitespace-pre-wrap break-words text-[12px] leading-relaxed text-black/65">
            {COMPANY_DETAILS.address}
          </p>
        </div>
      </section>

      <section className="border-y border-black/15 py-1">
        <table className="w-full min-w-0 table-fixed border-collapse text-[13px]">
          <thead>
            <tr className="text-black/75">
              <th className="w-[44%] px-0 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.14em] sm:text-[11px] sm:tracking-[0.16em]">
                Service
              </th>
              <th className="w-[12%] px-0 py-2 text-right text-[10px] font-semibold uppercase tracking-[0.14em] sm:text-[11px]">
                Qty
              </th>
              <th className="w-[22%] px-0 py-2 text-right text-[10px] font-semibold uppercase tracking-[0.14em] sm:text-[11px]">
                Rate
              </th>
              <th className="w-[22%] px-0 py-2 text-right text-[10px] font-semibold uppercase tracking-[0.14em] sm:text-[11px]">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-black/10 align-top">
                <td className="min-w-0 px-0 py-3 pr-2 sm:py-4 sm:pr-5">
                  <p className="break-words text-[13px] font-semibold text-black/95 sm:text-[14px]">
                    {item.name || "Untitled item"}
                  </p>
                  {item.description ? (
                    <p className="mt-1 break-words text-[10px] leading-relaxed text-black/60 sm:text-[11px]">
                      {item.description}
                    </p>
                  ) : null}
                </td>
                <td className="px-0 py-3 text-right text-[12px] font-medium text-black/80 sm:py-4">{item.quantity}</td>
                <td className="px-0 py-3 text-right text-[12px] font-medium text-black/80 sm:py-4">
                  {formatCurrency(item.price)}
                </td>
                <td className="px-0 py-3 text-right text-[14px] font-semibold text-black sm:py-4 sm:text-[15px]">
                  {formatCurrency(calculateItemTotal(item))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="ml-auto mt-5 w-full max-w-sm space-y-2 text-[12px] sm:mt-7">
        <div className="flex items-center justify-between text-black/65">
          <span className="uppercase tracking-[0.12em]">Subtotal</span>
          <span className="font-semibold text-black/90">{formatCurrency(totals.subtotal)}</span>
        </div>
        {state.summary.taxEnabled ? (
          <div className="flex items-center justify-between text-black/65">
            <span className="uppercase tracking-[0.12em]">Tax ({state.summary.taxRate}%)</span>
            <span className="font-semibold text-black/90">{formatCurrency(totals.taxAmount)}</span>
          </div>
        ) : null}
        {state.summary.discountEnabled ? (
          <div className="flex items-center justify-between text-black/65">
            <span className="uppercase tracking-[0.12em]">Discount</span>
            <span className="font-semibold text-black/90">-{formatCurrency(totals.discountAmount)}</span>
          </div>
        ) : null}
        <div className="mt-3 border-t border-black/20 pt-3 sm:mt-4 sm:pt-4">
          <p className="text-right text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">Total Due</p>
          <p className="mt-1 text-right text-[26px] leading-none font-bold text-black sm:text-[30px]">
            {formatCurrency(totals.finalTotal)}
          </p>
        </div>
      </section>

      <section className="mt-5 border-t border-black/10 pt-4 sm:mt-7 sm:pt-5">
        <div className="grid grid-cols-1 gap-5 text-[11px] sm:grid-cols-2 sm:gap-8">
          <div className="min-w-0 border-black/10 sm:border-r sm:pr-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/30">Notes</p>
            <ul className="mt-2 space-y-1 leading-relaxed text-black/70">
              {notesLines.map((line, lineIndex) => (
                <li key={`note-${lineIndex}`} className="break-words">
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 sm:pl-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/30">Payment Terms</p>
            <ul className="mt-2 space-y-1 leading-relaxed text-black/70">
              {paymentTermsLines.map((line, lineIndex) => (
                <li key={`term-${lineIndex}`} className="break-words">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-4 border-t border-black/15 pt-3 sm:mt-5 sm:pt-4">
        <PaymentSection compact bank={BANK_ACCOUNTS[state.selectedBank]} />
      </section>
    </>
  )
}
