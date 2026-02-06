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
import type { Client } from "@/types/database";

const schema = z.object({
  name: z.string().min(1, "Nom requis"),
  address: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  siret: z.string().optional(),
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
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: client
      ? {
          name: client.name,
          address: client.address ?? "",
          email: client.email ?? "",
          phone: client.phone ?? "",
          siret: client.siret ?? "",
        }
      : undefined,
  });

  async function onSubmit(data: FormData) {
    const supabase = createClient();
    const payload = {
      user_id: userId,
      name: data.name,
      address: data.address || null,
      email: data.email || null,
      phone: data.phone || null,
      siret: data.siret || null,
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
        <Label htmlFor="name">Nom *</Label>
        <Input id="name" {...register("name")} className="mt-1" />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
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
        <Label htmlFor="siret">SIRET (optionnel)</Label>
        <Input id="siret" {...register("siret")} className="mt-1" placeholder="14 chiffres" />
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
