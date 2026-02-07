import type { Metadata } from "next";
import Link from "next/link";
import { LandingHeader } from "@/components/landing-header";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez FacturePro pour toute question sur l'outil de devis et factures pour freelances.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHeader />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Contact
        </h1>
        <p className="mt-4 text-slate-600">
          Pour toute question concernant FacturePro, vous pouvez nous contacter
          par email. Cette page pourra être complétée avec un formulaire ou des
          coordonnées.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-emerald-600 hover:underline"
        >
          ← Retour à l&apos;accueil
        </Link>
      </main>
    </div>
  );
}
