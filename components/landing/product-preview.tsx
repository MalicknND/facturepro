"use client";

import { motion } from "framer-motion";

export function ProductPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="w-full max-w-md shrink-0"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-200/50 sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Nouvelle facture
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Client : ACME SAS
        </p>

        <div className="mt-4 overflow-hidden rounded-lg border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-3 py-2 text-left font-medium text-slate-600">
                  Description
                </th>
                <th className="px-3 py-2 text-right font-medium text-slate-600">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-b border-slate-50">
                <td className="px-3 py-2">
                  Développement Front-end — 3 j — 450€
                </td>
                <td className="px-3 py-2 text-right">1 350 €</td>
              </tr>
              <tr className="border-b border-slate-50">
                <td className="px-3 py-2">
                  Intégration UI — 1 j — 450€
                </td>
                <td className="px-3 py-2 text-right">450 €</td>
              </tr>
              <tr className="border-b border-slate-50">
                <td className="px-3 py-2">
                  Maintenance — 2 h — 160€
                </td>
                <td className="px-3 py-2 text-right">160 €</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-1 border-t border-slate-100 pt-4 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Sous-total HT</span>
            <span>1 960 €</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>TVA : 0% (Franchise)</span>
            <span>0 €</span>
          </div>
          <div className="flex justify-between font-semibold text-slate-900">
            <span>Total TTC</span>
            <span>1 960 €</span>
          </div>
        </div>

        <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
          F-2026-0007 — Émise le 06/02/2026
        </p>
      </div>
    </motion.div>
  );
}
