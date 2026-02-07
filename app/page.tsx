import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingHeader } from "@/components/landing-header";
import { Spotlight } from "@/components/aceternity/spotlight";
import { AnimatedGradient } from "@/components/aceternity/animated-gradient";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingCompliance } from "@/components/landing/landing-compliance";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: "Devis et factures en quelques clics pour freelances",
  description:
    "FacturePro : créez vos devis et factures en moins de 2 minutes. Gestion clients, export PDF, numérotation automatique, conforme à la réglementation française. Pour freelances et auto-entrepreneurs.",
  openGraph: {
    title: "FacturePro - Devis et factures en quelques clics pour freelances",
    description:
      "Créez vos devis et factures en moins de 2 minutes. Tableau de bord, PDF, gestion clients. Conforme France.",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHeader />

      {/* Hero — 2 colonnes desktop, stack mobile */}
      <section
        className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-b-[2rem] border-b border-slate-200/80 bg-slate-50 px-4 pb-20 pt-16 md:pb-32 md:pt-24"
        aria-label="Présentation"
      >
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="rgb(16 185 129 / 0.15)"
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <LandingHero />
        </div>
      </section>

      {/* Fonctionnalités — 1 phare + 3 secondaires */}
      <section
        id="fonctionnalites"
        className="relative border-t border-slate-200/80 bg-white px-4 py-20 md:py-28"
        aria-labelledby="features-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="features-heading"
            className="text-center text-3xl font-bold tracking-tight text-slate-900 md:text-4xl"
          >
            Tout ce dont vous avez besoin
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
            Un tableau de bord simple pour gérer vos clients, devis et factures
            en toute sérénité.
          </p>
          <div className="mt-14">
            <LandingFeatures />
          </div>
        </div>
      </section>

      {/* Réassurance légale France */}
      <section
        className="border-t border-slate-200/80 bg-white px-4 py-20 md:py-24"
        aria-labelledby="compliance-heading"
      >
        <div className="mx-auto max-w-6xl">
          <LandingCompliance />
        </div>
      </section>

      {/* CTA final */}
      <section
        className="border-t border-slate-200/80 bg-slate-50 px-4 py-20 md:py-24"
        aria-labelledby="cta-heading"
      >
        <AnimatedGradient className="mx-auto max-w-3xl p-8 md:p-12">
          <div className="text-center">
            <h2
              id="cta-heading"
              className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
            >
              Prêt à simplifier votre facturation ?
            </h2>
            <p className="mt-4 text-slate-600">
              Créez un compte et commencez à éditer vos premiers devis et
              factures.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Créer un compte
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border-2 border-slate-200 bg-white px-8 py-3.5 text-base font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </AnimatedGradient>
      </section>

      <LandingFooter />
    </div>
  );
}
