import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <p className="text-6xl font-bold tracking-tight text-slate-200 md:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 md:text-3xl">
          Page introuvable
        </h1>
        <p className="mt-3 max-w-md text-slate-600">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <Home className="h-4 w-4" />
            Accueil
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
