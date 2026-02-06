"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getNextNumber } from "@/lib/numbering";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { FileText } from "lucide-react";

export function ConvertToInvoiceButton({ quoteId }: { quoteId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function convert() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: quote } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", quoteId)
      .eq("user_id", user.id)
      .single();
    if (!quote) {
      toast("Devis introuvable", "error");
      setLoading(false);
      return;
    }

    const { data: quoteLines } = await supabase
      .from("quote_lines")
      .select("description, quantity, unit_price, order_index")
      .eq("quote_id", quoteId)
      .order("order_index");

    const number = await getNextNumber(supabase, user.id, "invoice");
    const delay = 30;
    const due = new Date(quote.issue_date);
    due.setDate(due.getDate() + delay);

    const { data: newInvoice, error: invError } = await supabase
      .from("invoices")
      .insert({
        user_id: user.id,
        client_id: quote.client_id,
        number,
        status: "draft",
        issue_date: new Date().toISOString().slice(0, 10),
        due_date: due.toISOString().slice(0, 10),
        vat_rate: quote.vat_rate,
        note: quote.note,
        quote_id: quote.id,
      })
      .select("id")
      .single();

    if (invError) {
      toast(invError.message, "error");
      setLoading(false);
      return;
    }

    if (quoteLines?.length) {
      await supabase.from("invoice_lines").insert(
        quoteLines.map((l, i) => ({
          invoice_id: newInvoice!.id,
          description: l.description,
          quantity: l.quantity,
          unit_price: l.unit_price,
          order_index: i,
        }))
      );
    }
    toast("Facture créée à partir du devis");
    router.push(`/invoices/${newInvoice!.id}`);
    router.refresh();
    setLoading(false);
  }

  return (
    <Button size="sm" onClick={convert} disabled={loading} className="gap-2">
      <FileText className="h-4 w-4" />
      Convertir en facture
    </Button>
  );
}
