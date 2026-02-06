-- FacturePro – Jeu de données pour tester l'affichage
-- 1) Créez un compte sur le site (signup) puis récupérez votre user ID dans Supabase : Authentication > Users.
-- 2) Remplacez TOUT '0fe351c1-cb50-444d-a01c-dfd9cad403dd' ci-dessous par cet UUID (ex: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890').
-- 3) Exécutez ce script dans l’éditeur SQL Supabase (SQL Editor > New query).
-- Réexécutable : supprime d’abord les devis/factures de démo existants pour ce user.

-- ========== 0. Nettoyage des données de démo existantes (réexécution) ==========
DELETE FROM invoice_lines WHERE invoice_id IN (SELECT id FROM invoices WHERE user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND number IN ('F-2026-0001','F-2026-0002','F-2026-0003','F-2026-0004','F-2026-0005'));
DELETE FROM invoices WHERE user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND number IN ('F-2026-0001','F-2026-0002','F-2026-0003','F-2026-0004','F-2026-0005');
DELETE FROM quote_lines WHERE quote_id IN (SELECT id FROM quotes WHERE user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND number IN ('D-2026-0001','D-2026-0002','D-2026-0003','D-2026-0004','D-2026-0005','D-2026-0006'));
DELETE FROM quotes WHERE user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND number IN ('D-2026-0001','D-2026-0002','D-2026-0003','D-2026-0004','D-2026-0005','D-2026-0006');

