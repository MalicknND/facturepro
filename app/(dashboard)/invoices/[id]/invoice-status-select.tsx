"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateInvoiceStatus } from "./actions";
import { useToast } from "@/components/ui/toast";
import type { InvoiceStatus } from "@/types/database";

const OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: "draft", label: "Brouillon" },
  { value: "sent", label: "Envoyée" },
  { value: "paid", label: "Payée" },
  { value: "overdue", label: "En retard" },
];

export function InvoiceStatusSelect({
  invoiceId,
  currentStatus,
}: {
  invoiceId: string;
  currentStatus: InvoiceStatus;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value as InvoiceStatus;
    if (status === currentStatus) return;
    startTransition(async () => {
      const result = await updateInvoiceStatus(invoiceId, status);
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
      aria-label="Changer le statut de la facture"
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
