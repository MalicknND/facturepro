"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function LandingHero() {
  return (
    <>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700"
      >
        Devis & factures pour freelances
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
      >
        Créez vos devis et factures{" "}
        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          en quelques clics
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mx-auto mt-6 max-w-2xl text-lg text-slate-600"
      >
        Exportez en PDF, gardez l’historique au même endroit. Design moderne,
        simple et rapide.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          href="/signup"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/30"
        >
          Commencer gratuitement
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-lg border-2 border-slate-200 bg-white px-8 py-3.5 text-base font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          Se connecter
        </Link>
      </motion.div>
    </>
  );
}
