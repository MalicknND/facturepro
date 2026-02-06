"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight text-slate-900 sm:text-xl"
        >
          FacturePro
        </Link>
        <nav className="hidden items-center gap-1 sm:flex sm:gap-2">
          <a
            href="#fonctionnalites"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Fonctionnalités
          </a>
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-emerald-700"
          >
            Créer un compte
          </Link>
        </nav>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 sm:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="border-t border-slate-200/80 bg-white px-4 py-3 sm:hidden">
          <nav className="flex flex-col gap-1" aria-label="Navigation mobile">
            <a
              href="#fonctionnalites"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => setMobileOpen(false)}
            >
              Fonctionnalités
            </a>
            <Link
              href="/login"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => setMobileOpen(false)}
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
              onClick={() => setMobileOpen(false)}
            >
              Créer un compte
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
