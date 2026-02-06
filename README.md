# FacturePro

Application web (FR) pour générer des devis et factures en tant que freelance.

## Fonctionnalités MVP

- **Auth** : Connexion email / mot de passe (Supabase Auth)
- **Dashboard** : KPIs (factures du mois, impayés, CA)
- **Clients** : CRUD, recherche, lien « Nouvelle facture »
- **Devis** : Lignes dynamiques, numérotation D-YYYY-0001, statuts (Brouillon, Envoyé, Accepté, Refusé), **Convertir en facture**
- **Factures** : Lignes dynamiques, numérotation F-YYYY-0001, dates émission/échéance, statuts, **Télécharger PDF**
- **Paramètres** : Profil entreprise, logo, TVA (dont franchise art. 293 B), conditions de paiement, mentions légales
- **PDF** : Template A4 (logo, en-tête, client, tableau, totaux HT/TVA/TTC, mentions)

## Prérequis

- Node.js 18+
- Compte [Supabase](https://supabase.com)

## Installation

```bash
npm install
cp .env.example .env
```

1. Créez un projet Supabase, récupérez l’URL et la clé anon (Settings > API).
2. Renseignez `.env` :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Dans l’éditeur SQL Supabase, exécutez le schéma : `supabase/schema.sql`
4. (Optionnel) Créez un bucket Storage `logos` (public) pour les logos entreprise, ou laissez le schéma le créer.
5. Créez un utilisateur : Auth > Users > Add user (email + mot de passe) ou inscrivez-vous depuis l’app (`/login` avec un lien « S’inscrire » si vous l’ajoutez).

## Lancer l’app

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000). Vous serez redirigé vers `/login` puis, après connexion, vers `/dashboard`.

## Parcours rapide (créer une facture en &lt; 2 min)

1. **Paramètres** : Renseigner au moins le nom de l’entreprise (et optionnellement logo, TVA, mentions).
2. **Clients** : Créer un client (nom, email, etc.).
3. **Factures** > **Nouvelle facture** : Choisir le client, ajouter des lignes (description, quantité, prix unitaire). Les totaux se calculent automatiquement.
4. Cliquer **Valider** (ou **Enregistrer brouillon** puis modifier).
5. Sur la page de la facture : **Télécharger PDF**.

## Données de démo

Voir `supabase/seed.sql` pour un exemple de profil entreprise et clients. Remplacez `YOUR_USER_ID` / `USER_ID` par l’UUID de votre utilisateur (Auth > Users dans Supabase) avant d’exécuter les inserts.

## Structure des routes

| Route | Description |
|-------|-------------|
| `/login` | Connexion |
| `/dashboard` | Tableau de bord (KPIs, dernières factures) |
| `/clients` | Liste + recherche |
| `/clients/new` | Nouveau client |
| `/clients/[id]/edit` | Modifier client |
| `/invoices` | Liste factures |
| `/invoices/new` | Nouvelle facture |
| `/invoices/[id]` | Détail + PDF |
| `/invoices/[id]/edit` | Modifier (brouillon uniquement) |
| `/quotes` | Liste devis |
| `/quotes/new` | Nouveau devis |
| `/quotes/[id]` | Détail + PDF + Convertir en facture |
| `/quotes/[id]/edit` | Modifier devis (brouillon) |
| `/settings` | Profil entreprise, TVA, conditions, mentions |

## Stack

- **Next.js 16** (App Router), TypeScript, Tailwind CSS
- **Supabase** : Auth, PostgreSQL, Storage (logos)
- **Formulaires** : react-hook-form, zod, @hookform/resolvers
- **PDF** : jspdf, jspdf-autotable
