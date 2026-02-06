"use client";

export function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 p-4">
      {children}
    </div>
  );
}
