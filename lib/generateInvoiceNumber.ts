export function generateInvoiceNumber(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const random = Math.floor(1000 + Math.random() * 9000)

  return `IMP-${year}${month}-${random}`
}
