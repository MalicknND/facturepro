"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import type { Client, ClientType } from "@/types/database";

const schema = z.object({
  name: z.string().min(1, "Nom ou raison sociale requis"),
  client_type: z.enum(["person", "company"]),
  contact_name: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  siret: z
    .string()
    .optional()
    .refine(
      (s) => !s || /^\d{9}$|^\d{14}$/.test((s || "").replace(/\s/g, "")),
      "9 (SIREN) ou 14 (SIRET) chiffres"
    ),
});

type FormData = z.infer<typeof schema>;

export function ClientForm({
  userId,
  client,
  redirectTo,
}: {
  userId: string;
  client?: Client | null;
  redirectTo?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: client
      ? {
          name: client.name,
          client_type: (client.client_type ?? "person") as ClientType,
          contact_name: client.contact_name ?? "",
          address: client.address ?? "",
          email: client.email ?? "",
          phone: client.phone ?? "",
          siret: client.siret ?? "",
        }
      : { client_type: "person", contact_name: "" },
  });

  const clientType = watch("client_type");
  const isCompany = clientType === "company";

  async function onSubmit(data: FormData) {
    const supabase = createClient();
    const payload = {
      user_id: userId,
      name: data.name,
      client_type: data.client_type,
      contact_name: data.contact_name?.trim() || null,
      address: data.address || null,
      email: data.email || null,
      phone: data.phone || null,
      siret: data.siret?.replace(/\s/g, "") || null,
      updated_at: new Date().toISOString(),
    };
    if (client) {
      const { error } = await supabase.from("clients").update(payload).eq("id", client.id);
      if (error) {
        toast(error.message, "error");
        return;
      }
      toast("Client mis à jour");
    } else {
      const { error } = await supabase.from("clients").insert(payload);
      if (error) {
        toast(error.message, "error");
        return;
      }
      toast("Client créé");
    }
    router.push(redirectTo ?? "/clients");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Type de client</Label>
        <div className="mt-2 flex gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              value="person"
              {...register("client_type")}
              className="h-4 w-4 border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium">Particulier</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              value="company"
              {...register("client_type")}
              className="h-4 w-4 border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium">Entreprise</span>
          </label>
        </div>
      </div>
      <div>
        <Label htmlFor="name">
          {isCompany ? "Raison sociale *" : "Nom *"}
        </Label>
        <Input
          id="name"
          {...register("name")}
          className="mt-1"
          placeholder={isCompany ? "Nom de la société" : undefined}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      {isCompany && (
        <div>
          <Label htmlFor="contact_name">Personne à contacter</Label>
          <Input
            id="contact_name"
            {...register("contact_name")}
            className="mt-1"
            placeholder="M. / Mme ..."
          />
        </div>
      )}
      <div>
        <Label htmlFor="address">Adresse</Label>
        <Input id="address" {...register("address")} className="mt-1" />
      </div>
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
      <div>
        <Label htmlFor="siret">
          SIRET / SIREN {isCompany ? "(recommandé pour une entreprise)" : "(optionnel)"}
        </Label>
        <Input id="siret" {...register("siret")} className="mt-1" placeholder="9 (SIREN) ou 14 (SIRET) chiffres" />
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {client ? "Enregistrer" : "Créer le client"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
