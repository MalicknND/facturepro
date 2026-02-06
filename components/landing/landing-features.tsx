"use client";

import { motion } from "framer-motion";
import { Zap, Users, FileSpreadsheet, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const mainFeature = {
  icon: Zap,
  badge: "Phare",
  title: "Facture en moins de 2 minutes",
  description:
    "Lignes dynamiques, calcul HT/TVA/TTC, numérotation automatique, PDF prêt à envoyer.",
};

const secondaryFeatures = [
  {
    icon: Users,
    title: "Gestion clients",
    description:
      "Liste, recherche et fiches clients. Créez une facture en un clic depuis un client.",
  },
  {
    icon: FileSpreadsheet,
    title: "Devis",
    description:
      "Lignes dynamiques, numérotation D-YYYY-0001. Convertissez un devis accepté en facture.",
  },
  {
    icon: Download,
    title: "Export PDF",
    description:
      "Factures et devis en PDF professionnel : logo, en-tête, totaux, mentions légales.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function LandingFeatures() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="space-y-6"
    >
      {/* Card principale — plus large, highlight */}
      <motion.div variants={item} className="lg:col-span-3">
        <div
          className={cn(
            "rounded-2xl border-2 border-emerald-200/80 bg-white p-6 shadow-lg shadow-emerald-500/5 sm:p-8",
            "ring-2 ring-emerald-500/10"
          )}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25">
                <mainFeature.icon className="h-7 w-7" />
              </span>
              <div>
                <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  {mainFeature.badge}
                </span>
                <h3 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  {mainFeature.title}
                </h3>
                <p className="mt-2 max-w-2xl text-slate-600">
                  {mainFeature.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3 cards secondaires */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {secondaryFeatures.map((f) => (
          <motion.div key={f.title} variants={item}>
            <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-emerald-600">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {f.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
