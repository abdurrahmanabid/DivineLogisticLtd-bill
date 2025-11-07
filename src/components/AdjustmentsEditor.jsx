import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";

const fieldClass =
  "block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

export default function AdjustmentsEditor({
  title,
  rows,
  onAddAddition,
  onAddDeduction,
  onUpdate,
  onRemove,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">
            Track additions and deductions that influence the payment summary.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onAddAddition}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Add Addition</span>
            <span className="sm:hidden">Addition</span>
          </button>
          <button
            type="button"
            onClick={onAddDeduction}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
          >
            <MinusCircle size={16} />
            <span className="hidden sm:inline">Add Deduction</span>
            <span className="sm:hidden">Deduction</span>
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center text-sm text-slate-500">
          No adjustments added yet.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-[minmax(0,160px)_1fr_minmax(0,160px)_auto]"
            >
              <select
                className={`${fieldClass} appearance-none pr-8`}
                value={row.type}
                onChange={(event) =>
                  onUpdate(row.id, "type", event.target.value)
                }
              >
                <option value="addition">Addition</option>
                <option value="deduction">Deduction</option>
              </select>
              <input
                className={fieldClass}
                value={row.label}
                onChange={(event) =>
                  onUpdate(row.id, "label", event.target.value)
                }
                placeholder="Description"
              />
              <input
                className={`${fieldClass} text-right`}
                type="number"
                value={row.amount}
                onChange={(event) =>
                  onUpdate(row.id, "amount", event.target.value)
                }
              />
              <button
                type="button"
                onClick={() => onRemove(row.id)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Remove</span>
                <span className="sm:hidden">Del</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
