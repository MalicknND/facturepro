# FacturePro

Application web en français pour créer et gérer **devis** et **factures** en tant que freelance. Interface moderne, export PDF et tableau de bord simple.

![Stack](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-green?logo=supabase)

---

## Fonctionnalités

| Module | Description |
|--------|-------------|
| **Authentification** | Connexion / inscription par email (Supabase Auth) |
| **Tableau de bord** | KPIs (factures du mois, CA, impayés), dernières factures |
| **Clients** | Liste, recherche, création / édition. Type **Particulier** ou **Entreprise** (raison sociale, SIRET/SIREN, personne à contacter) |
| **Devis** | Lignes dynamiques, numérotation D-YYYY-0001, statuts (Brouillon, Envoyé, Accepté, Refusé), **convertir en facture**, PDF |
| **Factures** | Lignes dynamiques, numérotation F-YYYY-0001, émission/échéance, statuts (Brouillon, Envoyée, Payée, En retard), **téléchargement PDF** |
| **Paramètres** | Profil entreprise (nom, adresse, logo), TVA (dont franchise 293 B), conditions de paiement, mentions légales |
| **Landing** | Page d’accueil publique, fonctionnalités, conformité France, liens légaux |

L’application est **responsive** (menu mobile, tableaux scrollables, formulaires adaptés).

---

## Prérequis

- **Node.js** 18+
- Compte [Supabase](https://supabase.com) (gratuit)

---

## Installation

```bash
git clone <repo>
cd facture
npm install
```

### 1. Variables d’environnement

Créez un fichier `.env.local` à la racine (ou copiez `.env.example` si présent) :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

Récupérez l’URL et la clé anon dans Supabase : **Settings → API**.

### 2. Base de données

1. Dans l’**éditeur SQL** Supabase, exécutez dans l’ordre :
   - `supabase/schema.sql` (tables, RLS, storage)
   - `supabase/migrations/20260206_client_type.sql` (si le schéma n’inclut pas déjà `client_type` / `contact_name`)

2. (Optionnel) Créez un bucket Storage **logos** (public) pour les logos entreprise, ou laissez le script du schéma le faire.

### 3. Premier utilisateur

- **Inscription** : allez sur `/signup` et créez un compte.
- Ou dans Supabase : **Authentication → Users → Add user**.

---

## Lancer l’application

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

- **Non connecté** : page d’accueil (landing), liens Connexion / Créer un compte.
- **Connecté** : redirection vers `/dashboard`.

---

## Parcours rapide (facture en moins de 2 min)

1. **Paramètres** : renseigner au moins le nom de l’entreprise (logo, TVA, mentions optionnels).
2. **Clients** : **Nouveau client** → choisir Particulier ou Entreprise, remplir nom/raison sociale, coordonnées, SIRET ou SIREN (9 ou 14 chiffres).
3. **Factures** → **Nouvelle facture** : sélectionner le client, ajouter des lignes (description, quantité, prix unitaire). Les totaux HT/TVA/TTC se calculent automatiquement.
4. **Valider** (ou **Enregistrer brouillon** puis modifier).
5. Sur la page de la facture : **Télécharger PDF**.

---

## Données de démonstration

Le fichier `supabase/seed.sql` contient un jeu de données (profil entreprise, clients, devis, factures).  
Remplacez toutes les occurrences de l’UUID utilisateur par le vôtre (Supabase → **Authentication → Users**), puis exécutez le script dans l’éditeur SQL.

---

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Démarrer le serveur après build |
| `npm run lint` | Vérification ESLint |

---

## Structure des routes

| Route | Description |
|-------|-------------|
| `/` | Landing (accueil public) |
| `/login`, `/signup` | Connexion, inscription |
| `/dashboard` | Tableau de bord |
| `/clients` | Liste clients + recherche |
| `/clients/new`, `/clients/[id]/edit` | Création / édition client |
| `/invoices` | Liste factures |
| `/invoices/new`, `/invoices/[id]`, `/invoices/[id]/edit` | Création, détail, édition facture |
| `/quotes` | Liste devis |
| `/quotes/new`, `/quotes/[id]`, `/quotes/[id]/edit` | Création, détail, édition devis |
| `/settings` | Profil entreprise (paramètres) |
| `/mentions-legales`, `/politique-confidentialite`, `/contact` | Pages légales et contact |

---

## Stack technique

- **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS**
- **Supabase** : Auth, PostgreSQL, Storage (logos)
- **Formulaires** : react-hook-form, zod, @hookform/resolvers
- **PDF** : jspdf, jspdf-autotable
- **UI** : composants personnalisés, Lucide icons, Framer Motion (landing)

---

## Documentation détaillée

Voir **[DOC.md](./DOC.md)** pour l’architecture, le schéma de base de données, les flux métier, l’API et le déploiement.

---

## Licence

Projet privé / usage personnel ou commercial selon votre contexte.
