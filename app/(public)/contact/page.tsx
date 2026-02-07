import type { Metadata } from "next";
import { LandingHeader } from "@/components/landing-header";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez FacturePro pour toute question sur l'outil de devis et factures pour freelances.",
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
          Une question sur FacturePro, un problème technique ou une suggestion ?
          Utilisez le formulaire ci-dessous ou écrivez-nous par email.
        </p>

        <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Envoyer un message
          </h2>
          <ContactForm className="mt-6" />
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Vous pouvez aussi nous écrire directement à{" "}
          <a
            href="mailto:contact@facturepro.fr"
            className="text-emerald-600 hover:underline"
          >
            contact@facturepro.fr
          </a>
          . Pour toute question relative à vos données personnelles (RGPD),
          indiquez-le dans votre message.
        </p>
      </main>
    </div>
  );
}
