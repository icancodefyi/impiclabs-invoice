export type TransactionType = "income" | "expense"

export type Transaction = {
  _id: string
  type: TransactionType
  amount: number
  category: string
  description: string
  bank: string
  date: string
  createdAt: string
}

export const INCOME_CATEGORIES = [
  "Consulting",
  "Retainer",
  "Project",
  "SaaS Revenue",
  "Freelance",
  "Other Income",
] as const

export const EXPENSE_CATEGORIES = [
  "Tools & Software",
  "Server & Hosting",
  "Taxes",
  "Freelancer",
  "Marketing",
  "Office",
  "Subscriptions",
  "Other Expense",
] as const

export const BANKS = ["Union Bank of India", "Bank of Maharashtra", "Cash"] as const
