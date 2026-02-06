import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { InvoiceForm } from "../../invoice-form";

export default async function EditInvoicePage({
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
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!invoice || invoice.status !== "draft") notFound();

  const { data: lines } = await supabase
    .from("invoice_lines")
    .select("*")
    .eq("invoice_id", id)
    .order("order_index");

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .eq("user_id", user.id)
    .order("name");

  const { data: company } = await supabase
    .from("company_profile")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/invoices/${id}`} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Modifier la facture {invoice.number}</CardTitle>
          <p className="text-sm text-slate-500">
            Statut : Brouillon — les modifications sont autorisées
          </p>
        </CardHeader>
        <CardContent>
          <InvoiceForm
            userId={user.id}
            clients={clients || []}
            companyProfile={company}
            invoice={{ ...invoice, lines: lines || [] }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
