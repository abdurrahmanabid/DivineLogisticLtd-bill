// Project: invoice-pdf-text-selectable
// Vite + React + Tailwind + pdfmake

// README.md

# Invoice PDF Generator (Text-selectable)

This is a Vite + React project that uses Tailwind CSS for styling and `pdfmake` to generate **text-selectable** PDFs (not images). It provides an editable invoice form with a dynamic charges table (add/remove rows) and a "Generate PDF" button.

## Features

- Tailwind-styled editable invoice form
- Default values based on the sample image
- Dynamic table: add / remove / edit rows
- Auto totals (subtotal, grand total, balance, dues)
- Generates text-based PDF using `pdfmake` (selectable text)

## Quick start

1. Create project folder and copy files
2. Install dependencies:

```bash
npm install
```

3. Run dev server:

```bash
npm run dev
```

4. Open `http://localhost:5173`

---

// package.json
{
"name": "invoice-pdf-text-selectable",
"version": "0.0.1",
"private": true,
"scripts": {
"dev": "vite",
"build": "vite build",
"preview": "vite preview"
},
"dependencies": {
"pdfmake": "^0.2.7",
"react": "^18.2.0",
"react-dom": "^18.2.0"
},
"devDependencies": {
"autoprefixer": "^10.4.14",
"postcss": "^8.4.21",
"tailwindcss": "^3.4.7",
"vite": "^5.0.0"
}
}

// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
plugins: [react()]
})

// index.html

<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice PDF Generator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

// tailwind.config.cjs
module.exports = {
content: ['./index.html', './src/**/*.{js,jsx}'],
theme: {
extend: {},
},
plugins: [],
}

// postcss.config.cjs
module.exports = {
plugins: {
tailwindcss: {},
autoprefixer: {},
},
}

// src/main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
<React.StrictMode>
<App />
</React.StrictMode>
)

// src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }

// src/App.jsx
import React from 'react'
import InvoiceForm from './components/InvoiceForm'

export default function App() {
return (
<div className="min-h-screen bg-gray-50 p-6">
<div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
<h1 className="text-2xl font-semibold mb-4">Invoice PDF Generator (pdfmake)</h1>
<InvoiceForm />
</div>
</div>
)
}

// src/components/InvoiceForm.jsx
import React, { useState, useMemo } from 'react'
import ChargesTable from './ChargesTable'
import generatePdf from './PdfGenerator'

const defaultCharges = [
{ id: 1, sl: '01', details: 'Documentation Charge', amount: 100.0 },
{ id: 2, sl: '02', details: 'B/L verify', amount: 230.0 },
{ id: 3, sl: '03', details: 'Association Fee (50+100)', amount: 150.0 },
{ id: 4, sl: '04', details: 'D/O Charge', amount: 6325.0 },
{ id: 5, sl: '05', details: 'Port Bill (106+1976)', amount: 2082.0 },
]

