"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  FileText,
  Download,
  Settings,
  Zap,
  Shield,
} from "lucide-react";
import { BentoGrid, BentoCard } from "@/components/aceternity/bento-grid";

const features = [
  {
    icon: LayoutDashboard,
    title: "Tableau de bord",
    description:
      "Vue d’ensemble : factures du mois, chiffre d’affaires et impayés en un coup d’œil.",
  },
  {
    icon: Users,
    title: "Gestion des clients",
    description:
      "Liste, recherche et fiches clients (nom, adresse, email, téléphone, SIRET). Créez une facture en un clic depuis un client.",
  },
  {
    icon: FileSpreadsheet,
    title: "Devis",
    description:
      "Lignes dynamiques, calcul automatique HT / TVA / TTC, numérotation D-YYYY-0001. Statuts : Brouillon, Envoyé, Accepté, Refusé. Convertissez un devis accepté en facture.",
  },
  {
    icon: FileText,
    title: "Factures",
    description:
      "Création rapide avec lignes modulables, dates d’émission et d’échéance. Numérotation F-YYYY-0001. Statuts : Brouillon, Envoyée, Payée, En retard.",
  },
  {
    icon: Download,
    title: "Export PDF",
    description:
      "Téléchargez des factures et devis en PDF professionnel (logo, en-tête, client, tableau, totaux, mentions légales).",
  },
  {
    icon: Settings,
    title: "Profil entreprise",
    description:
      "Nom, adresse, logo, option TVA non applicable (art. 293 B du CGI), conditions de paiement, pénalités de retard et mentions légales.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
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
      <BentoGrid>
        {features.map((f, i) => (
          <motion.div key={f.title} variants={item}>
            <BentoCard
              icon={f.icon}
              title={f.title}
              description={f.description}
            />
          </motion.div>
        ))}
      </BentoGrid>

      {/* Accroches style Aceternity */}
      <div className="mt-16 flex flex-col items-center justify-center gap-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 sm:flex-row sm:gap-10 sm:p-8">
        <div className="flex items-center gap-3 text-slate-600">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Zap className="h-5 w-5" />
          </span>
          <span className="text-sm font-medium">
            Création de facture en moins de 2 minutes
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Shield className="h-5 w-5" />
          </span>
          <span className="text-sm font-medium">
            Données isolées par compte (multi-tenant)
          </span>
        </div>
      </div>
    </motion.div>
  );
}
