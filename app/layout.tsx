import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://facturepro-beta.vercel.app"),
  title: {
    default: "FacturePro - Devis & Factures pour freelances",
    template: "%s | FacturePro",
  },
  description:
    "Créez vos devis et factures en quelques clics. Outil de facturation pour freelances : clients, PDF, tableau de bord, conforme à la réglementation française.",
  keywords: [
    "devis",
    "facture",
    "freelance",
    "facturation",
    "auto-entrepreneur",
    "PDF",
    "devis en ligne",
    "facture PDF",
  ],
  authors: [{ name: "FacturePro" }],
  creator: "FacturePro",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "FacturePro - Devis & Factures pour freelances",
    description:
      "Créez vos devis et factures en quelques clics. Tableau de bord, export PDF, gestion clients. Conforme à la réglementation française.",
    siteName: "FacturePro",
  },
  twitter: {
    card: "summary_large_image",
    title: "FacturePro - Devis & Factures pour freelances",
    description: "Créez vos devis et factures en quelques clics. Pour freelances et auto-entrepreneurs.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