export default function InvoiceForm() {
const [billNo, setBillNo] = useState('DLL/03/2025')
const [date, setDate] = useState('2025-08-08')
const [toName, setToName] = useState('TRUE TRADE INTERNATIONAL LTD.')
const [address, setAddress] = useState('House 88, Janata Housing Sha Alibag; Mirpur PS; Dhaka-1216, Bangladesh')

const [containerInfo, setContainerInfo] = useState('1 x 40\' LCL Stc: 5 Pallets of HOT STAMPING FOILS FOR TEXTILE release from Chattogram Port')
const [beNo, setBeNo] = useState('1830795')
const [blNo, setBlNo] = useState('KACHT25093009')
const [beDate, setBeDate] = useState('20-09-2025')
const [assessableValue, setAssessableValue] = useState('418,168.17')

const [charges, setCharges] = useState(defaultCharges)
const [advance, setAdvance] = useState(40000)
const [commission, setCommission] = useState(7500)
const [miscExpenses, setMiscExpenses] = useState(25000)
const [unstuffing, setUnstuffing] = useState(6000)
const [reduce, setReduce] = useState(1000)

const subtotal = useMemo(() => charges.reduce((s, c) => s + (Number(c.amount) || 0), 0), [charges])
const gTotal = useMemo(() => subtotal + Number(unstuffing || 0) + Number(miscExpenses || 0) + Number(commission || 0), [subtotal, unstuffing, miscExpenses, commission])
const balance = useMemo(() => gTotal - Number(advance || 0), [gTotal, advance])
const dues = useMemo(() => balance - Number(reduce || 0), [balance, reduce])

function updateCharge(id, field, value) {
setCharges(prev => prev.map(r => r.id === id ? { ...r, [field]: field === 'amount' ? Number(value) : value } : r))
}

function addRow() {
const nextId = Math.max(0, ...charges.map(c => c.id)) + 1
setCharges(prev => [...prev, { id: nextId, sl: String(nextId).padStart(2, '0'), details: 'New Item', amount: 0 }])
}

function removeRow(id) {
setCharges(prev => prev.filter(r => r.id !== id))
}

function onGeneratePdf() {
const data = {
billNo,
date,
toName,
address,
containerInfo,
beNo,
blNo,
beDate,
assessableValue,
charges,
subtotal,
unstuffing,
miscExpenses,
commission,
gTotal,
advance,
balance,
reduce,
dues
}
generatePdf(data)
}

return (
<div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label className="block font-medium">Bill No</label>
<input className="w-full border rounded p-2" value={billNo} onChange={e => setBillNo(e.target.value)} />
</div>
<div>
<label className="block font-medium">Date</label>
<input type="date" className="w-full border rounded p-2" value={date} onChange={e => setDate(e.target.value)} />
</div>
<div className="md:col-span-2">
<label className="block font-medium">To (Name)</label>
<input className="w-full border rounded p-2" value={toName} onChange={e => setToName(e.target.value)} />
</div>
<div className="md:col-span-2">
<label className="block font-medium">Address</label>
<textarea className="w-full border rounded p-2" value={address} onChange={e => setAddress(e.target.value)} rows={3} />
</div>

        <div className="md:col-span-2">
          <label className="block font-medium">Highlighted info (container / goods)</label>
          <textarea className="w-full border rounded p-2" value={containerInfo} onChange={e => setContainerInfo(e.target.value)} rows={2} />
        </div>

        <div>
          <label className="block font-medium">B/E No</label>
          <input className="w-full border rounded p-2" value={beNo} onChange={e => setBeNo(e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">B/L No</label>
          <input className="w-full border rounded p-2" value={blNo} onChange={e => setBlNo(e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">B/E Date</label>
          <input className="w-full border rounded p-2" value={beDate} onChange={e => setBeDate(e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">Assessable Value</label>
          <input className="w-full border rounded p-2" value={assessableValue} onChange={e => setAssessableValue(e.target.value)} />
        </div>
      </div>

      <div className="mt-6">
        <ChargesTable charges={charges} onUpdate={updateCharge} onAdd={addRow} onRemove={removeRow} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Unstuffing / Examination + Labor</label>
          <input className="w-full border rounded p-2" value={unstuffing} onChange={e => setUnstuffing(Number(e.target.value))} />
        </div>
        <div>
          <label className="block font-medium">Misc. expenses</label>
          <input className="w-full border rounded p-2" value={miscExpenses} onChange={e => setMiscExpenses(Number(e.target.value))} />
        </div>
        <div>
          <label className="block font-medium">Commission</label>
          <input className="w-full border rounded p-2" value={commission} onChange={e => setCommission(Number(e.target.value))} />
        </div>
        <div>
          <label className="block font-medium">Advance</label>
          <input className="w-full border rounded p-2" value={advance} onChange={e => setAdvance(Number(e.target.value))} />
        </div>
        <div>
          <label className="block font-medium">Reduce</label>
          <input className="w-full border rounded p-2" value={reduce} onChange={e => setReduce(Number(e.target.value))} />
        </div>
      </div>

      <div className="mt-6 p-4 border rounded bg-gray-50">
        <div className="flex justify-between">
          <div>Subtotal:</div>
          <div>{subtotal.toFixed(2)}</div>
        </div>
        <div className="flex justify-between">
          <div>G. Total:</div>
          <div>{gTotal.toFixed(2)}</div>
        </div>
        <div className="flex justify-between">
          <div>Balance:</div>
          <div>{balance.toFixed(2)}</div>
        </div>
        <div className="flex justify-between">
          <div>Dues:</div>
          <div>{dues.toFixed(2)}</div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={onGeneratePdf} className="px-4 py-2 bg-blue-600 text-white rounded">Generate PDF</button>
        <button onClick={() => { navigator.clipboard.writeText(JSON.stringify({ billNo, date, toName, address, charges })) }} className="px-4 py-2 bg-gray-200 rounded">Copy JSON</button>
      </div>
    </div>

)
}

// src/components/ChargesTable.jsx
import React from 'react'

export default function ChargesTable({ charges, onUpdate, onAdd, onRemove }) {
return (
<div>
<div className="flex justify-between items-center mb-2">
<h2 className="text-lg font-medium">Charges</h2>
<div className="flex gap-2">
<button onClick={onAdd} className="px-3 py-1 bg-green-600 text-white rounded">Add Row</button>
</div>
</div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">SL.</th>
              <th className="border px-2 py-1">Details</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {charges.map(row => (
              <tr key={row.id}>
                <td className="border px-2 py-1">{row.sl}</td>
                <td className="border px-2 py-1">
                  <input className="w-full p-1" value={row.details} onChange={e => onUpdate(row.id, 'details', e.target.value)} />
                </td>
                <td className="border px-2 py-1">
                  <input className="w-full p-1" type="number" value={row.amount} onChange={e => onUpdate(row.id, 'amount', e.target.value)} />
                </td>
                <td className="border px-2 py-1">
                  <button onClick={() => onRemove(row.id)} className="px-2 py-1 bg-red-600 text-white rounded">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

)
}

// src/components/PdfGenerator.jsx
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.pdfMake.vfs

function money(v) {
if (v === undefined || v === null) return ''
if (typeof v === 'number') return v.toFixed(2)
return String(v)
}

export default function generatePdf(data) {
const { billNo, date, toName, address, containerInfo, beNo, blNo, beDate, assessableValue, charges, subtotal, unstuffing, miscExpenses, commission, gTotal, advance, balance, reduce, dues } = data

const tableBody = [
[ { text: 'SL.', bold: true }, { text: 'Details', bold: true }, { text: 'Amount', bold: true, alignment: 'right' } ]
]
charges.forEach((c, idx) => {
tableBody.push([ String(c.sl || idx+1), c.details || '', { text: money(Number(c.amount) || 0), alignment: 'right' } ])
})

tableBody.push([ { text: 'Total', colSpan: 2, alignment: 'right', bold: true }, {}, { text: money(subtotal), alignment: 'right', bold: true } ])

const docDefinition = {
pageSize: 'A4',
pageMargins: [40, 60, 40, 60],
content: [
{ text: 'BILL', style: 'header' },
{
columns: [
{ width: '\*', text: `To\n${toName}\n${address}`, margin: [0, 10, 0, 10] },
{ width: 'auto', text: `Bill NO. ${billNo}\nDate: ${date}`, alignment: 'right' }
]
},
{ text: '\n' },
{ text: `Being the amount charges against: ${containerInfo}` },
{ text: `B/E NO. ${beNo}  Dt. ${beDate}  B/L NO. ${blNo}`, margin: [0, 4, 0, 4] },
{ text: `Assessable Value TK. ${assessableValue}`, margin: [0, 2, 0, 6], bold: true },

      { text: '\n' },

      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto'],
          body: tableBody
        },
        layout: {
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex === 0) ? '#eeeeee' : null;
          }
        }
      },

      { text: '\n' },

      {
        columns: [
          { width: '*', text: '' },
          {
            width: 300,
            table: {
              widths: ['*', 'auto'],
              body: [
                [ 'Unstuffing/Examination + High Star + Labor Purpose', { text: money(unstuffing), alignment: 'right' } ],
                [ 'Misc. expenses, noting assessment, Labor, highster and delivery', { text: money(miscExpenses), alignment: 'right' } ],
                [ 'Commission', { text: money(commission), alignment: 'right' } ],
                [ { text: 'G. Total', bold: true }, { text: money(gTotal), alignment: 'right', bold: true } ],
                [ 'Advance', { text: money(advance), alignment: 'right' } ],
                [ 'Balance', { text: money(balance), alignment: 'right' } ],
                [ 'Reduce', { text: money(reduce), alignment: 'right' } ],
                [ { text: 'Dues', bold: true }, { text: money(dues), alignment: 'right', bold: true } ]
              ]
            }
          }
        ]
      },

      { text: '\n\nDivine Logistic Ltd.\n\nMd. Saiful Islam\nMob. 01719537893', margin: [0, 20, 0, 0] }

    ],
    styles: {
      header: { fontSize: 16, bold: true, alignment: 'center', margin: [0, 0, 0, 10] }
    },
    defaultStyle: {
      fontSize: 10
    }

}

pdfMake.createPdf(docDefinition).download(`invoice_${billNo || 'bill'}.pdf`)
}
