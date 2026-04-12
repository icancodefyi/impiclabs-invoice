import type { InvoiceItem, InvoiceSummary, Totals } from "@/lib/invoice-types"

function normalizeNumber(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return 0
  }

  return value
}

export function calculateItemTotal(item: InvoiceItem) {
  const quantity = normalizeNumber(item.quantity)
  const price = normalizeNumber(item.price)
  return quantity * price
}

export function calculateTotals(items: InvoiceItem[], summary: InvoiceSummary): Totals {
  const subtotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0)
  const safeSubtotal = normalizeNumber(subtotal)

  const taxRate = summary.taxEnabled ? normalizeNumber(summary.taxRate) : 0
  const taxAmount = (safeSubtotal * taxRate) / 100

  const discountAmount = summary.discountEnabled
    ? Math.min(normalizeNumber(summary.discountAmount), safeSubtotal + taxAmount)
    : 0

  const finalTotal = Math.max(safeSubtotal + taxAmount - discountAmount, 0)

  return {
    subtotal: safeSubtotal,
    taxAmount,
    discountAmount,
    finalTotal,
  }
}
