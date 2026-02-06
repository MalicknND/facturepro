"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function Topbar() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex-1" />
      <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
        <LogOut className="h-4 w-4" />
        Déconnexion
      </Button>
    </header>
  );
}
