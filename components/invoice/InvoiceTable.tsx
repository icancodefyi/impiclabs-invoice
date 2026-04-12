"use client"

import { IconTrash } from "@tabler/icons-react"

import { calculateItemTotal } from "@/lib/calculateTotals"
import { formatCurrency } from "@/lib/formatCurrency"
import type { InvoiceItem } from "@/lib/invoice-types"
import { Button } from "@/components/ui/button"

type InvoiceTableProps = {
  items: InvoiceItem[]
  onAddItem: () => void
  onRemoveItem: (id: string) => void
  onUpdateItem: (id: string, field: keyof Omit<InvoiceItem, "id">, value: string | number) => void
}

export function InvoiceTable({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: InvoiceTableProps) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight text-black">Line Items</h3>
        <Button
          type="button"
          className="bg-black text-white hover:bg-black/85"
          size="sm"
          onClick={onAddItem}
        >
          Add Item
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-xl border border-black/10 bg-zinc-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-black/70">Item {index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-black/70 hover:bg-black/10"
                onClick={() => onRemoveItem(item.id)}
                aria-label={`Remove item ${index + 1}`}
              >
                <IconTrash className="size-4" />
              </Button>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <label className="space-y-1 text-xs font-medium text-black/70">
                Item Name
                <input
                  value={item.name}
                  onChange={(event) => onUpdateItem(item.id, "name", event.target.value)}
                  className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-base text-black outline-none ring-0 focus:border-[#6C5CE7] sm:text-sm"
                  placeholder="Web Development"
                />
              </label>

              <label className="space-y-1 text-xs font-medium text-black/70">
                Description
                <input
                  value={item.description}
                  onChange={(event) => onUpdateItem(item.id, "description", event.target.value)}
                  className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-base text-black outline-none ring-0 focus:border-[#6C5CE7] sm:text-sm"
                  placeholder="Optional"
                />
              </label>

              <label className="space-y-1 text-xs font-medium text-black/70">
                Quantity
                <input
                  type="number"
                  min={0}
                  value={item.quantity}
                  onChange={(event) =>
                    onUpdateItem(item.id, "quantity", Number(event.target.value) || 0)
                  }
                  className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-base text-black outline-none ring-0 focus:border-[#6C5CE7] sm:text-sm"
                />
              </label>

              <label className="space-y-1 text-xs font-medium text-black/70">
                Price
                <input
                  type="number"
                  min={0}
                  value={item.price}
                  onChange={(event) =>
                    onUpdateItem(item.id, "price", Number(event.target.value) || 0)
                  }
                  className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-base text-black outline-none ring-0 focus:border-[#6C5CE7] sm:text-sm"
                />
              </label>
            </div>

            <p className="mt-2 text-right text-xs font-semibold text-black">
              Row Total: {formatCurrency(calculateItemTotal(item))}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
