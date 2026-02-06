"use client";

import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start sm:gap-12">
          <div className="text-center sm:text-left">
            <p className="text-sm text-slate-500">
              © FacturePro — Devis & factures pour freelances
            </p>
          </div>
          <nav
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8"
            aria-label="Pied de page"
          >
            <Link
              href="/mentions-legales"
              className="text-sm text-slate-500 transition-colors hover:text-slate-700"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="text-sm text-slate-500 transition-colors hover:text-slate-700"
            >
              Politique de confidentialité
            </Link>
            <Link
              href="/contact"
              className="text-sm text-slate-500 transition-colors hover:text-slate-700"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="text-sm text-slate-500 transition-colors hover:text-slate-700"
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
            >
              Inscription
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
