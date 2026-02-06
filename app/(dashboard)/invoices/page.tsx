import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";
import type { InvoiceStatus } from "@/types/database";
import { InvoiceStatusSelect } from "./[id]/invoice-status-select";

export default async function InvoicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: invoices } = await supabase
    .from("invoices")
    .select(`
      *,
      client:clients(id, name)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const ids = (invoices || []).map((i) => i.id);
  const { data: lines } = ids.length
    ? await supabase
        .from("invoice_lines")
        .select("invoice_id, quantity, unit_price")
        .in("invoice_id", ids)
    : { data: [] };

  const totalByInvoice = (lines || []).reduce<Record<string, number>>((acc, l) => {
    const total = (l.quantity || 0) * (l.unit_price || 0);
    acc[l.invoice_id] = (acc[l.invoice_id] || 0) + total;
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Factures
        </h1>
        <Button asChild>
          <Link href="/invoices/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle facture
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des factures</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices && invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 text-left font-medium">N°</th>
                    <th className="pb-3 text-left font-medium">Client</th>
                    <th className="pb-3 text-left font-medium">Date</th>
                    <th className="pb-3 text-left font-medium">Échéance</th>
                    <th className="pb-3 pr-4 text-right font-medium">Total TTC</th>
                    <th className="pb-3 pl-2 text-left font-medium">Statut</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => {
                    const totalHT = totalByInvoice[inv.id] || 0;
                    const totalTTC = totalHT * (1 + (inv.vat_rate || 0) / 100);
                    return (
                      <tr
                        key={inv.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-3">
                          <Link
                            href={`/invoices/${inv.id}`}
                            className="font-medium text-emerald-600 hover:underline"
                          >
                            {inv.number}
                          </Link>
                        </td>
                        <td className="py-3 text-slate-600">
                          {(inv.client as { name?: string })?.name ?? "—"}
                        </td>
                        <td className="py-3 text-slate-600">
                          {formatDate(inv.issue_date)}
                        </td>
                        <td className="py-3 text-slate-600">
                          {formatDate(inv.due_date)}
                        </td>
                        <td className="py-3 pr-4 text-right font-medium">
                          {formatCurrency(totalTTC)}
                        </td>
                        <td className="py-3 pl-2">
                          <InvoiceStatusSelect
                            invoiceId={inv.id}
                            currentStatus={inv.status as InvoiceStatus}
                          />
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href={`/invoices/${inv.id}`}
                            className="text-emerald-600 hover:underline"
                          >
                            Voir
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-12 text-center text-slate-500">
              Aucune facture.{" "}
              <Link href="/invoices/new" className="text-emerald-600 hover:underline">
                Créer une facture
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
