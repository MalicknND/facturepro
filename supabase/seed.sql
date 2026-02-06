-- Données de démonstration FacturePro
-- 1) Créez un compte (Auth > Users ou inscription depuis /login avec signUp).
-- 2) Copiez l’UUID de l’utilisateur dans Supabase (Authentication > Users).
-- 3) Remplacez YOUR_USER_ID ci-dessous par cet UUID puis exécutez ce script.

-- SET @user_id = 'YOUR_USER_ID';  -- Remplacez par votre user ID
-- En Supabase SQL Editor, utilisez une variable ou remplacez manuellement :

-- Exemple (remplacez par votre UUID) :
-- INSERT INTO company_profile (user_id, name, address, email, phone, vat_exempt, payment_delay_days, legal_mention)
-- VALUES
--   ('VOTRE-UUID-ICI', 'Mon Entreprise SAS', '123 rue Example, 75001 Paris', 'contact@monentreprise.fr', '01 23 45 67 89', false, 30, 'SAS au capital de 10 000 € - RCS Paris 123 456 789 - Conditions : paiement à 30 jours, pénalités de retard 3 fois le taux d''intérêt légal.')
-- ON CONFLICT (user_id) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address, updated_at = now();

-- Clients de démo (remplacez USER_ID)
-- INSERT INTO clients (user_id, name, address, email, phone, siret)
-- VALUES
--   ('USER_ID', 'Client Alpha', '1 place Client, 69001 Lyon', 'alpha@client.fr', '04 78 00 00 01', '12345678901234'),
--   ('USER_ID', 'Client Beta', '2 avenue Beta, 33000 Bordeaux', 'beta@client.fr', '05 56 00 00 02', null);

-- Après avoir inséré company_profile et clients, récupérez les IDs des clients puis :
-- Devis et facture de démo (remplacez USER_ID et CLIENT_ID)
-- INSERT INTO numbering_counters (user_id, year, type, last_number) VALUES
--   ('USER_ID', extract(year from current_date)::int, 'invoice', 1),
--   ('USER_ID', extract(year from current_date)::int, 'quote', 1);
-- Puis créez une facture / un devis depuis l’app pour tester le flux complet.
