"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    const authed = sessionStorage.getItem("finance_auth") === "1"
    if (!authed && pathname !== "/finance/login") {
      router.replace("/finance/login")
    } else {
      setReady(true)
    }
  }, [pathname, router])

  if (!ready) return null
  return <>{children}</>
}
