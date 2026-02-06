import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { QuoteForm } from "../quote-form";

export default async function NewQuotePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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
          <Link href="/quotes" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Nouveau devis</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Remplissez les lignes et enregistrez ou validez
          </p>
        </CardHeader>
        <CardContent>
          <QuoteForm
            userId={user.id}
            clients={clients || []}
            companyProfile={company}
          />
        </CardContent>
      </Card>
    </div>
  );
}
