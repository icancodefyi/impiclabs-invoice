import { ObjectId } from "mongodb"

import { getDb } from "@/lib/mongodb"
import type { Transaction, TransactionType } from "@/lib/finance-types"

const COLL = "finance_transactions"

function toTransaction(doc: Record<string, unknown>): Transaction {
  return {
    _id: (doc._id as ObjectId).toHexString(),
    type: doc.type as TransactionType,
    amount: doc.amount as number,
    category: doc.category as string,
    description: doc.description as string,
    bank: doc.bank as string,
    date: doc.date as string,
    createdAt: (doc.createdAt as Date).toISOString(),
  }
}

export async function listTransactions(filters: {
  type?: string
  bank?: string
  month?: string // "YYYY-MM"
}) {
  const db = await getDb()
  const query: Record<string, unknown> = {}
  if (filters.type === "income" || filters.type === "expense") query.type = filters.type
  if (filters.bank) query.bank = filters.bank
  if (filters.month) {
    query.date = { $regex: `^${filters.month}` }
  }
  const rows = await db.collection(COLL).find(query).sort({ date: -1, createdAt: -1 }).toArray()
  return rows.map((r) => toTransaction(r as Record<string, unknown>))
}

export async function createTransaction(input: {
  type: TransactionType
  amount: number
  category: string
  description: string
  bank: string
  date: string
}) {
  const db = await getDb()
  const result = await db.collection(COLL).insertOne({
    ...input,
    amount: Number(input.amount),
    createdAt: new Date(),
  })
  return result.insertedId.toHexString()
}

export async function deleteTransaction(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const db = await getDb()
  const result = await db.collection(COLL).deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

export async function getMonthSummary(month: string) {
  const db = await getDb()
  const rows = await db
    .collection(COLL)
    .find({ date: { $regex: `^${month}` } })
    .toArray()

  let revenue = 0
  let expenses = 0
  const byCategory: Record<string, number> = {}

  for (const r of rows) {
    const amount = r.amount as number
    if (r.type === "income") revenue += amount
    else expenses += amount
    byCategory[r.category as string] = (byCategory[r.category as string] ?? 0) + amount
  }

  return { revenue, expenses, profit: revenue - expenses, byCategory }
}
