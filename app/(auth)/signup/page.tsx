"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 2000);
  }

  if (success) {
    return (
      <Card className="w-full max-w-md animate-fade-in">
        <CardContent className="pt-6">
          <p className="text-center text-emerald-600 dark:text-emerald-400">
            Compte créé. Vérifiez votre email si la confirmation est activée, puis connectez-vous.
          </p>
          <p className="mt-2 text-center text-sm text-slate-500">
            Redirection vers la connexion...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">FacturePro</CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Créer un compte
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-500">Minimum 6 caractères</p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </Button>
          <p className="text-center text-sm text-slate-500">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-emerald-600 hover:underline dark:text-emerald-400">
              Se connecter
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
