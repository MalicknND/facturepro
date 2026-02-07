"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  className?: string;
  compact?: boolean;
};

export function ContactForm({ className, compact }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [fallbackEmail, setFallbackEmail] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const message = (formData.get("message") as string)?.trim();

    if (!name || !email || !message) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else if (res.status === 503 && data.fallback) {
        setFallbackEmail(data.fallback);
        setStatus("error");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={`rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center ${className ?? ""}`}>
        <p className="font-medium text-emerald-800">Message envoyé.</p>
        <p className="mt-1 text-sm text-emerald-700">
          Nous vous répondrons dans les meilleurs délais.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 ${className ?? ""}`}
    >
      <div className={compact ? "grid gap-4 sm:grid-cols-2" : "space-y-4"}>
        <div>
          <Label htmlFor="contact-name">Nom *</Label>
          <Input
            id="contact-name"
            name="name"
            required
            placeholder="Votre nom"
            className="mt-1"
            disabled={status === "loading"}
          />
        </div>
        <div>
          <Label htmlFor="contact-email">Email *</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="vous@exemple.fr"
            className="mt-1"
            disabled={status === "loading"}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="contact-message">Message *</Label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={compact ? 3 : 5}
          placeholder="Votre message..."
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 disabled:opacity-50"
          disabled={status === "loading"}
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600">
          {fallbackEmail ? (
            <>
              L&apos;envoi par formulaire n&apos;est pas encore configuré. Écrivez-nous à{" "}
              <a href={`mailto:${fallbackEmail}`} className="underline">
                {fallbackEmail}
              </a>
            </>
          ) : (
            "Une erreur est survenue. Réessayez ou contactez-nous par email."
          )}
        </p>
      )}
      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? "Envoi..." : "Envoyer"}
      </Button>
    </form>
  );
}
