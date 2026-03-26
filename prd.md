# 🧾 Impic Invoice Studio — PRD

## 1. 🎯 Objective

Build an internal tool for Impic Labs to:

- Generate clean, branded invoices
- Maintain consistent design language
- Enable live editing with real-time preview
- Export A4-ready PDFs
- Eliminate manual formatting work

---

## 2. 👤 Target User

- Internal team at Impic Labs
- Primary: Founder / Ops (Zaid)
- Future: Admin / Accounts

---

## 3. 🧩 Core Features

### 3.1 Invoice Builder (Left Panel)

#### Client Details

- Name
- Company Name
- Email
- Address

#### Invoice Metadata

- Invoice Number (auto/manual)
- Issue Date
- Due Date

#### Line Items

- Item Name
- Description (optional)
- Quantity
- Price
- Auto-calculated total per row

#### Pricing Summary

- Subtotal
- Tax (optional toggle with %)
- Discount (optional)
- Final Total (auto-calculated)

#### Extra Notes

- Free text field
- Payment terms / Thank you message

---

### 3.2 Brand System (Pre-configured)

- Logo auto-injected
- Brand colors auto-applied
- Typography consistent
- No manual styling required

---

### 3.3 Live Preview (Right Panel)

- Real-time invoice rendering
- A4 aspect ratio simulation
- Pixel-perfect preview

---

### 3.4 Payment Section

- Pre-filled bank details
- UPI ID display
- QR code for payment

---

### 3.5 Export System

- Export to PDF (A4 format)
- Print-ready layout
- Consistent margins

---

## 4. 🎨 Design Requirements

- Minimal and premium UI (Stripe / Notion inspired)
- Clean typography
- Soft borders
- High whitespace usage

#### Color Rules

- Primary brand color for highlights
- Neutral background (white / light grey)

---



---

## 7. 🧱 System Architecture

[Form Inputs] → [State Store] → [Live Preview Renderer]
↓
[PDF Export Engine]

---

## 8. 📄 Invoice Layout Structure

[LOGO] Impic Labs

Invoice #123
Date / Due Date

Bill To:
Client Name
Company

Item Qty Price Total

Web Dev 1 ₹50,000 ₹50,000

Subtotal
Tax
Total

Notes

Bank Details
UPI QR Code

---

# 📁 Repository Structure

## 1. 🖼️ Brand Assets

/public/assets/

Include:

- logo.png
- logo-dark.png (optional)
- favicon.ico

---

## 2. 💳 Payment Assets

/public/payments/

Include:

- upi-qr.png ✅ (required)
- bank-logo.png (optional)

---

## 3. ⚙️ Configuration File

/config/company.ts

```ts
export const COMPANY_DETAILS = {
  name: "Impic Labs",
  email: "hello@impiclabs.com",
  website: "impiclabs.com",
  address: "Mumbai, India",
};

export const BANK_DETAILS = {
  accountName: "Impic Labs",
  accountNumber: "XXXXXX",
  ifsc: "XXXXXX",
  bankName: "XXXXXX",
  upiId: "yourupi@bank",
};

export const BRAND = {
  primaryColor: "#000000",
  accentColor: "#6C5CE7",
};
4. 🧾 Components
/components/invoice/
  InvoiceForm.tsx
  InvoicePreview.tsx
  InvoiceTable.tsx
  PaymentSection.tsx
  NotesSection.tsx
5. 📦 Utilities
/lib/
  calculateTotals.ts
  generateInvoiceNumber.ts
  formatCurrency.ts
6. 📄 PDF Export Module
/lib/exportPdf.ts

Responsibilities:

A4 scaling
Margin control
Export logic
7. 🧠 State Management
/store/invoiceStore.ts

Handles:

Form state
Line items
Live updates
⚡ MVP Scope

Build ONLY:

Add/edit items with pricing
Auto total calculations
Live preview panel
Branding (logo + colors)
Payment section (QR + bank details)
Export to A4 PDF
🚀 Future Expansion
Proposal generator
Contract generator
Client dashboard
Payment tracking
GST-compliant invoices
Multi-document system
💡 Vision

This is not just an invoice tool.

Impic Invoice Studio → becomes → Impic Document Engine

Future capabilities:

Proposals
Reports
Forensic documents (Sniffer integration)
Legal-ready PDFs
```
