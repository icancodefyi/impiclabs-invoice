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

const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
const labelCls = "block space-y-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400"
const sectionCls = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
const sectionTitleCls = "mb-3 text-sm font-bold text-slate-800"

export function InvoiceForm({
  state, onReset, onUpdateClient, onUpdateMeta,
  onUpdateSummary, onUpdateNotes, onUpdateBank,
  onAddItem, onRemoveItem, onUpdateItem,
}: InvoiceFormProps) {
  return (
    <div className="space-y-3">

      {/* Client Details */}
      <section className={sectionCls}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className={sectionTitleCls}>Client Details</h3>
          <Button type="button" variant="ghost" size="sm"
            className="h-7 gap-1.5 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            onClick={onReset}
          >
            <IconRotateClockwise2 size={13} stroke={2} /> Reset
          </Button>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <label className={labelCls}>
            Name
            <input value={state.client.name}
              onChange={(e) => onUpdateClient("name", e.target.value)}
              className={inputCls} placeholder="Client name" />
          </label>
          <label className={labelCls}>
            Company
            <input value={state.client.companyName}
              onChange={(e) => onUpdateClient("companyName", e.target.value)}
              className={inputCls} placeholder="Company name" />
          </label>
          <label className={`${labelCls} sm:col-span-2`}>
            Email
            <input type="email" value={state.client.email}
              onChange={(e) => onUpdateClient("email", e.target.value)}
              className={inputCls} placeholder="name@company.com" />
          </label>
          <label className={`${labelCls} sm:col-span-2`}>
            Address
            <textarea rows={2} value={state.client.address}
              onChange={(e) => onUpdateClient("address", e.target.value)}
              className={`${inputCls} resize-none`} placeholder="Client address" />
          </label>
        </div>
      </section>

      {/* Invoice Metadata */}
      <section className={sectionCls}>
        <h3 className={sectionTitleCls}>Invoice Details</h3>
        <div className="grid gap-2.5 sm:grid-cols-3">
          <label className={`${labelCls} sm:col-span-3`}>
            Invoice Number
            <input value={state.meta.invoiceNumber}
              onChange={(e) => onUpdateMeta("invoiceNumber", e.target.value)}
              className={inputCls} />
          </label>
          <label className={labelCls}>
            Issue Date
            <input type="date" value={state.meta.issueDate}
              onChange={(e) => onUpdateMeta("issueDate", e.target.value)}
              className={inputCls} />
          </label>
          <label className={`${labelCls} sm:col-span-2`}>
            Due Date
            <input type="date" value={state.meta.dueDate}
              onChange={(e) => onUpdateMeta("dueDate", e.target.value)}
              className={inputCls} />
          </label>
        </div>
      </section>

      {/* Line Items */}
      <InvoiceTable
        items={state.items}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
        onUpdateItem={onUpdateItem}
      />

      {/* Pricing */}
      <section className={sectionCls}>
        <h3 className={sectionTitleCls}>Pricing</h3>
        <div className="space-y-2.5">
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition hover:bg-slate-100">
            <span className="text-sm font-medium text-slate-700">Enable Tax</span>
            <input type="checkbox" checked={state.summary.taxEnabled}
              onChange={(e) => onUpdateSummary("taxEnabled", e.target.checked)}
              className="size-4 accent-violet-600" />
          </label>
          {state.summary.taxEnabled ? (
            <label className={labelCls}>
              Tax Rate (%)
              <input type="number" min={0} value={state.summary.taxRate}
                onChange={(e) => onUpdateSummary("taxRate", Number(e.target.value) || 0)}
                className={inputCls} />
            </label>
          ) : null}
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition hover:bg-slate-100">
            <span className="text-sm font-medium text-slate-700">Enable Discount</span>
            <input type="checkbox" checked={state.summary.discountEnabled}
              onChange={(e) => onUpdateSummary("discountEnabled", e.target.checked)}
              className="size-4 accent-violet-600" />
          </label>
          {state.summary.discountEnabled ? (
            <label className={labelCls}>
              Discount Amount
              <input type="number" min={0} value={state.summary.discountAmount}
                onChange={(e) => onUpdateSummary("discountAmount", Number(e.target.value) || 0)}
                className={inputCls} />
            </label>
          ) : null}
        </div>
      </section>

      {/* Notes */}
      <NotesSection
        notes={state.notes.notes}
        paymentTerms={state.notes.paymentTerms}
        onChangeNotes={(value) => onUpdateNotes("notes", value)}
        onChangePaymentTerms={(value) => onUpdateNotes("paymentTerms", value)}
      />

      {/* Bank Account */}
      <section className={sectionCls}>
        <h3 className={sectionTitleCls}>Bank Account</h3>
        <div className="space-y-2">
          {BANK_ACCOUNTS.map((bank, index) => (
            <label key={index}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition hover:bg-slate-100 has-[:checked]:border-violet-400 has-[:checked]:bg-violet-50"
            >
              <input type="radio" name="selectedBank"
                checked={state.selectedBank === index}
                onChange={() => onUpdateBank(index)}
                className="accent-violet-600" />
              <span className="text-sm font-medium text-slate-800">{bank.bankName}</span>
              {bank.accountNumber ? (
                <span className="ml-auto text-xs text-slate-400">{bank.accountNumber}</span>
              ) : null}
            </label>
          ))}
        </div>
      </section>

    </div>
  )
}
