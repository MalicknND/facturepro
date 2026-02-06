import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ClientForm } from "../client-form";

export default async function NewClientPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/clients" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </Button>
      </div>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Nouveau client</CardTitle>
          <p className="text-sm text-slate-500">
            Renseignez les informations du client
          </p>
        </CardHeader>
        <CardContent>
          <ClientForm userId={user.id} />
        </CardContent>
      </Card>
    </div>
  );
}
