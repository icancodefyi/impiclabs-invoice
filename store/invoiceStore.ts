"use client"

import * as React from "react"

import { generateInvoiceNumber } from "@/lib/generateInvoiceNumber"
import type { InvoiceItem, InvoiceState } from "@/lib/invoice-types"

const today = new Date()
const dueDate = new Date(today)
dueDate.setDate(today.getDate() + 14)

function toDateInputValue(date: Date) {
  return date.toISOString().split("T")[0]
}

function createEmptyItem(): InvoiceItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    quantity: 1,
    price: 0,
  }
}

function getInitialState(): InvoiceState {
  return {
    client: {
      name: "",
      companyName: "",
      email: "",
      address: "",
    },
    meta: {
      invoiceNumber: generateInvoiceNumber(),
      issueDate: toDateInputValue(today),
      dueDate: toDateInputValue(dueDate),
    },
    items: [createEmptyItem()],
    summary: {
      taxEnabled: true,
      taxRate: 18,
      discountEnabled: false,
      discountAmount: 0,
    },
    notes: {
      notes: "Thank you for trusting Impic Labs. We appreciate your business.",
      paymentTerms: "Payment due within 14 days from issue date.",
    },
  }
}

export function useInvoiceStore() {
  const [state, setState] = React.useState<InvoiceState>(getInitialState)

  const resetState = React.useCallback(() => {
    setState(getInitialState())
  }, [])

  const updateClient = React.useCallback((field: keyof InvoiceState["client"], value: string) => {
    setState((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        [field]: value,
      },
    }))
  }, [])

  const updateMeta = React.useCallback((field: keyof InvoiceState["meta"], value: string) => {
    setState((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        [field]: value,
      },
    }))
  }, [])

  const updateSummary = React.useCallback(
    (field: keyof InvoiceState["summary"], value: number | boolean) => {
      setState((prev) => ({
        ...prev,
        summary: {
          ...prev.summary,
          [field]: value,
        },
      }))
    },
    []
  )

  const updateNotes = React.useCallback((field: keyof InvoiceState["notes"], value: string) => {
    setState((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [field]: value,
      },
    }))
  }, [])

  const addItem = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      items: [...prev.items, createEmptyItem()],
    }))
  }, [])

  const removeItem = React.useCallback((id: string) => {
    setState((prev) => {
      if (prev.items.length === 1) {
        return prev
      }

      return {
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      }
    })
  }, [])

  const updateItem = React.useCallback(
    (id: string, field: keyof Omit<InvoiceItem, "id">, value: string | number) => {
      setState((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === id
            ? {
                ...item,
                [field]: value,
              }
            : item
        ),
      }))
    },
    []
  )

  return {
    state,
    resetState,
    updateClient,
    updateMeta,
    updateSummary,
    updateNotes,
    addItem,
    removeItem,
    updateItem,
  }
}
