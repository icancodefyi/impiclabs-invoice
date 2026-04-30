import Image from "next/image"

import type { BankAccount } from "@/config/company"

type PaymentSectionProps = {
  compact?: boolean
  bank: BankAccount
}

export function PaymentSection({ compact = false, bank }: PaymentSectionProps) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <Image
          src={bank.logo}
          alt="Bank logo"
          width={30}
          height={30}
          className="rounded-sm"
        />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">Payment</p>
          <p className="text-[14px] font-semibold text-black">Bank Transfer / UPI</p>
        </div>
      </div>

      <div className={`grid items-start gap-7 ${compact ? "grid-cols-2" : "grid-cols-[1.1fr_1fr]"}`}>
        <div className="grid gap-4">
          <p className="text-[12px] text-black/70">
            <span className="mr-2 font-semibold uppercase tracking-[0.12em] text-black/35">Account</span>
            {bank.accountName}
          </p>
          <p className="text-[12px] text-black/70">
            <span className="mr-2 font-semibold uppercase tracking-[0.12em] text-black/35">A/C No</span>
            {bank.accountNumber}
          </p>
          <p className="text-[12px] text-black/70">
            <span className="mr-2 font-semibold uppercase tracking-[0.12em] text-black/35">IFSC</span>
            {bank.ifsc}
          </p>
          <p className="text-[12px] text-black/70">
            <span className="mr-2 font-semibold uppercase tracking-[0.12em] text-black/35">Bank</span>
            {bank.bankName}
          </p>
          {bank.upiId ? (
            <p className="text-[12px] text-black/70">
              <span className="mr-2 font-semibold uppercase tracking-[0.12em] text-black/35">UPI ID</span>
              {bank.upiId}
            </p>
          ) : null}
        </div>

        <div className="justify-self-end pt-1 text-center">
          <Image
            src={bank.qr}
            alt="UPI QR code"
            width={compact ? 122 : 166}
            height={compact ? 122 : 166}
            className="bg-white"
          />
          <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-black/60">
            Scan to Pay
          </p>
        </div>
      </div>
    </div>
  )
}
