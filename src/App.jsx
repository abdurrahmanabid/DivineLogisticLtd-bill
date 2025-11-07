import { Navigate, Route, Routes } from "react-router-dom";
import InvoiceForm from "./components/InvoiceForm";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/true-trade-international" replace />}
      />
      <Route path="/true-trade-international" element={<InvoicePage />} />
    </Routes>
  );
}

function InvoicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white-950 via-white-900 to-white-950 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-white/10 bg-white/95 p-5 shadow-2xl shadow-gray-900/20 backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
              Divine Logistic Ltd.
            </p>
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
              Invoice PDF Generator
            </h1>
            <p className="text-sm text-gray-500">
              Prepare, review and export invoices with mobile-first controls.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <InvoiceForm />
        </div>
      </div>
    </div>
  );
}
