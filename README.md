# Invoice PDF Maker

A mobile-first invoice builder built with React, Vite, Tailwind CSS, `pdfmake`, and `lucide-react`. The app lets you collect invoice details, manage line items and adjustments, and export a **text-selectable** PDF that mirrors the on-screen totals.

## Highlights

- Mobile-first layout with sticky actions, compact inputs, and icon-only buttons on small screens.
- Editable header, shipment summary, charges table, and adjustment ledger with instant recalculation of subtotal, grand total, balance, and dues.
- Dynamic row management: add, edit, or remove charges and adjustments without leaving the page.
- PDF generation via `pdfmake` keeps text selectable, formats the notice paragraph as a single justified block, and collapses the address into a tidy two-line layout.
- Modern visual design powered by Tailwind 4, with Lucide icons for quick access on touch devices.

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite dev server
npm run dev

# 3. (Optional) Create a production build
npm run build
```

By default the app is served at [`http://localhost:5173`](http://localhost:5173). The main UI is available at the route `/true-trade-international`.

## Using the App

1. **Invoice Details** – Enter the bill number, date, client name, and address. The address automatically splits into two lines inside the PDF.
2. **Shipment & References** – Describe the highlighted shipment info and reference numbers (B/E, B/L, assessable value).
3. **Charges Table** – Tap the **Add** button to append a new row, edit details inline, or use the delete icon to remove a charge.
4. **Adjustments** – Track additions or deductions (e.g., advance, reduce) and they will be reflected in the totals instantly.
5. **Payment Summary** – Review the live totals cards for subtotal, grand total, balance, and dues.
6. **Download** – Hit the blue button (icon-only on mobile) to generate and download the finalized PDF.

## Responsive UX Notes

- Primary actions collapse to icon buttons on smaller screens while keeping descriptive text on desktop.
- Section cards use rounded containers with readable spacing and labels that stay visible on small viewports.
- Action buttons remain reachable thanks to a bottom-aligned action group on mobile devices.

## PDF Output Details

- Text remains selectable/searchable because the document is rendered with `pdfmake` rather than a rasterized canvas.
- The shipment highlight line is rendered as a single justified paragraph, matching the source requirement.
- Addresses are broken on the last comma to avoid uneven wrapping.
- Charges, adjustments, and totals use evenly spaced tables for professional output ready for client sharing.

## Project Structure

```
├── public/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── components/
│       ├── InvoiceForm.jsx
│       ├── ChargesTable.jsx
│       ├── AdjustmentsEditor.jsx
│       └── PdfGenerator.jsx
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Tech Stack

- **React 19** with functional components and hooks.
- **Vite 7** for lightning-fast development and builds.
- **Tailwind CSS 4** for utility-first styling.
- **pdfmake** for text-based PDF exports.
- **lucide-react** for accessible iconography.

## Troubleshooting

- If fonts appear incorrect or icons are missing, run `npm install` to ensure dependencies (especially `lucide-react`) are installed.
- When the PDF download stalls or opens a blank page, reload the app to refresh the pdfmake runtime.
- Numeric fields accept only digits; invalid entries will fall back to zero for calculations.

---

This project is provided without a formal license. Adapt and deploy according to your organizational requirements.
