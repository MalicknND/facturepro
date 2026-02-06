"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { getNextNumber } from "@/lib/numbering";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import type { CompanyProfile } from "@/types/database";

const lineSchema = z.object({
  description: z.string().min(1, "Description requise"),
  quantity: z.coerce.number().min(0.01, "Quantité > 0"),
  unit_price: z.coerce.number().min(0, "Prix ≥ 0"),
});

const schema = z.object({
  client_id: z.string().min(1, "Sélectionnez un client"),
  issue_date: z.string().min(1, "Date d'émission requise"),
  due_date: z.string().min(1, "Date d'échéance requise"),
  vat_rate: z.coerce.number().min(0).max(100),
  note: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface LineRow {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

interface InvoiceFormProps {
  userId: string;
  clients: { id: string; name: string }[];
  companyProfile: CompanyProfile | null;
  preselectedClientId?: string;
  invoice?: {
    id: string;
    client_id: string;
    number: string;
    status: string;
    issue_date: string;
    due_date: string;
    vat_rate: number;
    note: string | null;
    lines?: { id: string; description: string; quantity: number; unit_price: number; order_index: number }[];
  };
}

export function InvoiceForm({
  userId,
  clients,
  companyProfile,
  preselectedClientId,
  invoice,
}: InvoiceFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const defaultVat = companyProfile?.vat_exempt ? 0 : 20;
  const [lines, setLines] = useState<LineRow[]>(() => {
    if (invoice?.lines?.length) {
      return invoice.lines
        .sort((a, b) => a.order_index - b.order_index)
        .map((l) => ({
          id: l.id,
          description: l.description,
          quantity: l.quantity,
          unit_price: l.unit_price,
        }));
    }
    return [
      { id: "1", description: "", quantity: 1, unit_price: 0 },
    ];
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: invoice
      ? {
          client_id: invoice.client_id,
          issue_date: invoice.issue_date,
          due_date: invoice.due_date,
          vat_rate: invoice.vat_rate,
          note: invoice.note ?? "",
        }
      : {
          client_id: preselectedClientId ?? "",
          issue_date: new Date().toISOString().slice(0, 10),
          due_date: (() => {
            const d = new Date();
            const delay = companyProfile?.payment_delay_days ?? 30;
            d.setDate(d.getDate() + delay);
            return d.toISOString().slice(0, 10);
          })(),
          vat_rate: defaultVat,
          note: "",
        },
  });

  const vatRate = watch("vat_rate");
  const totals = useMemo(() => {
    let subtotalHT = 0;
    lines.forEach((l) => {
      subtotalHT += l.quantity * l.unit_price;
    });
    const tva = (subtotalHT * vatRate) / 100;
    const totalTTC = subtotalHT + tva;
    return { subtotalHT, tva, totalTTC };
  }, [lines, vatRate]);

  function addLine() {
    setLines((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        unit_price: 0,
      },
    ]);
  }

  function removeLine(id: string) {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  function updateLine(id: string, field: keyof LineRow, value: string | number) {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  }

  async function onSubmit(data: FormData, status: "draft" | "sent") {
    const supabase = createClient();
    const validLines = lines.filter((l) => l.description.trim() && l.quantity > 0);
    if (!validLines.length) {
      toast("Ajoutez au moins une ligne avec description et quantité.", "error");
      return;
    }

    let number: string;
    if (invoice && invoice.status !== "draft") {
      number = invoice.number;
    } else {
      try {
        number = await getNextNumber(supabase, userId, "invoice");
      } catch (e) {
        toast("Erreur numérotation", "error");
        return;
      }
    }

    const payload = {
      user_id: userId,
      client_id: data.client_id,
      number: invoice ? invoice.number : number,
      status,
      issue_date: data.issue_date,
      due_date: data.due_date,
      vat_rate: data.vat_rate,
      note: data.note || null,
      updated_at: new Date().toISOString(),
    };

    if (invoice) {
      const { error: updError } = await supabase
        .from("invoices")
        .update(payload)
        .eq("id", invoice.id);
      if (updError) {
        toast(updError.message, "error");
        return;
      }
      await supabase.from("invoice_lines").delete().eq("invoice_id", invoice.id);
    } else {
      const { data: newInv, error: insError } = await supabase
        .from("invoices")
        .insert({ ...payload, number })
        .select("id")
        .single();
      if (insError) {
        toast(insError.message, "error");
        return;
      }
      if (!newInv) return;
      const linePayloads = validLines.map((l, i) => ({
        invoice_id: newInv.id,
        description: l.description,
        quantity: l.quantity,
        unit_price: l.unit_price,
        order_index: i,
      }));
      const { error: linesError } = await supabase.from("invoice_lines").insert(linePayloads);
      if (linesError) {
        toast(linesError.message, "error");
        return;
      }
      toast(status === "draft" ? "Brouillon enregistré" : "Facture validée");
      router.push(`/invoices/${newInv.id}`);
      router.refresh();
      return;
    }

    const linePayloads = validLines.map((l, i) => ({
      invoice_id: invoice.id,
      description: l.description,
      quantity: l.quantity,
      unit_price: l.unit_price,
      order_index: i,
    }));
    await supabase.from("invoice_lines").insert(linePayloads);
    toast(status === "draft" ? "Brouillon enregistré" : "Facture validée");
    router.push(`/invoices/${invoice.id}`);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(
        (d) => onSubmit(d, "draft"),
        () => toast("Vérifiez les champs", "error")
      )}
      className="space-y-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Client *</Label>
          <select
            {...register("client_id")}
            className="mt-1 flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Sélectionner un client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.client_id && (
            <p className="mt-1 text-sm text-red-600">{errors.client_id.message}</p>
          )}
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <Label>Date d&apos;émission *</Label>
            <Input type="date" {...register("issue_date")} className="mt-1" />
            {errors.issue_date && (
              <p className="mt-1 text-sm text-red-600">{errors.issue_date.message}</p>
            )}
          </div>
          <div className="flex-1">
            <Label>Date d&apos;échéance *</Label>
            <Input type="date" {...register("due_date")} className="mt-1" />
            {errors.due_date && (
              <p className="mt-1 text-sm text-red-600">{errors.due_date.message}</p>
            )}
          </div>
        </div>
        <div>
          <Label>TVA (%)</Label>
          <Input
            type="number"
            step="0.01"
            min={0}
            max={100}
            {...register("vat_rate")}
            className="mt-1"
          />
          {companyProfile?.vat_exempt && (
            <p className="mt-1 text-xs text-slate-500">TVA non applicable, art. 293 B du CGI</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label>Lignes</Label>
          <Button type="button" variant="outline" size="sm" onClick={addLine} className="gap-1">
            <Plus className="h-4 w-4" />
            Ligne
          </Button>
        </div>
        <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-2 text-left font-medium">Description</th>
                <th className="w-24 p-2 text-right font-medium">Qté</th>
                <th className="w-32 p-2 text-right font-medium">Prix unitaire HT</th>
                <th className="w-32 p-2 text-right font-medium">Total HT</th>
                <th className="w-10 p-2" />
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id} className="border-b border-slate-100">
                  <td className="p-2">
                    <Input
                      value={line.description}
                      onChange={(e) => updateLine(line.id, "description", e.target.value)}
                      placeholder="Description"
                      className="border-0 bg-transparent focus-visible:ring-1"
                    />
                  </td>
                  <td className="p-2 text-right">
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={line.quantity || ""}
                      onChange={(e) => updateLine(line.id, "quantity", e.target.value ? parseFloat(e.target.value) : 0)}
                      className="w-full border-0 bg-transparent text-right focus-visible:ring-1"
                    />
                  </td>
                  <td className="p-2 text-right">
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={line.unit_price || ""}
                      onChange={(e) => updateLine(line.id, "unit_price", e.target.value ? parseFloat(e.target.value) : 0)}
                      className="w-full border-0 bg-transparent text-right focus-visible:ring-1"
                    />
                  </td>
                  <td className="p-2 text-right text-slate-600">
                    {formatCurrency(line.quantity * line.unit_price)}
                  </td>
                  <td className="p-2">
                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                      aria-label="Supprimer la ligne"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 rounded-lg bg-slate-50 p-4">
        <div className="flex w-64 justify-between text-sm">
          <span>Sous-total HT</span>
          <span>{formatCurrency(totals.subtotalHT)}</span>
        </div>
        <div className="flex w-64 justify-between text-sm">
          <span>TVA ({vatRate}%)</span>
          <span>{formatCurrency(totals.tva)}</span>
        </div>
        <div className="flex w-64 justify-between font-semibold">
          <span>Total TTC</span>
          <span>{formatCurrency(totals.totalTTC)}</span>
        </div>
      </div>

      <div>
        <Label>Note / mentions</Label>
        <textarea
          {...register("note")}
          rows={2}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          placeholder="Conditions de paiement, etc."
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="secondary" disabled={isSubmitting}>
          Enregistrer brouillon
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit(
            (d) => onSubmit(d, "sent"),
            () => toast("Vérifiez les champs", "error")
          )}
        >
          Valider
        </Button>
        {invoice && (
          <Button
            type="button"
            variant="outline"
            onClick={() => (window.location.href = `/api/invoices/${invoice.id}/pdf`)}
          >
            Télécharger PDF
          </Button>
        )}
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
