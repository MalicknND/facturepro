"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { QuoteStatus } from "@/types/database";

const VALID_STATUSES: QuoteStatus[] = ["draft", "sent", "accepted", "rejected"];

export async function updateQuoteStatus(quoteId: string, status: QuoteStatus) {
  if (!VALID_STATUSES.includes(status)) {
    return { error: "Statut invalide" };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non autorisé" };

  const { error } = await supabase
    .from("quotes")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", quoteId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/quotes");
  revalidatePath(`/quotes/${quoteId}`);
  return { success: true };
}
