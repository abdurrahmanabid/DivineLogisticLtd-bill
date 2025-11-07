import { useMemo, useState } from "react";
import { Copy, FileDown, Info, MapPin } from "lucide-react";
import AdjustmentsEditor from "./AdjustmentsEditor";
import ChargesTable from "./ChargesTable";
import generatePdf from "./PdfGenerator";

const defaultCharges = [
  { id: 1, sl: "01", details: "Documentation Charge", amount: 100.0 },
  { id: 2, sl: "02", details: "B/L verify", amount: 230.0 },
  { id: 3, sl: "03", details: "Association Fee (50+100)", amount: 150.0 },
  { id: 4, sl: "04", details: "D/O Charge", amount: 6325.0 },
  { id: 5, sl: "05", details: "Port Bill (106+1976)", amount: 2082.0 },
];

function toNumber(value) {
  if (value === "" || value === null || value === undefined) return 0;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? 0 : numeric;
}

export default function InvoiceForm() {
  const [billNo, setBillNo] = useState("DLL/03/2025");
  const [date, setDate] = useState("2025-08-08");
  const [toName, setToName] = useState("TRUE TRADE INTERNATIONAL LTD.");
  const [address, setAddress] = useState(
    "House 88, Janata Housing Sha Alibag; Mirpur PS; Dhaka-1216, Bangladesh"
  );
  const [containerInfo, setContainerInfo] = useState(
    "1 x 40' LCL Stc: 5 Pallets of HOT STAMPING FOILS FOR TEXTILE release from Chattogram Port"
  );
  const [beNo, setBeNo] = useState("1830795");
  const [blNo, setBlNo] = useState("KACHT25093009");
  const [beDate, setBeDate] = useState("20-09-2025");
  const [assessableValue, setAssessableValue] = useState("418,168.17");
  const [charges, setCharges] = useState(defaultCharges);
  const [adjustments, setAdjustments] = useState([
    {
      id: 1,
      type: "addition",
      label: "Unstuffing/Examination + High Star + Labor Purpose",
      amount: 6000,
    },
    {
      id: 2,
      type: "addition",
      label: "Misc. expenses, noting assessment, labor, high-star and delivery",
      amount: 25000,
    },
    {
      id: 3,
      type: "addition",
      label: "Commission",
      amount: 7500,
    },
    { id: 4, type: "deduction", label: "Advance", amount: 40000 },
    { id: 5, type: "deduction", label: "Reduce", amount: 1000 },
  ]);

  const subtotal = useMemo(
    () => charges.reduce((sum, charge) => sum + toNumber(charge.amount), 0),
    [charges]
  );
  const additionRows = useMemo(
    () => adjustments.filter((row) => row.type === "addition"),
    [adjustments]
  );
  const deductionRows = useMemo(
    () => adjustments.filter((row) => row.type === "deduction"),
    [adjustments]
  );

  const additionsTotal = useMemo(
    () => additionRows.reduce((sum, row) => sum + toNumber(row.amount), 0),
    [additionRows]
  );
  const gTotal = useMemo(
    () => subtotal + additionsTotal,
    [subtotal, additionsTotal]
  );
  const balance = useMemo(() => {
    if (deductionRows.length === 0) return gTotal;
    return gTotal - toNumber(deductionRows[0].amount);
  }, [gTotal, deductionRows]);
  const dues = useMemo(() => {
    if (deductionRows.length === 0) return gTotal;
    if (deductionRows.length === 1) return balance;
    return deductionRows
      .slice(1)
      .reduce((acc, row) => acc - toNumber(row.amount), balance);
  }, [balance, deductionRows, gTotal]);

  function updateCharge(id, field, value) {
    setCharges((previous) =>
      previous.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: field === "amount" ? Number(value) : value,
            }
          : row
      )
    );
  }

  function addRow() {
    const nextId = Math.max(0, ...charges.map((row) => row.id)) + 1;
    setCharges((previous) => [
      ...previous,
      {
        id: nextId,
        sl: String(nextId).padStart(2, "0"),
        details: "New Item",
        amount: 0,
      },
    ]);
  }

  function removeRow(id) {
    setCharges((previous) => previous.filter((row) => row.id !== id));
  }

  function updateAdjustment(id, field, value) {
    setAdjustments((previous) =>
      previous.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]:
                field === "amount"
                  ? Number(value)
                  : field === "type"
                  ? value === "deduction"
                    ? "deduction"
                    : "addition"
                  : value,
            }
          : row
      )
    );
  }

  function addAdjustmentRow(kind) {
    const nextId = Math.max(0, ...adjustments.map((row) => row.id)) + 1;
    setAdjustments((previous) => [
      ...previous,
      {
        id: nextId,
        type: kind,
        label: kind === "addition" ? "New addition" : "New deduction",
        amount: 0,
      },
    ]);
  }

  function removeAdjustmentRow(id) {
    setAdjustments((previous) => previous.filter((row) => row.id !== id));
  }

  function onGeneratePdf() {
    generatePdf({
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
      adjustments,
      subtotal,
      gTotal,
      balance,
      dues,
    });
  }

  const labelClass =
    "text-xs font-semibold uppercase tracking-wide text-slate-500";
  const inputClass =
    "block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";
  const textareaClass = `${inputClass} min-h-[100px] resize-y`;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-6">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Invoice Details
            </h2>
            <p className="text-sm text-slate-500">
              Basic information that appears in the header of the PDF.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Bill No</label>
            <input
              className={inputClass}
              value={billNo}
              onChange={(event) => setBillNo(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Date</label>
            <input
              type="date"
              className={inputClass}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className={labelClass}>To (Name)</label>
            <input
              className={inputClass}
              value={toName}
              onChange={(event) => setToName(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className={`${labelClass} inline-flex items-center gap-2`}>
              <MapPin size={14} className="text-slate-400" /> Address
            </label>
            <textarea
              className={textareaClass}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-6">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Shipment &amp; References
            </h2>
            <p className="text-sm text-slate-500">
              Highlighted notice and supporting numbers for the shipment.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className={`${labelClass} inline-flex items-center gap-2`}>
              <Info size={14} className="text-slate-400" /> Highlighted info
              (container / goods)
            </label>
            <textarea
              className={`${textareaClass} min-h-[120px]`}
              value={containerInfo}
              onChange={(event) => setContainerInfo(event.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1">
              <label className={labelClass}>B/E No</label>
              <input
                className={inputClass}
                value={beNo}
                onChange={(event) => setBeNo(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>B/L No</label>
              <input
                className={inputClass}
                value={blNo}
                onChange={(event) => setBlNo(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>B/E Date</label>
              <input
                className={inputClass}
                value={beDate}
                onChange={(event) => setBeDate(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Assessable Value</label>
              <input
                className={inputClass}
                value={assessableValue}
                onChange={(event) => setAssessableValue(event.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <ChargesTable
        charges={charges}
        onUpdate={updateCharge}
        onAdd={addRow}
        onRemove={removeRow}
      />

      <AdjustmentsEditor
        title="Adjustments"
        rows={adjustments}
        onAddAddition={() => addAdjustmentRow("addition")}
        onAddDeduction={() => addAdjustmentRow("deduction")}
        onUpdate={updateAdjustment}
        onRemove={removeAdjustmentRow}
      />

      <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-6">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Payment Summary
            </h2>
            <p className="text-sm text-slate-500">
              Live totals update as you tweak charges and adjustments.
            </p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm text-slate-700 sm:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Subtotal
            </dt>
            <dd className="text-lg font-semibold text-slate-900">
              {subtotal.toFixed(2)}
            </dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              G. Total
            </dt>
            <dd className="text-lg font-semibold text-slate-900">
              {gTotal.toFixed(2)}
            </dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Balance
            </dt>
            <dd className="text-lg font-semibold text-slate-900">
              {balance.toFixed(2)}
            </dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Dues
            </dt>
            <dd className="text-lg font-semibold text-slate-900">
              {dues.toFixed(2)}
            </dd>
          </div>
        </dl>
      </section>

      <div className="flex flex-col gap-3 sm:static sm:flex-row sm:justify-end">
        <button
          onClick={onGeneratePdf}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 sm:w-auto"
        >
          <FileDown size={18} />
          <span className="hidden sm:inline">Generate PDF</span>
          <span className="sm:hidden">Download</span>
        </button>
      </div>
    </div>
  );
}
