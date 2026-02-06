import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: company } = await supabase
    .from("company_profile")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Paramètres
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Profil entreprise</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Nom, adresse, logo et mentions légales utilisés sur les factures et devis
          </p>
        </CardHeader>
        <CardContent>
          <SettingsForm userId={user.id} company={company} />
        </CardContent>
      </Card>
    </div>
  );
}
