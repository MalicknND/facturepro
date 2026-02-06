import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { QuoteStatusBadge } from "@/components/ui/status-badge";
import { Plus } from "lucide-react";
import type { QuoteStatus } from "@/types/database";

export default async function QuotesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: quotes } = await supabase
    .from("quotes")
    .select(`
      *,
      client:clients(id, name)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const ids = (quotes || []).map((q) => q.id);
  const { data: lines } = ids.length
    ? await supabase
        .from("quote_lines")
        .select("quote_id, quantity, unit_price")
        .in("quote_id", ids)
    : { data: [] };

  const totalByQuote = (lines || []).reduce<Record<string, number>>((acc, l) => {
    const total = (l.quantity || 0) * (l.unit_price || 0);
    acc[l.quote_id] = (acc[l.quote_id] || 0) + total;
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Devis
        </h1>
        <Button asChild>
          <Link href="/quotes/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau devis
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des devis</CardTitle>
        </CardHeader>
        <CardContent>
          {quotes && quotes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-3 text-left font-medium">N°</th>
                    <th className="pb-3 text-left font-medium">Client</th>
                    <th className="pb-3 text-left font-medium">Date</th>
                    <th className="pb-3 text-right font-medium">Total TTC</th>
                    <th className="pb-3 text-left font-medium">Statut</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((q) => {
                    const totalHT = totalByQuote[q.id] || 0;
                    const totalTTC = totalHT * (1 + (q.vat_rate || 0) / 100);
                    return (
                      <tr
                        key={q.id}
                        className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                      >
                        <td className="py-3">
                          <Link
                            href={`/quotes/${q.id}`}
                            className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                          >
                            {q.number}
                          </Link>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-400">
                          {(q.client as { name?: string })?.name ?? "—"}
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-400">
                          {formatDate(q.issue_date)}
                        </td>
                        <td className="py-3 text-right font-medium">
                          {formatCurrency(totalTTC)}
                        </td>
                        <td className="py-3">
                          <QuoteStatusBadge status={q.status as QuoteStatus} />
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href={`/quotes/${q.id}`}
                            className="text-emerald-600 hover:underline dark:text-emerald-400"
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
            <p className="py-12 text-center text-slate-500 dark:text-slate-400">
              Aucun devis.{" "}
              <Link href="/quotes/new" className="text-emerald-600 hover:underline dark:text-emerald-400">
                Créer un devis
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
