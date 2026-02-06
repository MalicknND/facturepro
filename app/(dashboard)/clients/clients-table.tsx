"use client";

import Link from "next/link";
import type { Client } from "@/types/database";

export function ClientsTable({ clients }: { clients: Client[] }) {
  if (!clients.length) {
    return (
      <p className="py-12 text-center text-slate-500 dark:text-slate-400">
        Aucun client. Créez votre premier client pour commencer.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="pb-3 text-left font-medium">Nom</th>
            <th className="pb-3 text-left font-medium">Email</th>
            <th className="pb-3 text-left font-medium">Téléphone</th>
            <th className="pb-3 text-left font-medium">SIRET</th>
            <th className="pb-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr
              key={c.id}
              className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/30"
            >
              <td className="py-3">
                <Link
                  href={`/clients/${c.id}/edit`}
                  className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  {c.name}
                </Link>
              </td>
              <td className="py-3 text-slate-600 dark:text-slate-400">
                {c.email ?? "—"}
              </td>
              <td className="py-3 text-slate-600 dark:text-slate-400">
                {c.phone ?? "—"}
              </td>
              <td className="py-3 text-slate-600 dark:text-slate-400">
                {c.siret ?? "—"}
              </td>
              <td className="py-3 text-right">
                <Link
                  href={`/invoices/new?client=${c.id}`}
                  className="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Nouvelle facture
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
