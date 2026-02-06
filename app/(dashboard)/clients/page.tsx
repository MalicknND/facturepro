import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { ClientsTable } from "./clients-table";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { q } = await searchParams;
  let query = supabase.from("clients").select("*").eq("user_id", user.id).order("name");
  if (q?.trim()) {
    query = query.or(`name.ilike.%${q.trim()}%,email.ilike.%${q.trim()}%`);
  }
  const { data: clients } = await query;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Clients
        </h1>
        <Button asChild>
          <Link href="/clients/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau client
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <CardTitle className="shrink-0">Liste des clients</CardTitle>
          <form className="flex w-full min-w-0 gap-2 sm:w-auto" method="get" action="/clients">
            <div className="relative min-w-0 flex-1 sm:flex-initial sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                name="q"
                placeholder="Rechercher (nom, email)..."
                defaultValue={q}
                className="w-full pl-9"
              />
            </div>
            <Button type="submit" variant="secondary" className="shrink-0">
              Rechercher
            </Button>
          </form>
        </CardHeader>
        <CardContent className="px-4 pb-6 pt-0 sm:px-6">
          <ClientsTable clients={clients || []} />
        </CardContent>
      </Card>
    </div>
  );
}
