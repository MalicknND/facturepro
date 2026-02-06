"use client";

import { motion } from "framer-motion";
import { FileCheck, ListOrdered, Scale } from "lucide-react";

const items = [
  {
    icon: ListOrdered,
    title: "Numérotation chronologique et unique",
    description: "Chaque facture et devis a un numéro séquentiel par année, sans doublon.",
  },
  {
    icon: FileCheck,
    title: "Mentions obligatoires & conditions de paiement",
    description: "Conçu pour couvrir les mentions essentielles : délai, pénalités de retard, indemnité forfaitaire.",
  },
  {
    icon: Scale,
    title: "Gestion TVA + option « TVA non applicable — art. 293 B du CGI »",
    description: "TVA classique ou franchise en base : une case pour adapter vos documents à votre régime.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function LandingCompliance() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 sm:p-8 md:p-10"
    >
      <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Conforme aux exigences de facturation en France
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
        Conçu pour couvrir les mentions essentielles attendues sur vos factures
        et devis. FacturePro ne constitue pas une certification officielle.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <motion.div
            key={c.title}
            variants={item}
            className="flex gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <c.icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold text-slate-900">{c.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{c.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
