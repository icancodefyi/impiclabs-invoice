export type ClientDetails = {
  name: string
  companyName: string
  email: string
  address: string
}

export type InvoiceMeta = {
  invoiceNumber: string
  issueDate: string
  dueDate: string
}

export type InvoiceItem = {
  id: string
  name: string
  description: string
  quantity: number
  price: number
}

export type InvoiceSummary = {
  taxEnabled: boolean
  taxRate: number
  discountEnabled: boolean
  discountAmount: number
}

export type InvoiceNotes = {
  notes: string
  paymentTerms: string
}

export type InvoiceState = {
  client: ClientDetails
  meta: InvoiceMeta
  items: InvoiceItem[]
  summary: InvoiceSummary
  notes: InvoiceNotes
  selectedBank: number
}

export type Totals = {
  subtotal: number
  taxAmount: number
  discountAmount: number
  finalTotal: number
}
