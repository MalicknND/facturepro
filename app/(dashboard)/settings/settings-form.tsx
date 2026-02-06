"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { CardTitle } from "@/components/ui/card";
import type { CompanyProfile } from "@/types/database";

const schema = z.object({
  name: z.string().min(1, "Nom requis"),
  address: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  vat_exempt: z.boolean(),
  vat_number: z.string().optional(),
  payment_delay_days: z.coerce.number().min(0),
  late_penalty_rate: z.coerce.number().min(0).max(100).optional().nullable(),
  late_penalty_fixed: z.coerce.number().min(0).optional().nullable(),
  legal_mention: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function SettingsForm({
  userId,
  company,
}: {
  userId: string;
  company: CompanyProfile | null;
}) {
  const { toast } = useToast();
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: company
      ? {
          name: company.name,
          address: company.address ?? "",
          email: company.email ?? "",
          phone: company.phone ?? "",
          vat_exempt: company.vat_exempt ?? false,
          vat_number: company.vat_number ?? "",
          payment_delay_days: company.payment_delay_days ?? 30,
          late_penalty_rate: company.late_penalty_rate ?? undefined,
          late_penalty_fixed: company.late_penalty_fixed ?? undefined,
          legal_mention: company.legal_mention ?? "",
        }
      : {
          name: "",
          address: "",
          email: "",
          phone: "",
          vat_exempt: false,
          vat_number: "",
          payment_delay_days: 30,
          late_penalty_rate: undefined,
          late_penalty_fixed: undefined,
          legal_mention: "",
        },
  });

  const vatExempt = watch("vat_exempt");

  async function onSubmit(data: FormData) {
    const supabase = createClient();
    let logo_url = company?.logo_url ?? null;

    if (logoFile) {
      const ext = logoFile.name.split(".").pop() || "png";
      const path = `${userId}/logo.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(path, logoFile, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);
        logo_url = urlData.publicUrl;
      }
    }

    const payload = {
      user_id: userId,
      name: data.name,
      address: data.address || null,
      email: data.email || null,
      phone: data.phone || null,
      logo_url,
      vat_exempt: data.vat_exempt,
      vat_number: data.vat_exempt ? null : (data.vat_number || null),
      payment_delay_days: data.payment_delay_days,
      late_penalty_rate: data.late_penalty_rate ?? null,
      late_penalty_fixed: data.late_penalty_fixed ?? null,
      legal_mention: data.legal_mention || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("company_profile")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      toast(error.message, "error");
      return;
    }
    toast("Paramètres enregistrés");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nom de l&apos;entreprise *</Label>
          <Input id="name" {...register("name")} className="mt-1" />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="logo">Logo</Label>
          <Input
            id="logo"
            type="file"
            accept="image/*"
            className="mt-1"
            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
          />
          {company?.logo_url && (
            <p className="mt-1 text-xs text-slate-500">Logo actuel conservé si vous ne choisissez pas de fichier.</p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="address">Adresse</Label>
        <Input id="address" {...register("address")} className="mt-1" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} className="mt-1" />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" {...register("phone")} className="mt-1" />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="vat_exempt"
            {...register("vat_exempt")}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <Label htmlFor="vat_exempt">TVA non applicable (art. 293 B du CGI)</Label>
        </div>
      </div>
      {!vatExempt && (
        <div>
          <Label htmlFor="vat_number">Numéro de TVA</Label>
          <Input id="vat_number" {...register("vat_number")} className="mt-1" placeholder="FR..." />
        </div>
      )}

      <div>
        <CardTitle className="text-base">Conditions de paiement</CardTitle>
        <p className="text-sm text-slate-500">
          Délai en jours, pénalités de retard, indemnité forfaitaire
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Délai de paiement (jours)</Label>
            <Input type="number" min={0} {...register("payment_delay_days")} className="mt-1" />
          </div>
          <div>
            <Label>Pénalités de retard (%)</Label>
            <Input type="number" min={0} step="0.01" {...register("late_penalty_rate")} className="mt-1" />
          </div>
          <div>
            <Label>Indemnité forfaitaire (€)</Label>
            <Input type="number" min={0} step="0.01" {...register("late_penalty_fixed")} className="mt-1" />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="legal_mention">Mentions légales (bas de facture/devis)</Label>
        <textarea
          id="legal_mention"
          {...register("legal_mention")}
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          placeholder="Ex. : SAS au capital de... RCS... Conditions de paiement..."
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Enregistrer
      </Button>
    </form>
  );
}
