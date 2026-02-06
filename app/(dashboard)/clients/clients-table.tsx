"use client";

import Link from "next/link";
import type { Client } from "@/types/database";

export function ClientsTable({ clients }: { clients: Client[] }) {
  if (!clients.length) {
    return (
      <p className="py-12 text-center text-slate-500">
        Aucun client. Créez votre premier client pour commencer.
      </p>
    );
  }
  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="pb-3 text-left font-medium">Nom</th>
            <th className="pb-3 text-left font-medium">Email</th>
            <th className="pb-3 text-left font-medium">Téléphone</th>
            <th className="pb-3 text-left font-medium">SIRET / SIREN</th>
            <th className="pb-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr
              key={c.id}
              className="border-b border-slate-100 hover:bg-slate-50"
            >
              <td className="py-3">
                <Link
                  href={`/clients/${c.id}/edit`}
                  className="font-medium text-emerald-600 hover:underline"
                >
                  {c.name}
                </Link>
              </td>
              <td className="py-3 text-slate-600">
                {c.email ?? "—"}
              </td>
              <td className="py-3 text-slate-600">
                {c.phone ?? "—"}
              </td>
              <td className="py-3 text-slate-600">
                {c.siret ?? "—"}
              </td>
              <td className="py-3 text-right">
                <Link
                  href={`/invoices/new?client=${c.id}`}
                  className="text-sm text-emerald-600 hover:underline"
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
