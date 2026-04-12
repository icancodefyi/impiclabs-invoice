"use client"

type NotesSectionProps = {
  notes: string
  paymentTerms: string
  onChangeNotes: (value: string) => void
  onChangePaymentTerms: (value: string) => void
}

export function NotesSection({
  notes,
  paymentTerms,
  onChangeNotes,
  onChangePaymentTerms,
}: NotesSectionProps) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold tracking-tight text-black">Extra Notes</h3>
      <div className="space-y-3">
        <label className="space-y-1 text-xs font-medium text-black/70">
          Notes
          <textarea
            value={notes}
            onChange={(event) => onChangeNotes(event.target.value)}
            rows={4}
            className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-base text-black outline-none ring-0 focus:border-[#6C5CE7] sm:text-sm"
            placeholder="Thank you message"
          />
        </label>

        <label className="space-y-1 text-xs font-medium text-black/70">
          Payment Terms
          <textarea
            value={paymentTerms}
            onChange={(event) => onChangePaymentTerms(event.target.value)}
            rows={3}
            className="w-full rounded-lg border border-black/15 bg-zinc-50 px-3 py-2 text-base text-black outline-none ring-0 focus:border-[#6C5CE7] sm:text-sm"
            placeholder="Payment due in 14 days"
          />
        </label>
      </div>
    </section>
  )
}
