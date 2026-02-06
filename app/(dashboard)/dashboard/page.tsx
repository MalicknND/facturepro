import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileText, TrendingUp, AlertCircle, Plus } from "lucide-react";
import { InvoiceStatusBadge } from "@/components/ui/status-badge";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, number, status, issue_date, due_date")
    .eq("user_id", user.id);

  const { data: invoiceLines } = invoices?.length
    ? await supabase
        .from("invoice_lines")
        .select("invoice_id, quantity, unit_price")
        .in("invoice_id", invoices.map((i) => i.id))
    : { data: [] };

  const linesByInvoice = (invoiceLines || []).reduce<Record<string, number>>((acc, l) => {
    const total = (l.quantity || 0) * (l.unit_price || 0);
    acc[l.invoice_id] = (acc[l.invoice_id] || 0) + total;
    return acc;
  }, {});

  const invoicesThisMonth = (invoices || []).filter(
    (i) => i.issue_date >= startOfMonth && i.issue_date <= endOfMonth
  );
  const caThisMonth = invoicesThisMonth.reduce(
    (sum, i) => sum + (linesByInvoice[i.id] || 0),
    0
  );
  const unpaid = (invoices || []).filter(
    (i) => (i.status === "sent" || i.status === "overdue") && i.due_date < now.toISOString().slice(0, 10)
  );
  const unpaidAmount = unpaid.reduce((sum, i) => sum + (linesByInvoice[i.id] || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Tableau de bord
        </h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/invoices/new" className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle facture
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Factures ce mois
            </CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{invoicesThisMonth.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Émises en {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Chiffre d&apos;affaires
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(caThisMonth)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">HT ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Impayés
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatCurrency(unpaidAmount)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {unpaid.length} facture(s) en retard
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Dernières factures</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/invoices">Voir tout</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {invoices && invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-3 text-left font-medium">N°</th>
                    <th className="pb-3 text-left font-medium">Date</th>
                    <th className="pb-3 text-left font-medium">Échéance</th>
                    <th className="pb-3 text-right font-medium">Total HT</th>
                    <th className="pb-3 text-left font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.slice(0, 5).map((inv) => (
                    <tr key={inv.id} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="py-3">
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          {inv.number}
                        </Link>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">
                        {formatDate(inv.issue_date)}
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">
                        {formatDate(inv.due_date)}
                      </td>
                      <td className="py-3 text-right">
                        {formatCurrency(linesByInvoice[inv.id] || 0)}
                      </td>
                      <td className="py-3">
                        <InvoiceStatusBadge status={inv.status as import("@/types/database").InvoiceStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-slate-500 dark:text-slate-400">
              Aucune facture.{" "}
              <Link href="/invoices/new" className="text-emerald-600 hover:underline dark:text-emerald-400">
                Créer une facture
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

