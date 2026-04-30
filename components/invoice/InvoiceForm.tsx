"use client"

import { IconRotateClockwise2 } from "@tabler/icons-react"

import { InvoiceTable } from "@/components/invoice/InvoiceTable"
import { NotesSection } from "@/components/invoice/NotesSection"
import type { InvoiceItem, InvoiceState } from "@/lib/invoice-types"
import { Button } from "@/components/ui/button"
import { BANK_ACCOUNTS } from "@/config/company"

type InvoiceFormProps = {
  state: InvoiceState
  onReset: () => void
  onUpdateClient: (field: keyof InvoiceState["client"], value: string) => void
  onUpdateMeta: (field: keyof InvoiceState["meta"], value: string) => void
  onUpdateSummary: (field: keyof InvoiceState["summary"], value: number | boolean) => void
  onUpdateNotes: (field: keyof InvoiceState["notes"], value: string) => void
  onUpdateBank: (index: number) => void
  onAddItem: () => void
  onRemoveItem: (id: string) => void
  onUpdateItem: (id: string, field: keyof Omit<InvoiceItem, "id">, value: string | number) => void
}

export function InvoiceForm({
  state,
  onReset,
  onUpdateClient,
  onUpdateMeta,
  onUpdateSummary,
  onUpdateNotes,
  onUpdateBank,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: InvoiceFormProps) {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-tight text-black">Client Details</h3>
          <Button
            type="button"
            variant="ghost"
            className="text-black/70 hover:bg-black/10"
            size="sm"
            onClick={onReset}
          >
            <IconRotateClockwise2 className="size-4" /> Reset
          </Button>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <label className="space-y-1 text-xs font-medium text-black/70">
            Name
            <input
              value={state.client.name}
              onChange={(event) => onUpdateClient("name", event.target.value)}
              className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-base text-black outline-none focus:border-[#6C5CE7] sm:text-sm"
              placeholder="Client name"
            />
          </label>

          <label className="space-y-1 text-xs font-medium text-black/70">
            Company
            <input
              value={state.client.companyName}
              onChange={(event) => onUpdateClient("companyName", event.target.value)}
              className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-base text-black outline-none focus:border-[#6C5CE7] sm:text-sm"
              placeholder="Client company"
            />
          </label>

          <label className="space-y-1 text-xs font-medium text-black/70">
            Email
            <input
              type="email"
              value={state.client.email}
              onChange={(event) => onUpdateClient("email", event.target.value)}
              className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-base text-black outline-none focus:border-[#6C5CE7] sm:text-sm"
              placeholder="name@company.com"
            />
          </label>

          <label className="space-y-1 text-xs font-medium text-black/70 md:col-span-2">
            Address
            <textarea
              rows={3}
              value={state.client.address}
              onChange={(event) => onUpdateClient("address", event.target.value)}
              className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-base text-black outline-none focus:border-[#6C5CE7] sm:text-sm"
              placeholder="Client address"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold tracking-tight text-black">Invoice Metadata</h3>
        <div className="grid gap-2 md:grid-cols-3">
          <label className="space-y-1 text-xs font-medium text-black/70">
            Invoice Number
            <input
              value={state.meta.invoiceNumber}
              onChange={(event) => onUpdateMeta("invoiceNumber", event.target.value)}
              className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-base text-black outline-none focus:border-[#6C5CE7] sm:text-sm"
            />
          </label>
          <label className="space-y-1 text-xs font-medium text-black/70">
            Issue Date
            <input
              type="date"
              value={state.meta.issueDate}
              onChange={(event) => onUpdateMeta("issueDate", event.target.value)}
              className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-base text-black outline-none focus:border-[#6C5CE7] sm:text-sm"
            />
          </label>
          <label className="space-y-1 text-xs font-medium text-black/70">
            Due Date
            <input
              type="date"
              value={state.meta.dueDate}
              onChange={(event) => onUpdateMeta("dueDate", event.target.value)}
              className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-base text-black outline-none focus:border-[#6C5CE7] sm:text-sm"
            />
          </label>
        </div>
      </section>

      <InvoiceTable
        items={state.items}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
        onUpdateItem={onUpdateItem}
      />

      <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold tracking-tight text-black">Pricing Summary</h3>

        <div className="space-y-3">
          <label className="flex min-h-11 items-center justify-between rounded-lg border border-black/10 bg-zinc-50 px-3 py-2 text-base text-black sm:min-h-0 sm:text-sm">
            <span className="font-medium">Enable Tax</span>
            <input
              type="checkbox"
              checked={state.summary.taxEnabled}
              onChange={(event) => onUpdateSummary("taxEnabled", event.target.checked)}
              className="size-4 accent-[#6C5CE7]"
            />
          </label>

          {state.summary.taxEnabled ? (
            <label className="space-y-1 text-xs font-medium text-black/70">
              Tax Rate (%)
              <input
                type="number"
                min={0}
                value={state.summary.taxRate}
                onChange={(event) =>
                  onUpdateSummary("taxRate", Number(event.target.value) || 0)
                }
                className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-base text-black outline-none focus:border-[#6C5CE7] sm:text-sm"
              />
            </label>
          ) : null}

          <label className="flex min-h-11 items-center justify-between rounded-lg border border-black/10 bg-zinc-50 px-3 py-2 text-base text-black sm:min-h-0 sm:text-sm">
            <span className="font-medium">Enable Discount</span>
            <input
              type="checkbox"
              checked={state.summary.discountEnabled}
              onChange={(event) => onUpdateSummary("discountEnabled", event.target.checked)}
              className="size-4 accent-[#6C5CE7]"
            />
          </label>

          {state.summary.discountEnabled ? (
            <label className="space-y-1 text-xs font-medium text-black/70">
              Discount Amount
              <input
                type="number"
                min={0}
                value={state.summary.discountAmount}
                onChange={(event) =>
                  onUpdateSummary("discountAmount", Number(event.target.value) || 0)
                }
                className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-base text-black outline-none focus:border-[#6C5CE7] sm:text-sm"
              />
            </label>
          ) : null}
        </div>
      </section>

      <NotesSection
        notes={state.notes.notes}
        paymentTerms={state.notes.paymentTerms}
        onChangeNotes={(value) => onUpdateNotes("notes", value)}
        onChangePaymentTerms={(value) => onUpdateNotes("paymentTerms", value)}
      />

      <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold tracking-tight text-black">Bank Account</h3>
        <div className="flex flex-col gap-2">
          {BANK_ACCOUNTS.map((bank, index) => (
            <label
              key={index}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-black/10 bg-zinc-50 px-3 py-2.5 text-sm has-[:checked]:border-[#6C5CE7] has-[:checked]:bg-[#6C5CE7]/5"
            >
              <input
                type="radio"
                name="selectedBank"
                checked={state.selectedBank === index}
                onChange={() => onUpdateBank(index)}
                className="accent-[#6C5CE7]"
              />
              <span className="font-medium text-black">{bank.bankName}</span>
              {bank.accountNumber ? (
                <span className="ml-auto text-xs text-black/45">{bank.accountNumber}</span>
              ) : null}
            </label>
          ))}
        </div>
      </section>
    </div>
  )
}
