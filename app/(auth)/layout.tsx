import type { Metadata } from "next";
import { AuthLayoutWrapper } from "@/components/auth-layout-wrapper";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à FacturePro pour gérer vos devis et factures.",
  robots: { index: false, follow: true },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayoutWrapper>{children}</AuthLayoutWrapper>;
}
