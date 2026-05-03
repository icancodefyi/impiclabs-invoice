import { NextResponse } from "next/server"

import { createTransaction, listTransactions } from "@/lib/finance-db"
import type { TransactionType } from "@/lib/finance-types"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const data = await listTransactions({
    type: searchParams.get("type") ?? undefined,
    bank: searchParams.get("bank") ?? undefined,
    month: searchParams.get("month") ?? undefined,
  })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { type, amount, category, description, bank, date } = body

  if (!type || !amount || !category || !bank || !date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const id = await createTransaction({
    type: type as TransactionType,
    amount: Number(amount),
    category,
    description: description ?? "",
    bank,
    date,
  })

  return NextResponse.json({ id }, { status: 201 })
}
