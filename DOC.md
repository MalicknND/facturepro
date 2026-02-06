# Documentation FacturePro

Documentation technique et fonctionnelle du projet FacturePro.

---

## Sommaire

1. [Architecture](#1-architecture)
2. [Schéma de base de données](#2-schéma-de-base-de-données)
3. [Authentification et autorisation](#3-authentification-et-autorisation)
4. [Flux métier](#4-flux-métier)
5. [Numérotation](#5-numérotation)
6. [Génération PDF](#6-génération-pdf)
7. [API](#7-api)
8. [Personnalisation](#8-personnalisation)
9. [Déploiement](#9-déploiement)

---

## 1. Architecture

### Stack

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 16 (App Router) |
| Langage | TypeScript |
| Styles | Tailwind CSS 4 |
| Backend / Auth / DB | Supabase (Auth, PostgreSQL, Storage) |
| Formulaires | react-hook-form, zod, @hookform/resolvers |
| PDF | jspdf, jspdf-autotable |

### Structure des dossiers

```
app/
  (auth)/          # Layout + pages login, signup
  (dashboard)/     # Layout (sidebar, topbar) + pages protégées
  api/             # Routes API (PDF factures, devis)
  page.tsx         # Landing publique
  layout.tsx       # Racine (fonts, ToastProvider)
  globals.css
components/
  layout/          # Sidebar, Topbar (menu mobile)
  landing/         # Hero, Features, Compliance, Footer, ProductPreview
  ui/              # Button, Card, Input, Label, Toast, StatusBadge
  auth-layout-wrapper.tsx
  landing-header.tsx
lib/
  utils.ts         # formatCurrency, formatDate, cn
  numbering.ts    # getNextNumber (F/D + année + séquence)
  pdf-invoice.ts   # generatePdf (facture + devis)
  supabase/        # client (browser), server, middleware (session)
types/
  database.ts      # Client, Quote, Invoice, CompanyProfile, etc.
supabase/
  schema.sql       # Schéma complet (tables, RLS, storage)
  migrations/      # Migrations optionnelles (ex. client_type)
  seed.sql         # Données de démo
```

### Rendu côté serveur / client

- **Server Components** : listes (clients, factures, devis), détail facture/devis, paramètres, dashboard.
- **Client Components** : formulaires (react-hook-form), sélecteurs de statut, menu mobile, landing (animations), toasts.

---

## 2. Schéma de base de données

Modèle multi-tenant : toutes les données sont filtrées par `user_id` (RLS).

### Tables principales

| Table | Rôle |
|-------|------|
| **company_profile** | Un enregistrement par utilisateur : nom, adresse, email, phone, logo_url, TVA (vat_exempt, vat_number), délai de paiement, pénalités de retard, mentions légales. |
| **clients** | name, client_type (person \| company), contact_name, address, email, phone, siret (SIREN 9 chiffres ou SIRET 14 chiffres). |
| **quotes** | client_id, number (D-YYYY-0001), status (draft, sent, accepted, rejected), issue_date, valid_until, vat_rate, note. |
| **quote_lines** | quote_id, description, quantity, unit_price, order_index. |
| **invoices** | client_id, number (F-YYYY-0001), status (draft, sent, paid, overdue), issue_date, due_date, vat_rate, note, quote_id (optionnel, lien vers devis converti). |
| **invoice_lines** | invoice_id, description, quantity, unit_price, order_index. |
| **numbering_counters** | user_id, year, type (invoice \| quote), last_number. Clé unique (user_id, year, type). |

### Contraintes et RLS

- `company_profile.user_id` UNIQUE.
- `quotes(user_id, number)` et `invoices(user_id, number)` UNIQUE.
- RLS : chaque table vérifie `auth.uid() = user_id` (ou accès via la table parent pour les lignes).
- Storage : bucket `logos`, policies par `user_id` pour l’upload, lecture publique des logos.

### Migration client_type

Le fichier `supabase/migrations/20260206_client_type.sql` ajoute :

- `clients.client_type` : `'person'` (défaut) ou `'company'`.
- `clients.contact_name` : personne à contacter (surtout pour les entreprises).

À exécuter si le schéma initial n’inclut pas ces colonnes.

---

## 3. Authentification et autorisation

### Supabase Auth

- Connexion / inscription par **email + mot de passe**.
- Session gérée par `@supabase/ssr` (cookies) dans le middleware.

### Middleware

- Fichier : `middleware.ts` → appelle `updateSession` (`lib/supabase/middleware.ts`).
- Pages **publiques** : `/`, `/login`, `/signup`, `/mentions-legales`, `/politique-confidentialite`, `/contact`.
- Utilisateur connecté sur `/` → redirection vers `/dashboard`.
- Utilisateur non connecté sur une route protégée → redirection vers `/login`.

### RLS

Toutes les requêtes Supabase côté serveur utilisent le client dont la session est liée à l’utilisateur ; les politiques RLS limitent les lignes à son `user_id`.

---

## 4. Flux métier

### Création d’une facture

1. **Paramètres** : au moins le nom de l’entreprise (optionnel : logo, TVA, mentions).
2. **Clients** : créer un client (Particulier ou Entreprise ; SIRET/SIREN optionnel ou recommandé).
3. **Factures → Nouvelle facture** : choix du client, dates émission/échéance, TVA %, lignes (description, quantité, prix unitaire). Calcul automatique HT/TVA/TTC.
4. **Enregistrer brouillon** ou **Valider**.
5. Page détail : **Télécharger PDF**, **Modifier** (si brouillon), **Changer le statut** (sélecteur).

### Devis → Facture

1. Créer un **devis** (même principe que la facture, avec date « valide jusqu’au »).
2. Sur la page du devis : **Convertir en facture** (bouton affiché selon statut / édition).
3. Une facture est créée avec les mêmes lignes et un lien `quote_id` ; numéro de facture auto (F-YYYY-XXXX).

### Statuts

- **Devis** : Brouillon, Envoyé, Accepté, Refusé. Modifiables depuis la liste ou la page détail (sélecteur).
- **Factures** : Brouillon, Envoyée, Payée, En retard. Idem.

---

## 5. Numérotation

- **Devis** : `D-YYYY-0001`, `D-YYYY-0002`, …
- **Factures** : `F-YYYY-0001`, `F-YYYY-0002`, …

Logique dans `lib/numbering.ts` : lecture/mise à jour de `numbering_counters` (par user, année, type). Les numéros sont uniques par utilisateur et par année.

---

## 6. Génération PDF

- **Fichier** : `lib/pdf-invoice.ts`, fonction `generatePdf(data)`.
- **Données** : numéro, dates, TVA, profil entreprise, client, lignes, type (`invoice` | `quote`).
- **Contenu** : logo (si présent), bloc entreprise, bloc client (nom/raison sociale, « À l’attention de » si entreprise + contact_name), tableau des lignes, totaux HT/TVA/TTC, mentions légales.
- **Client entreprise** : si `client_type === 'company'` et `contact_name`, affichage « À l’attention de : … ».
- **SIRET / SIREN** : si 9 chiffres → libellé SIREN, si 14 → SIRET.
- **Routes API** : `GET /api/invoices/[id]/pdf`, `GET /api/quotes/[id]/pdf` (protégées par session, renvoie le PDF en binaire).

---

## 7. API

### Routes API internes

| Méthode | Route | Description |
|--------|--------|-------------|
| GET | `/api/invoices/[id]/pdf` | Génère et renvoie le PDF de la facture (attachment). |
| GET | `/api/quotes/[id]/pdf` | Génère et renvoie le PDF du devis (attachment). |

Les deux routes vérifient que l’utilisateur est connecté et que la facture/devis lui appartient (via les requêtes Supabase et RLS).

### Server Actions

- **Devis** : `app/(dashboard)/quotes/[id]/actions.ts` → `updateQuoteStatus(quoteId, status)`.
- **Factures** : `app/(dashboard)/invoices/[id]/actions.ts` → `updateInvoiceStatus(invoiceId, status)`.

Utilisées par les composants de sélection de statut (liste et détail).

---

## 8. Personnalisation

### Profil entreprise

- **Paramètres** : nom, adresse, email, téléphone, logo (upload Storage), TVA (exonération 293 B, numéro de TVA), délai de paiement, pénalités de retard, mentions légales.
- Ces informations sont utilisées sur les PDF et les pages détail.

### Thème / styles

- Couleur principale : **emerald** (boutons, liens, accents). Rechercher `emerald` dans les composants et `globals.css` pour adapter.
- Cartes : `rounded-2xl`, bordures `slate-200/80`.
- Fond général : `slate-50`.

### Textes et libellés

- Libellés statuts : dans `quote-status-select.tsx` et `invoice-status-select.tsx` (tableaux OPTIONS).
- Libellés PDF : dans `lib/pdf-invoice.ts` (titres, « Client », « À l’attention de », « SIRET » / « SIREN », etc.).

---

## 9. Déploiement

### Build

```bash
npm run build
npm run start
```

Variables d’environnement en production : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ex. Vercel, variables d’environnement).

### Supabase

- Conserver les mêmes URL et clé anon que en dev, ou créer un projet Supabase dédié à la prod.
- Exécuter le schéma (et les migrations) sur la base de production.
- Vérifier les **URL autorisées** dans Supabase (Authentication → URL Configuration) pour le domaine de production.

### Recommandations

- Activer la **confirmation d’email** dans Supabase si besoin (Auth → Providers → Email).
- Sauvegardes régulières de la base Supabase.
- Logos : bucket `logos` en lecture publique ; les URLs sont stockées dans `company_profile.logo_url`.

---

## Référence rapide des types (TypeScript)

- **Client** : `ClientType = 'person' | 'company'` ; champs optionnels `client_type`, `contact_name` ; `siret` peut être SIREN (9) ou SIRET (14).
- **Quote** : `QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected'`.
- **Invoice** : `InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'`.
- **CompanyProfile** : champs entreprise (name, address, vat_exempt, legal_mention, etc.).

Voir `types/database.ts` pour les interfaces complètes.
