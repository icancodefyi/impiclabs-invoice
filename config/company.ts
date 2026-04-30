export const COMPANY_DETAILS = {
  name: "Impic Labs",
  email: "hello@impiclabs.com",
  website: "impiclabs.com",
  address: "Navi Mumbai, India",
}

export type BankAccount = {
  accountName: string
  accountNumber: string
  ifsc: string
  bankName: string
  upiId: string
  logo: string
  qr: string
}

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    accountName: "Impic Labs",
    accountNumber: "61130201000865",
    ifsc: "UBIN0561134",
    bankName: "Union Bank of India",
    upiId: "",
    logo: "/payments/bank-logo.png",
    qr: "/payments/upi-qr.png",
  },
  {
    accountName: "Zaid Rakhange",
    accountNumber: "60127478056",
    ifsc: "MAHB00001618",
    bankName: "Bank of Maharashtra",
    upiId: "rakhangezaid8@pingpay",
    logo: "/payments/bomlogo.png",
    qr: "/payments/bomqr.png",
  },
]

export const BRAND = {
  baseBlack: "#0A0A0A",
  baseWhite: "#FFFFFF",
  neutral: "#F3F4F6",
  accentColor: "#6C5CE7",
}
