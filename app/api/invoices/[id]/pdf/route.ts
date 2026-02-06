import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generatePdf } from "@/lib/pdf-invoice";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!invoice) {
    return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
  }

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", invoice.client_id)
    .single();
  if (!client) {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  }

  const { data: company } = await supabase
    .from("company_profile")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: lines } = await supabase
    .from("invoice_lines")
    .select("description, quantity, unit_price")
    .eq("invoice_id", id)
    .order("order_index");

  const doc = generatePdf({
    number: invoice.number,
    issue_date: invoice.issue_date,
    due_date: invoice.due_date,
    vat_rate: invoice.vat_rate ?? 20,
    note: invoice.note,
    type: "invoice",
    company: {
      name: company?.name ?? "Mon entreprise",
      address: company?.address,
      email: company?.email,
      phone: company?.phone,
      logo_url: company?.logo_url,
      vat_exempt: company?.vat_exempt,
      vat_number: company?.vat_number,
      legal_mention: company?.legal_mention,
    },
    client: {
      name: client.name,
      address: client.address,
      email: client.email,
      phone: client.phone,
      siret: client.siret,
    },
    lines: (lines ?? []).map((l) => ({
      description: l.description,
      quantity: l.quantity,
      unit_price: l.unit_price,
    })),
  });

  const buffer = doc.output("arraybuffer");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Facture-${invoice.number}.pdf"`,
    },
  });
}
