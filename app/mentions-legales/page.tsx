import type { Metadata } from "next";
import Link from "next/link";
import { LandingHeader } from "@/components/landing-header";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de FacturePro : éditeur, hébergeur, conditions d'utilisation.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHeader />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Mentions légales
        </h1>
        <p className="mt-4 text-slate-600">
          Cette page sera complétée avec les mentions légales de FacturePro
          (éditeur, hébergeur, etc.).
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
