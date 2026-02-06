"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateQuoteStatus } from "./actions";
import { useToast } from "@/components/ui/toast";
import type { QuoteStatus } from "@/types/database";

const OPTIONS: { value: QuoteStatus; label: string }[] = [
  { value: "draft", label: "Brouillon" },
  { value: "sent", label: "Envoyé" },
  { value: "accepted", label: "Accepté" },
  { value: "rejected", label: "Refusé" },
];

export function QuoteStatusSelect({
  quoteId,
  currentStatus,
}: {
  quoteId: string;
  currentStatus: QuoteStatus;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value as QuoteStatus;
    if (status === currentStatus) return;
    startTransition(async () => {
      const result = await updateQuoteStatus(quoteId, status);
      if (result.error) {
        toast(result.error, "error");
        return;
      }
      toast("Statut mis à jour");
      router.refresh();
    });
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      aria-label="Changer le statut du devis"
      className="max-w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 disabled:opacity-50"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