-- ========== 1. Profil entreprise ==========
INSERT INTO company_profile (
  user_id, name, address, email, phone, vat_exempt, vat_number,
  payment_delay_days, late_penalty_rate, late_penalty_fixed, legal_mention
)
VALUES (
  '0fe351c1-cb50-444d-a01c-dfd9cad403dd',
  'Studio Dev Pro',
  '42 avenue de la République, 75011 Paris',
  'contact@studiodevpro.fr',
  '01 83 64 12 00',
  false,
  'FR 12 345 678 901',
  30,
  3.00,
  40.00,
  'SASU au capital de 1 000 € – RCS Paris 987 654 321 – TVA intracommunautaire FR 12 345 678 901. Paiement à 30 jours. Indemnités forfaitaires de retard : 40 € + 3 fois le taux d''intérêt légal.'
)
ON CONFLICT (user_id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  vat_number = EXCLUDED.vat_number,
  payment_delay_days = EXCLUDED.payment_delay_days,
  late_penalty_rate = EXCLUDED.late_penalty_rate,
  late_penalty_fixed = EXCLUDED.late_penalty_fixed,
  legal_mention = EXCLUDED.legal_mention,
  updated_at = now();

-- ========== 2. Clients ==========
INSERT INTO clients (user_id, name, address, email, phone, siret) VALUES
  ('0fe351c1-cb50-444d-a01c-dfd9cad403dd', 'Ibrahima', '15 rue du Commerce, 69003 Lyon', 'ibrahima@email.fr', '06 12 34 56 78', NULL),
  ('0fe351c1-cb50-444d-a01c-dfd9cad403dd', 'Sophie Martin', '8 place des Terreaux, 69001 Lyon', 'sophie.martin@proton.me', '06 98 76 54 32', NULL),
  ('0fe351c1-cb50-444d-a01c-dfd9cad403dd', 'TechStart SAS', '3 rue de la Bourse, 75002 Paris', 'compta@techstart.fr', '01 44 55 66 77', '123 456 789 00012'),
  ('0fe351c1-cb50-444d-a01c-dfd9cad403dd', 'Agence Web Lyon', '22 cours Lafayette, 69003 Lyon', 'contact@agenceweblyon.fr', '04 78 12 34 56', '987 654 321 00098'),
  ('0fe351c1-cb50-444d-a01c-dfd9cad403dd', 'Association Culturelle du 5e', '10 rue de la Paix, 69005 Lyon', 'contact@asso-culturelle.fr', '04 72 00 11 22', NULL);

-- ========== 3. Compteurs numérotation (année en cours) ==========
INSERT INTO numbering_counters (user_id, year, type, last_number) VALUES
  ('0fe351c1-cb50-444d-a01c-dfd9cad403dd', extract(year FROM current_date)::int, 'quote', 6),
  ('0fe351c1-cb50-444d-a01c-dfd9cad403dd', extract(year FROM current_date)::int, 'invoice', 5)
ON CONFLICT (user_id, year, type) DO UPDATE SET last_number = GREATEST(numbering_counters.last_number, EXCLUDED.last_number);

-- ========== 4. Devis (avec lignes) ==========
-- Devis 1 – Ibrahima, envoyé
INSERT INTO quotes (user_id, client_id, number, status, issue_date, valid_until, vat_rate, note)
SELECT '0fe351c1-cb50-444d-a01c-dfd9cad403dd', id, 'D-2026-0001', 'sent', '2026-02-06', '2026-03-08', 20, 'Merci pour votre confiance.'
FROM clients WHERE user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND name = 'Ibrahima' LIMIT 1;
INSERT INTO quote_lines (quote_id, description, quantity, unit_price, order_index)
SELECT q.id, 'Développement site vitrine (design + intégration)', 1, 1200.00, 0 FROM quotes q WHERE q.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND q.number = 'D-2026-0001';
INSERT INTO quote_lines (quote_id, description, quantity, unit_price, order_index)
SELECT q.id, 'Formation prise en main CMS (2h)', 1, 180.00, 1 FROM quotes q WHERE q.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND q.number = 'D-2026-0001';

-- Devis 2 – Sophie Martin, brouillon
INSERT INTO quotes (user_id, client_id, number, status, issue_date, valid_until, vat_rate, note)
SELECT '0fe351c1-cb50-444d-a01c-dfd9cad403dd', id, 'D-2026-0002', 'draft', '2026-02-05', '2026-03-05', 20, NULL
FROM clients WHERE user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND name = 'Sophie Martin' LIMIT 1;
INSERT INTO quote_lines (quote_id, description, quantity, unit_price, order_index)
SELECT q.id, 'Refonte logo et charte graphique', 1, 450.00, 0 FROM quotes q WHERE q.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND q.number = 'D-2026-0002';
INSERT INTO quote_lines (quote_id, description, quantity, unit_price, order_index)
SELECT q.id, 'Création cartes de visite (fichiers print)', 1, 120.00, 1 FROM quotes q WHERE q.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND q.number = 'D-2026-0002';

-- Devis 3 – TechStart SAS, accepté
INSERT INTO quotes (user_id, client_id, number, status, issue_date, valid_until, vat_rate, note)
SELECT '0fe351c1-cb50-444d-a01c-dfd9cad403dd', id, 'D-2026-0003', 'accepted', '2026-01-28', '2026-02-28', 20, 'Devis accepté le 02/02/2026.'
FROM clients WHERE user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND name = 'TechStart SAS' LIMIT 1;
INSERT INTO quote_lines (quote_id, description, quantity, unit_price, order_index)
SELECT q.id, 'Application web sur mesure – Phase 1 (étude + maquettes)', 1, 3500.00, 0 FROM quotes q WHERE q.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND q.number = 'D-2026-0003';
INSERT INTO quote_lines (quote_id, description, quantity, unit_price, order_index)
SELECT q.id, 'Hébergement et maintenance annuelle', 1, 600.00, 1 FROM quotes q WHERE q.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND q.number = 'D-2026-0003';

-- Devis 4 – Agence Web Lyon, refusé
INSERT INTO quotes (user_id, client_id, number, status, issue_date, valid_until, vat_rate, note)
SELECT '0fe351c1-cb50-444d-a01c-dfd9cad403dd', id, 'D-2026-0004', 'rejected', '2026-01-15', '2026-02-15', 20, 'Projet reporté.'
FROM clients WHERE user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND name = 'Agence Web Lyon' LIMIT 1;
INSERT INTO quote_lines (quote_id, description, quantity, unit_price, order_index)
SELECT q.id, 'Audit technique et recommandations', 1, 800.00, 0 FROM quotes q WHERE q.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND q.number = 'D-2026-0004';

-- Devis 5 & 6 – pour remplir la liste
INSERT INTO quotes (user_id, client_id, number, status, issue_date, valid_until, vat_rate, note)
SELECT '0fe351c1-cb50-444d-a01c-dfd9cad403dd', id, 'D-2026-0005', 'sent', '2026-02-01', '2026-03-01', 10, NULL
FROM clients WHERE user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND name = 'Association Culturelle du 5e' LIMIT 1;
INSERT INTO quote_lines (quote_id, description, quantity, unit_price, order_index)
SELECT q.id, 'Mise à jour site WordPress + formation', 1, 350.00, 0 FROM quotes q WHERE q.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND q.number = 'D-2026-0005';

INSERT INTO quotes (user_id, client_id, number, status, issue_date, valid_until, vat_rate, note)
SELECT '0fe351c1-cb50-444d-a01c-dfd9cad403dd', id, 'D-2026-0006', 'draft', '2026-02-04', '2026-03-04', 20, NULL
FROM clients WHERE user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND name = 'Ibrahima' LIMIT 1;
INSERT INTO quote_lines (quote_id, description, quantity, unit_price, order_index)
SELECT q.id, 'Maintenance corrective (forfait 5h)', 1, 250.00, 0 FROM quotes q WHERE q.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND q.number = 'D-2026-0006';

-- ========== 5. Factures (avec lignes) ==========
-- Facture 1 – Ibrahima, envoyée (liée au devis D-2026-0001)
INSERT INTO invoices (user_id, client_id, number, status, issue_date, due_date, vat_rate, note, quote_id)
SELECT '0fe351c1-cb50-444d-a01c-dfd9cad403dd', c.id, 'F-2026-0001', 'sent', '2026-02-06', '2026-03-08', 20, 'Paiement par virement. Merci.', q.id
FROM clients c, quotes q
WHERE c.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND c.name = 'Ibrahima' AND q.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND q.number = 'D-2026-0001' LIMIT 1;
INSERT INTO invoice_lines (invoice_id, description, quantity, unit_price, order_index)
SELECT i.id, 'Développement site vitrine (design + intégration)', 1, 1200.00, 0 FROM invoices i WHERE i.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND i.number = 'F-2026-0001';
INSERT INTO invoice_lines (invoice_id, description, quantity, unit_price, order_index)
SELECT i.id, 'Formation prise en main CMS (2h)', 1, 180.00, 1 FROM invoices i WHERE i.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND i.number = 'F-2026-0001';

-- Facture 2 – Sophie Martin, brouillon
INSERT INTO invoices (user_id, client_id, number, status, issue_date, due_date, vat_rate, note, quote_id)
SELECT '0fe351c1-cb50-444d-a01c-dfd9cad403dd', id, 'F-2026-0002', 'draft', '2026-02-05', '2026-03-07', 20, NULL, NULL
FROM clients WHERE user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND name = 'Sophie Martin' LIMIT 1;
INSERT INTO invoice_lines (invoice_id, description, quantity, unit_price, order_index)
SELECT i.id, 'Refonte logo et charte graphique', 1, 450.00, 0 FROM invoices i WHERE i.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND i.number = 'F-2026-0002';

-- Facture 3 – TechStart SAS, payée
INSERT INTO invoices (user_id, client_id, number, status, issue_date, due_date, vat_rate, note, quote_id)
SELECT '0fe351c1-cb50-444d-a01c-dfd9cad403dd', id, 'F-2026-0003', 'paid', '2026-02-02', '2026-03-04', 20, 'Paiement reçu le 05/02/2026.', NULL
FROM clients WHERE user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND name = 'TechStart SAS' LIMIT 1;
INSERT INTO invoice_lines (invoice_id, description, quantity, unit_price, order_index)
SELECT i.id, 'Application web – Phase 1 (étude + maquettes)', 1, 3500.00, 0 FROM invoices i WHERE i.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND i.number = 'F-2026-0003';
INSERT INTO invoice_lines (invoice_id, description, quantity, unit_price, order_index)
SELECT i.id, 'Hébergement et maintenance annuelle', 1, 600.00, 1 FROM invoices i WHERE i.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND i.number = 'F-2026-0003';

-- Facture 4 – Agence Web Lyon, en retard
INSERT INTO invoices (user_id, client_id, number, status, issue_date, due_date, vat_rate, note, quote_id)
SELECT '0fe351c1-cb50-444d-a01c-dfd9cad403dd', id, 'F-2026-0004', 'overdue', '2026-01-10', '2026-02-09', 20, 'Relance envoyée.', NULL
FROM clients WHERE user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND name = 'Agence Web Lyon' LIMIT 1;
INSERT INTO invoice_lines (invoice_id, description, quantity, unit_price, order_index)
SELECT i.id, 'Développement module reporting', 1, 2200.00, 0 FROM invoices i WHERE i.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND i.number = 'F-2026-0004';
INSERT INTO invoice_lines (invoice_id, description, quantity, unit_price, order_index)
SELECT i.id, 'Mise en production et documentation', 1, 400.00, 1 FROM invoices i WHERE i.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND i.number = 'F-2026-0004';

-- Facture 5 – Association, envoyée
INSERT INTO invoices (user_id, client_id, number, status, issue_date, due_date, vat_rate, note, quote_id)
SELECT '0fe351c1-cb50-444d-a01c-dfd9cad403dd', id, 'F-2026-0005', 'sent', '2026-02-01', '2026-03-03', 10, 'TVA 10% – association.', NULL
FROM clients WHERE user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND name = 'Association Culturelle du 5e' LIMIT 1;
INSERT INTO invoice_lines (invoice_id, description, quantity, unit_price, order_index)
SELECT i.id, 'Mise à jour site WordPress + formation', 1, 350.00, 0 FROM invoices i WHERE i.user_id = '0fe351c1-cb50-444d-a01c-dfd9cad403dd' AND i.number = 'F-2026-0005';
