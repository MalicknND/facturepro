import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, FileText, Download } from "lucide-react";
import type { QuoteStatus } from "@/types/database";
import { ConvertToInvoiceButton } from "./convert-to-invoice";
import { QuoteStatusSelect } from "./quote-status-select";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: quote } = await supabase
    .from("quotes")
    .select(`
      *,
      client:clients(*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!quote) notFound();

  const { data: lines } = await supabase
    .from("quote_lines")
    .select("*")
    .eq("quote_id", id)
    .order("order_index");

  const sortedLines = (lines || []).sort((a, b) => a.order_index - b.order_index);
  const subtotalHT = sortedLines.reduce((s, l) => s + l.quantity * l.unit_price, 0);
  const tva = (subtotalHT * (quote.vat_rate || 0)) / 100;
  const totalTTC = subtotalHT + tva;
  const client = quote.client as { name: string; address?: string; email?: string; phone?: string; siret?: string } | null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/quotes" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {quote.number}
            </h1>
            <p className="text-sm text-slate-500">
              Devis · {client?.name}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Statut :</span>
          <QuoteStatusSelect
            quoteId={quote.id}
            currentStatus={quote.status as QuoteStatus}
          />
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href={`/api/quotes/${quote.id}/pdf`} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" />
              Télécharger PDF
            </a>
          </Button>
          {quote.status === "accepted" && (
            <ConvertToInvoiceButton quoteId={quote.id} />
          )}
          {quote.status === "draft" && (
            <Button asChild size="sm">
              <Link href={`/quotes/${id}/edit`}>Modifier</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{client?.name}</p>
            {(client as { client_type?: string; contact_name?: string | null })?.contact_name && (
              <p className="text-slate-600">
                À l&apos;attention de : {(client as { contact_name?: string }).contact_name}
              </p>
            )}
            {client?.address && <p className="text-slate-600">{client.address}</p>}
            {client?.email && <p>{client.email}</p>}
            {client?.phone && <p>{client.phone}</p>}
            {client?.siret && (
              <p>
                {(client.siret.replace(/\s/g, "").length === 9 ? "SIREN" : "SIRET")} : {client.siret}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Détails</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Date : {formatDate(quote.issue_date)}</p>
            {quote.valid_until && <p>Valide jusqu&apos;au : {formatDate(quote.valid_until)}</p>}
            <p>TVA : {quote.vat_rate}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lignes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-left font-medium">Description</th>
                  <th className="pb-3 text-right font-medium">Quantité</th>
                  <th className="pb-3 text-right font-medium">Prix unitaire HT</th>
                  <th className="pb-3 text-right font-medium">Total HT</th>
                </tr>
              </thead>
              <tbody>
                {sortedLines.map((l) => (
                  <tr key={l.id} className="border-b border-slate-100">
                    <td className="py-3">{l.description}</td>
                    <td className="py-3 text-right">{l.quantity}</td>
                    <td className="py-3 text-right">{formatCurrency(l.unit_price)}</td>
                    <td className="py-3 text-right">{formatCurrency(l.quantity * l.unit_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-col items-end gap-1 rounded-lg bg-slate-50 p-4">
            <div className="flex w-full max-w-56 justify-between text-sm">
              <span>Sous-total HT</span>
              <span>{formatCurrency(subtotalHT)}</span>
            </div>
            <div className="flex w-full max-w-56 justify-between text-sm">
              <span>TVA ({quote.vat_rate}%)</span>
              <span>{formatCurrency(tva)}</span>
            </div>
            <div className="flex w-full max-w-56 justify-between font-semibold">
              <span>Total TTC</span>
              <span>{formatCurrency(totalTTC)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
