"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { InvoiceStatus } from "@/types/database";

const VALID_STATUSES: InvoiceStatus[] = ["draft", "sent", "paid", "overdue"];

export async function updateInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatus
) {
  if (!VALID_STATUSES.includes(status)) {
    return { error: "Statut invalide" };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non autorisé" };

  const { error } = await supabase
    .from("invoices")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", invoiceId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
  return { success: true };
}
