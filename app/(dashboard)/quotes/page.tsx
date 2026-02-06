import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";
import type { QuoteStatus } from "@/types/database";
import { QuoteStatusSelect } from "./[id]/quote-status-select";

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
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
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
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Liste des devis</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-6 pt-0 sm:px-6">
          {quotes && quotes.length > 0 ? (
            <div className="-mx-4 overflow-x-auto sm:mx-0">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 text-left font-medium">N°</th>
                    <th className="pb-3 text-left font-medium">Client</th>
                    <th className="pb-3 text-left font-medium">Date</th>
                    <th className="pb-3 pr-4 text-right font-medium">Total TTC</th>
                    <th className="pb-3 pl-2 text-left font-medium">Statut</th>
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
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-3">
                          <Link
                            href={`/quotes/${q.id}`}
                            className="font-medium text-emerald-600 hover:underline"
                          >
                            {q.number}
                          </Link>
                        </td>
                        <td className="py-3 text-slate-600">
                          {(q.client as { name?: string })?.name ?? "—"}
                        </td>
                        <td className="py-3 text-slate-600">
                          {formatDate(q.issue_date)}
                        </td>
                        <td className="py-3 pr-4 text-right font-medium">
                          {formatCurrency(totalTTC)}
                        </td>
                        <td className="min-w-0 py-3 pl-2">
                          <QuoteStatusSelect
                            quoteId={q.id}
                            currentStatus={q.status as QuoteStatus}
                          />
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href={`/quotes/${q.id}`}
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
              Aucun devis.{" "}
              <Link href="/quotes/new" className="text-emerald-600 hover:underline">
                Créer un devis
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
