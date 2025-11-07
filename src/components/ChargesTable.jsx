import { Plus, Trash2 } from "lucide-react";

const inputClass =
  "block w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

export default function ChargesTable({ charges, onUpdate, onAdd, onRemove }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Charges</h2>
          <p className="text-sm text-slate-500">
            Update service lines, add extras or remove unused entries.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Row</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-[640px] divide-y divide-slate-200 text-sm text-slate-700">
            <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">SL.</th>
                <th className="px-3 py-2 text-left">Details</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {charges.map((row) => (
                <tr key={row.id}>
                  <td className="px-3 py-2 font-medium text-slate-600">
                    {row.sl}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className={inputClass}
                      value={row.details}
                      onChange={(event) =>
                        onUpdate(row.id, "details", event.target.value)
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className={`${inputClass} text-right`}
                      type="number"
                      value={row.amount}
                      onChange={(event) =>
                        onUpdate(row.id, "amount", event.target.value)
                      }
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => onRemove(row.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700"
                    >
                      <Trash2 size={14} />
                      <span className="hidden sm:inline">Remove</span>
                      <span className="sm:hidden">Del</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
