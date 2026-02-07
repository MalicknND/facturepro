import { LandingFooter } from "@/components/landing/landing-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <LandingFooter />
    </>
  );
}
