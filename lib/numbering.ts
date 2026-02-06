import type { SupabaseClient } from "@supabase/supabase-js";

export async function getNextNumber(
  supabase: SupabaseClient,
  userId: string,
  type: "invoice" | "quote"
): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = type === "invoice" ? "F" : "D";

  const { data: counter, error: fetchError } = await supabase
    .from("numbering_counters")
    .select("last_number")
    .eq("user_id", userId)
    .eq("year", year)
    .eq("type", type)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw fetchError;
  }

  const nextNum = (counter?.last_number ?? 0) + 1;

  const { error: upsertError } = await supabase.from("numbering_counters").upsert(
    {
      user_id: userId,
      year,
      type,
      last_number: nextNum,
    },
    { onConflict: "user_id,year,type" }
  );

  if (upsertError) throw upsertError;

  return `${prefix}-${year}-${String(nextNum).padStart(4, "0")}`;
}
