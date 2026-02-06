import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Download, Send } from "lucide-react";
import type { InvoiceStatus } from "@/types/database";
import { InvoiceStatusSelect } from "./invoice-status-select";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: invoice } = await supabase
    .from("invoices")
    .select(`
      *,
      client:clients(*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!invoice) notFound();

  const { data: lines } = await supabase
    .from("invoice_lines")
    .select("*")
    .eq("invoice_id", id)
    .order("order_index");

  const sortedLines = (lines || []).sort((a, b) => a.order_index - b.order_index);
  const subtotalHT = sortedLines.reduce((s, l) => s + l.quantity * l.unit_price, 0);
  const tva = (subtotalHT * (invoice.vat_rate || 0)) / 100;
  const totalTTC = subtotalHT + tva;
  const client = invoice.client as { name: string; address?: string; email?: string; phone?: string; siret?: string } | null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/invoices" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {invoice.number}
            </h1>
            <p className="text-sm text-slate-500">
              Facture · {client?.name}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Statut :</span>
          <InvoiceStatusSelect
            invoiceId={invoice.id}
            currentStatus={invoice.status as InvoiceStatus}
          />
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href={`/api/invoices/${id}/pdf`} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" />
              Télécharger PDF
            </a>
          </Button>
          <Button variant="secondary" size="sm" className="gap-2" disabled>
            <Send className="h-4 w-4" />
            Envoyer (placeholder)
          </Button>
          {invoice.status === "draft" && (
            <Button asChild size="sm">
              <Link href={`/invoices/${id}/edit`}>Modifier</Link>
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
            <p>
              <span className="text-slate-500">Date d&apos;émission :</span>{" "}
              {formatDate(invoice.issue_date)}
            </p>
            <p>
              <span className="text-slate-500">Date d&apos;échéance :</span>{" "}
              {formatDate(invoice.due_date)}
            </p>
            <p>
              <span className="text-slate-500">TVA :</span> {invoice.vat_rate}%
            </p>
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
                    <td className="py-3 text-right">
                      {formatCurrency(l.quantity * l.unit_price)}
                    </td>
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
              <span>TVA ({invoice.vat_rate}%)</span>
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
