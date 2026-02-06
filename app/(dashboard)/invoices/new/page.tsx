import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { InvoiceForm } from "../invoice-form";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { client: clientId } = await searchParams;
  let preselectedClient = null;
  if (clientId) {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("id", clientId)
      .eq("user_id", user.id)
      .single();
    preselectedClient = data;
  }

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
          <Link href="/invoices" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle facture</CardTitle>
          <p className="text-sm text-slate-500">
            Remplissez les lignes et enregistrez en brouillon ou validez
          </p>
        </CardHeader>
        <CardContent>
          <InvoiceForm
            userId={user.id}
            clients={clients || []}
            companyProfile={company}
            preselectedClientId={preselectedClient?.id ?? clientId ?? undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
}
