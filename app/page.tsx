import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingHeader } from "@/components/landing-header";
import { Spotlight } from "@/components/aceternity/spotlight";
import { BentoGrid, BentoCard } from "@/components/aceternity/bento-grid";
import { AnimatedGradient } from "@/components/aceternity/animated-gradient";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingFeatures } from "@/components/landing/landing-features";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHeader />

      {/* Hero — Aceternity Spotlight + shadcn-style */}
      <section className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-b-[2rem] border-b border-slate-200/80 bg-slate-50 px-4 pb-20 pt-16 md:pb-32 md:pt-24">
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="rgb(16 185 129 / 0.15)"
        />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <LandingHero />
        </div>
      </section>

      {/* Fonctionnalités — Bento Grid style Aceternity + shadcn cards */}
      <section
        id="fonctionnalites"
        className="relative border-t border-slate-200/80 bg-white px-4 py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Tout ce dont vous avez besoin
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Un tableau de bord simple pour gérer vos clients, devis et factures
              en toute sérénité.
            </p>
          </div>

          <LandingFeatures />
        </div>
      </section>

      {/* CTA — shadcn-style card */}
      <section className="border-t border-slate-200/80 bg-slate-50 px-4 py-20 md:py-24">
        <AnimatedGradient className="mx-auto max-w-3xl p-8 md:p-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Prêt à simplifier votre facturation ?
            </h2>
            <p className="mt-4 text-slate-600">
              Créez un compte et commencez à éditer vos premiers devis et factures.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/30"
              >
                Créer un compte
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center rounded-lg border-2 border-slate-200 bg-white px-8 py-3.5 text-base font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </AnimatedGradient>
      </section>

      {/* Footer — minimal shadcn-style */}
      <footer className="border-t border-slate-200/80 bg-white px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row sm:px-6">
          <p className="text-sm text-slate-500">
            © FacturePro — Devis & factures pour freelances
          </p>
          <div className="flex gap-6">
            <Link
              href="/login"
              className="text-sm text-slate-500 transition-colors hover:text-slate-700"
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className="text-sm text-slate-500 transition-colors hover:text-slate-700"
            >
              Inscription
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
